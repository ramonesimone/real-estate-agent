FROM node:20-slim
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

CMD ["node", "-e", "const c=require('http').createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end('<h1>test</h1>')});c.listen(7860,'0.0.0.0',()=>console.log('ok'))"]