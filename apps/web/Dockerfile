FROM node:20-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build && npm prune --production && npm cache clean --force

EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD ["node", "./node_modules/next/dist/bin/next", "start"]