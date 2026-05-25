import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { logger } from './lib/logger.js'
import { registerWorkers } from './queues/workers.js'
import { shutdownQueues } from './queues/index.js'
import newLeadWebhook from './webhooks/newLead.js'
import whatsappWebhook from './webhooks/whatsapp.js'
import dashboardRoutes from './routes/dashboard.js'
import leadRoutes from './routes/leads.js'
import propertyRoutes from './routes/properties.js'
import sequenceRoutes from './routes/sequences.js'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(newLeadWebhook)
app.use(whatsappWebhook)
app.use(dashboardRoutes)
app.use(leadRoutes)
app.use(propertyRoutes)
app.use(sequenceRoutes)

registerWorkers()

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'API server started')
})

async function shutdown() {
  logger.info('Shutting down...')
  server.close()
  await shutdownQueues()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

export default app
