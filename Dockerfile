FROM node:20-slim
WORKDIR /app

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --ignore-scripts

COPY . .

RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' apps/api/prisma/schema.prisma
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

EXPOSE 3001

CMD npx prisma db push --accept-data-loss --schema=apps/api/prisma/schema.prisma 2>/dev/null; npx tsx apps/api/src/index.ts
