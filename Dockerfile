FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --ignore-scripts

COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json
COPY tsconfig.json ./

# Switch to PostgreSQL for production
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' apps/api/prisma/schema.prisma

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build -w apps/api

EXPOSE 3001

CMD npx prisma db push --accept-data-loss --schema=apps/api/prisma/schema.prisma 2>/dev/null; npm start -w apps/api
