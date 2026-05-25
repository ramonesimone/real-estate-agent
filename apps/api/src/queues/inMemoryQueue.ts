import { logger } from '../lib/logger.js'

interface StoredJob {
  id: string
  name: string
  data: Record<string, unknown>
  timer: NodeJS.Timeout | null
  state: 'delayed' | 'waiting'
}

export class InMemoryQueue {
  private jobs: StoredJob[] = []
  private handler: ((data: Record<string, unknown>) => Promise<void>) | null = null

  constructor(public readonly name: string) {}

  async add(
    _jobName: string,
    data: Record<string, unknown>,
    opts?: { delay?: number }
  ): Promise<{ id: string }> {
    const id = Math.random().toString(36).slice(2, 10)
    const job: StoredJob = { id, name: _jobName, data, timer: null, state: 'waiting' }

    if (opts?.delay) {
      job.state = 'delayed'
      job.timer = setTimeout(async () => {
        if (this.handler) {
          try {
            await this.handler(data)
          } catch (err) {
            logger.error({ err, queue: this.name }, 'In-memory job failed')
          }
        }
        const idx = this.jobs.indexOf(job)
        if (idx >= 0) this.jobs.splice(idx, 1)
      }, opts.delay)
    } else {
      process.nextTick(async () => {
        if (this.handler) {
          try {
            await this.handler(data)
          } catch (err) {
            logger.error({ err, queue: this.name }, 'In-memory job failed')
          }
        }
        const idx = this.jobs.indexOf(job)
        if (idx >= 0) this.jobs.splice(idx, 1)
      })
    }

    this.jobs.push(job)
    return { id }
  }

  async getJobs(states: string[]): Promise<Array<{ data: Record<string, unknown>; remove: () => Promise<void> }>> {
    return this.jobs
      .filter(j => states.includes(j.state))
      .map(j => ({
        data: j.data,
        remove: async () => {
          if (j.timer) clearTimeout(j.timer)
          const idx = this.jobs.indexOf(j)
          if (idx >= 0) this.jobs.splice(idx, 1)
        },
      }))
  }

  setHandler(handler: (data: Record<string, unknown>) => Promise<void>) {
    this.handler = handler
  }

  async close() {
    for (const j of this.jobs) {
      if (j.timer) clearTimeout(j.timer)
    }
    this.jobs = []
  }
}
