FROM node:20-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./
RUN npm install

EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD ["node", "-e", "require('http').createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end('ok')}).listen(7860,'0.0.0.0',()=>console.log('ready'))"]