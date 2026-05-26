import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

// Serve static frontend (Next.js static export)
const frontendDist = path.resolve(__dirname, '../../web/out')
app.use(express.static(frontendDist))

// Fallback: serve index.html for all non-API paths (SPA client-side routing)
app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api/') ||
    req.path === '/health' ||
    req.path.startsWith('/webhook/')
  ) {
    return next()
  }
  const filePath = req.path === '/' ? 'index.html' : `${req.path.slice(1)}.html`
  res.sendFile(path.join(frontendDist, filePath), (err) => {
    if (err) {
      res.sendFile(path.join(frontendDist, 'index.html'))
    }
  })
})

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
