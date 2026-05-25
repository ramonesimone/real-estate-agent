import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { logger } from '../lib/logger.js'
import { InMemoryQueue } from './inMemoryQueue.js'

const hasRedis = !!process.env.REDIS_URL

type JobHandler = (data: Record<string, unknown>) => Promise<void>

export type JobDataMap = {
  'respond-to-new-lead': { leadId: string }
  'qualify-lead': { leadId: string; message: string }
  'send-nurture-step': { leadId: string; step: number }
  'match-property': { propertyId: string }
}

interface QueueInstance {
  name: string
  add(jobName: string, data: Record<string, unknown>, opts?: { delay?: number }): Promise<{ id: string }>
  getJobs(states: string[]): Promise<Array<{ data: Record<string, unknown>; remove: () => Promise<void> }>>
  close(): Promise<void>
}

let respondQueue: QueueInstance
let qualifyQueue: QueueInstance
let nurtureQueue: QueueInstance
let matchQueue: QueueInstance

let bullMqConnection: IORedis.Redis | null = null
let bullMqWorkers: Worker[] = []

if (hasRedis) {
  bullMqConnection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  })

  respondQueue = new Queue('respond-to-new-lead', { connection: bullMqConnection })
  qualifyQueue = new Queue('qualify-lead', { connection: bullMqConnection })
  nurtureQueue = new Queue('send-nurture-step', { connection: bullMqConnection })
  matchQueue = new Queue('match-property', { connection: bullMqConnection })

  logger.info('Using Redis-backed BullMQ queues')
} else {
  respondQueue = new InMemoryQueue('respond-to-new-lead')
  qualifyQueue = new InMemoryQueue('qualify-lead')
  nurtureQueue = new InMemoryQueue('send-nurture-step')
  matchQueue = new InMemoryQueue('match-property')

  logger.info('REDIS_URL not set — using in-memory queues (jobs lost on restart)')
}

export { respondQueue, qualifyQueue, nurtureQueue, matchQueue }

const queueMap: Record<string, QueueInstance> = {
  'respond-to-new-lead': respondQueue,
  'qualify-lead': qualifyQueue,
  'send-nurture-step': nurtureQueue,
  'match-property': matchQueue,
}

export async function shutdownQueues() {
  const all = [respondQueue, qualifyQueue, nurtureQueue, matchQueue]

  if (hasRedis && bullMqConnection) {
    for (const w of bullMqWorkers) await w.close()
    all.push({ close: () => bullMqConnection!.quit(), name: '', add: null as any, getJobs: null as any } as any)
  }

  await Promise.all(all.map(q => q.close()))
}

export function createWorker<Name extends keyof JobDataMap>(
  queueName: Name,
  handler: (job: { data: JobDataMap[Name] }) => Promise<void>
) {
  if (!hasRedis) {
    const queue = queueMap[queueName]
    if (!queue) throw new Error(`Unknown queue: ${queueName}`)

    const wrappedHandler: JobHandler = async (data) => {
      logger.info({ queue: queueName }, 'Processing job (in-memory)')
      await handler({ data: data as JobDataMap[Name] })
    }

    if (queue instanceof InMemoryQueue) {
      queue.setHandler(wrappedHandler)
    }
    return { close: async () => {} }
  }

  const worker = new Worker<JobDataMap[Name]>(
    queueName,
    async (job) => {
      logger.info({ queue: queueName, jobId: job.id }, 'Processing job')
      try {
        await handler(job)
      } catch (err) {
        logger.error({ err, queue: queueName, jobId: job.id }, 'Job failed')
        throw err
      }
    },
    { connection: bullMqConnection! }
  )

  worker.on('failed', (job, err) => {
    logger.error({ err, jobId: job?.id, queue: queueName }, 'Worker job failed')
  })

  bullMqWorkers.push(worker)
  return worker
}
