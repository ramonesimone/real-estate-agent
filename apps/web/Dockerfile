FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
RUN npm install

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD ["node", "node_modules/next/dist/bin/next", "start"]