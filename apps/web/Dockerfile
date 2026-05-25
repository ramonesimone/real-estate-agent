FROM node:20-slim
WORKDIR /app
EXPOSE 7860
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end('ok')}).listen(7860,'0.0.0.0',()=>console.log('ready'))"]