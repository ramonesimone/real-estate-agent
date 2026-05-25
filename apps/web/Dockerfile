FROM node:20-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/out ./out

EXPOSE 7860
ENV PORT=7860

CMD ["node", "-e", "const c=require('http').createServer((q,r)=>{const p=q.url.slice(1)||'index.html';require('fs').readFile('./out/'+p,(e,d)=>{if(e){r.writeHead(404);r.end('404')}else{r.writeHead(200,{'Content-Type':p.endsWith('.css')?'text/css':p.endsWith('.js')?'application/javascript':p.endsWith('.html')?'text/html':'text/plain'});r.end(d)}})}).listen(7860,'0.0.0.0',()=>console.log('ready'))"]