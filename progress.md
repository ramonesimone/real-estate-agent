# Real Estate AI Agent — Progress

## Current Status (May 26, 2026)

### ✅ Deployed
- **API**: `https://real-estate-agent-production-2fc4.up.railway.app` (Railway)
- **Frontend**: `https://ramonesimone-real-estate-agent.hf.space` (Hugging Face Spaces)
- **Leads**: 40 loaded
- **Properties**: 37 loaded
- **Health**: `/health` returns `{"status":"ok"}`
- **Auto-deploy**: GitHub Actions — `deploy-railway.yml` (GraphQL API + `RAILWAY_TOKEN`) + `deploy-dashboard.yml` (git push to HF Space)

### ✅ HF Spaces Frontend — Fixed
Root causes and fixes:
1. **`NODE_ENV=production` before `npm install`** → moved after install so devDeps (tailwindcss, etc.) are available for build
2. **`next start` CMD incompatible with static export** → replaced with custom `start.js` (zero-dependency Node.js static server)
3. **`@/` path alias not resolving on HF Spaces** → replaced with relative imports
4. **`serve` package not found at runtime** → removed dependency, used `node start.js` with built-in `http` module

### 📋 What's Built

#### Backend (Express + TypeScript)
| Module | Status |
|--------|--------|
| Prisma schema (SQLite local / PostgreSQL on Railway) | ✅ |
| Seed data (40 leads, 37 properties, 5 agents, 69 conversations, 8 nurture sequences) | ✅ |
| WhatsApp webhook (verify + inbound handler) | ✅ |
| Speed-to-lead agent (OpenRouter/Claude) | ✅ |
| Lead qualification engine (conversation loop) | ✅ |
| Lead scoring (0-100) | ✅ |
| Nurture sequence scheduler (90-day drip) | ✅ |
| Buyer-property matching | ✅ |
| Dashboard stats endpoint | ✅ |
| Leads CRUD | ✅ |
| Properties CRUD | ✅ |
| Sequences management | ✅ |

#### Frontend (Next.js 14 + Tailwind + Recharts)
| Page | Status |
|------|--------|
| Dashboard (stats, chart, hot leads) | ✅ |
| Leads list (search, filter, sort) | ✅ |
| Lead detail (conversation history) | ✅ |
| Properties (list + add form) | ✅ |
| Sequences (list + pause/resume) | ✅ |

#### TypeScript Fixes Applied
- `dashboard/page.tsx`: Removed invalid `nameKey` prop from Recharts `<Bar>` component
- `properties/page.tsx`: Fixed `FormDataEntryValue` type mismatch for `amenities`/`images` fields
- Root page: Changed `redirect()` (server-side) to `useRouter().replace()` (client-side) for compatibility

#### Infrastructure
| Component | Status |
|-----------|--------|
| Railway deployment (Docker/Nixpacks) | ✅ |
| PostgreSQL database | ✅ |
| Redis (BullMQ) | ✅ |
| In-memory queue fallback (no Redis) | ✅ |
| Twilio messaging with console fallback | ✅ |
| GitHub Actions (`deploy-railway.yml` + `deploy-dashboard.yml`) | ✅ |
| Hugging Face Space `ramonesimone/real-estate-agent` | ✅ |

### 🔧 Local Development
```bash
npm install --ignore-scripts
npx prisma generate --schema=apps/api/prisma/schema.prisma
npx prisma db push --schema=apps/api/prisma/schema.prisma
npx -w apps/api tsx prisma/seed.ts
npm run dev:api
npm run dev:web
```

### Required Secrets (GitHub)
| Secret | Used By |
|--------|---------|
| `RAILWAY_TOKEN` | `deploy-railway.yml` (Railway API access) |
| `HF_TOKEN` | `deploy-dashboard.yml` (HF Spaces git push) |

### Required Environment Variables (Railway)
| Variable | Where |
|----------|-------|
| `OPENROUTER_API_KEY` | Railway variables |
| `TWILIO_ACCOUNT_SID` | Railway variables |
| `TWILIO_AUTH_TOKEN` | Railway variables |
| `TWILIO_WHATSAPP_NUMBER` | Railway variables |
| `AGENCY_NAME` | Railway variables |
| `DATABASE_URL` | Auto-injected by Railway PostgreSQL |
| `REDIS_URL` | Auto-injected by Railway Redis |

### Notes
- `RAILWAY_TOKEN` was reset — must match GitHub secret name `RAILWAY_TOKEN`
- Frontend served via static export from custom `start.js` (Node.js built-in `http` module)
- Local dev uses SQLite (no setup needed)
- Railway uses PostgreSQL (auto-switched via `sed` in start script)
- Jobs use in-memory queue if Redis is unavailable (lost on restart)
- Messages log to console if Twilio credentials are missing
