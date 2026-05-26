FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV NEXT_IGNORE_INCORRECT_LOCKFILE=1
ENV NEXT_PUBLIC_API_URL=https://real-estate-agent-production-2fc4.up.railway.app

RUN cd apps/web && npx next build

EXPOSE 3001

CMD sed -i 's/provider = "sqlite"/provider = "postgresql"/' apps/api/prisma/schema.prisma && npx prisma generate --schema=apps/api/prisma/schema.prisma && npx prisma db push --accept-data-loss --schema=apps/api/prisma/schema.prisma && npx tsx apps/api/prisma/seed.ts && npx tsx apps/api/src/index.ts