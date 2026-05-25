const { spawn } = require('child_process')

const port = process.env.PORT || '7860'
const hostname = process.env.HOSTNAME || '0.0.0.0'

const server = spawn('node', [
  'node_modules/next/dist/bin/next', 'start', '-p', port, '-H', hostname,
], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env },
})

server.stdout.on('data', (d) => process.stdout.write(d))
server.stderr.on('data', (d) => process.stderr.write(d))

server.on('error', (err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})

server.on('exit', (code) => {
  console.error('Server exited with code:', code)
  process.exit(code || 1)
})

process.on('SIGTERM', () => server.kill())
process.on('SIGINT', () => server.kill())