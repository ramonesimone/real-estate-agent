const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 7860
const PUBLIC = path.join(__dirname, 'out')

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
}

const EXT_RE = /\.[\w-]+$/

http.createServer((req, res) => {
  let url = req.url

  if (url === '/' || url === '') url = '/index.html'
  else if (!EXT_RE.test(url)) url = url.replace(/\/$/, '') + '.html'

  let filePath = path.join(PUBLIC, url)
  const ext = path.extname(filePath)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(PUBLIC, '404.html')
      fs.readFile(fallback, (e2, d2) => {
        res.writeHead(e2 ? 404 : 200, { 'Content-Type': 'text/html' })
        res.end(d2 || 'Not Found')
      })
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`)
})
