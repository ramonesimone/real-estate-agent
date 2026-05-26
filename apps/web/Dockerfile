FROM node:20-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

COPY package.json ./
RUN npm install

COPY . .
ENV NODE_ENV=production
RUN npm run build

EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD node start.js