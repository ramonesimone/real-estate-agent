# Real Estate AI Agent System — Technical Brief

## Project overview

Build a fully autonomous AI agent system for real estate agents that handles
the entire lead lifecycle — from first inquiry through deal close. The system
operates primarily over WhatsApp and SMS, works 24/7 without human
intervention, and integrates with a lightweight CRM. It is designed for the
Nigerian and broader African real estate market but must be architected to
work globally.

The system has four core modules that must be built as independent but
interconnected agents:

1. Speed-to-lead agent — responds to every inbound inquiry in under 60 seconds
2. Lead qualification engine — scores and segments every lead by intent, budget, and timeline
3. Dead lead resurrection system — 90-day automated nurture sequences for cold leads
4. Buyer-property matching engine — fires personalized alerts when a new listing matches a buyer

---

## Technology stack

### Backend
- Runtime: Node.js (TypeScript)
- Framework: Express.js for webhook endpoints
- AI backbone: Anthropic Claude API (claude-sonnet-4-20250514) for all
  conversational agents and reasoning tasks
- Database: PostgreSQL for lead records, conversation history, and property data
- ORM: Prisma
- Job queue: BullMQ with Redis for async message processing and scheduled
  follow-up sequences
- Vector database: Pinecone or pgvector (PostgreSQL extension) for property
  embeddings and semantic buyer-property matching

### Messaging
- Primary channel: WhatsApp Business API via Twilio or Meta Cloud API directly
- Secondary channel: SMS via Twilio for fallback
- Email: Resend or Nodemailer for formal communications

### Frontend (agent dashboard)
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Charts: Recharts for lead pipeline and conversion analytics

### Infrastructure
- Deployment: Railway or Render for backend, Vercel for frontend
- Environment: All secrets in .env, never hardcoded
- Logging: Pino for structured logs

---

## Database schema

Design the following tables in PostgreSQL via Prisma:

```
Lead {
  id            String        @id @default(uuid())
  phone         String        @unique
  name          String?
  email         String?
  source        LeadSource    // WEBSITE | WHATSAPP | REFERRAL | OPEN_HOUSE
  status        LeadStatus    // NEW | CONTACTED | QUALIFIED | HOT | COLD | DEAD | CONVERTED
  score         Int           @default(0)   // 0–100
  intent        String?       // BUY | RENT | SELL | INVEST
  budget_min    Float?
  budget_max    Float?
  timeline      String?       // IMMEDIATE | 1_3_MONTHS | 3_6_MONTHS | 6_PLUS
  location_pref String?
  bedrooms      Int?
  notes         String?
  agent_id      String?
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt
}

Conversation {
  id            String        @id @default(uuid())
  lead_id       String
  channel       String        // WHATSAPP | SMS | EMAIL
  direction     String        // INBOUND | OUTBOUND
  message       String
  timestamp     DateTime      @default(now())
  lead          Lead          @relation(fields: [lead_id], references: [id])
}

Property {
  id            String        @id @default(uuid())
  title         String
  description   String
  price         Float
  type          String        // SALE | RENT
  bedrooms      Int
  bathrooms     Int
  location      String
  area          String
  amenities     String[]
  images        String[]
  status        String        // AVAILABLE | UNDER_OFFER | SOLD
  agent_id      String
  embedding     Float[]       // vector for semantic matching
  created_at    DateTime      @default(now())
}

NurtureSequence {
  id            String        @id @default(uuid())
  lead_id       String
  sequence_type String        // COLD_NURTURE | POST_VIEWING | SELLER_FOLLOW_UP
  current_step  Int           @default(0)
  next_send_at  DateTime
  active        Boolean       @default(true)
  lead          Lead          @relation(fields: [lead_id], references: [id])
}

Agent {
  id            String        @id @default(uuid())
  name          String
  phone         String
  email         String
  agency        String?
  whatsapp_id   String?       // WhatsApp Business account ID
}
```

---

## Module 1: Speed-to-lead agent

### What it does
Every time a new lead inquiry arrives — via website form submission, WhatsApp
message, or missed call webhook — the agent fires within 60 seconds with a
warm, conversational opening message. It does not wait for a human.

### Webhook endpoint
```
POST /webhooks/new-lead
```

Accepts a JSON payload with:
- `source` (WEBSITE | WHATSAPP | REFERRAL)
- `phone`
- `name` (optional)
- `message` (the inquiry text, if any)

### Logic flow
1. Receive webhook
2. Create Lead record in database with status NEW
3. Push a job onto the BullMQ queue: `respond-to-new-lead`
4. Worker picks up job, calls Claude API with the system prompt below
5. Send generated message via WhatsApp/SMS within 60 seconds

### Claude system prompt for speed-to-lead
```
You are a friendly, professional real estate assistant for [AGENCY_NAME].
A new lead has just made an inquiry. Your job is to send the first response
message within 60 seconds.

Rules:
- Be warm and conversational, never robotic
- Keep the first message short — 2 to 3 sentences maximum
- End with exactly ONE qualifying question to start the conversation
- Never mention that you are an AI unless directly asked
- Write in the same language the lead used. Default to English.
- Use first name if available

Good qualifying questions to choose from based on context:
- "Are you looking to buy or rent?"
- "What area of Lagos/Abuja are you focused on?"
- "What is your ideal timeline for moving?"
- "Are you buying for personal use or as an investment?"

Lead details:
Name: {{lead.name}}
Source: {{lead.source}}
Their message: {{lead.message}}

Return only the message text. No preamble, no explanation.
```

---

## Module 2: Lead qualification engine

### What it does
After the first response, the agent continues the conversation and extracts
four critical data points: intent (buy/rent/sell/invest), budget range,
timeline, and location preference. It updates the Lead record in real time and
calculates a lead score (0–100) when qualification is complete.

### Lead scoring formula
Implement this scoring logic:

```typescript
function scoreLead(lead: Lead): number {
  let score = 0

  // Intent clarity (25 points)
  if (lead.intent) score += 25

  // Budget defined (25 points)
  if (lead.budget_min && lead.budget_max) score += 25
  else if (lead.budget_max) score += 15

  // Timeline urgency (30 points)
  const timelineScores = {
    IMMEDIATE: 30,
    '1_3_MONTHS': 20,
    '3_6_MONTHS': 10,
    '6_PLUS': 5,
  }
  score += timelineScores[lead.timeline] ?? 0

  // Location specified (20 points)
  if (lead.location_pref) score += 20

  return score
}
```

Score thresholds:
- 80–100: HOT lead — alert agent immediately via WhatsApp
- 50–79: WARM lead — continue nurture, no urgent alert
- 0–49: COLD lead — enter dead lead resurrection sequence after 3 days of silence

### Conversation state management
Maintain conversation context by passing the full conversation history to
Claude on every turn. Store each message in the Conversation table.

```typescript
// Build conversation history for Claude
const history = await prisma.conversation.findMany({
  where: { lead_id: leadId },
  orderBy: { timestamp: 'asc' }
})

const messages = history.map(msg => ({
  role: msg.direction === 'INBOUND' ? 'user' : 'assistant',
  content: msg.message
}))
```

### Claude system prompt for qualification
```
You are a real estate assistant qualifying a potential buyer or renter.
Your goal is to naturally extract these four data points through conversation:
1. Intent: are they buying, renting, selling, or investing?
2. Budget: what is their price range?
3. Timeline: how soon do they need to move or transact?
4. Location: which area or neighborhood are they targeting?

Rules:
- Ask only ONE question per message
- Never ask all four questions at once — it feels like an interrogation
- Once you have all four data points, summarize what you have heard and ask
  if there is anything else they want you to know
- Be conversational, warm, and local-feeling
- If they mention Lagos, Abuja, or Port Harcourt landmarks, show familiarity
- Never break character

Current lead data extracted so far:
{{lead_partial_data}}

Full conversation so far:
{{conversation_history}}

Latest message from lead:
{{latest_message}}

Respond with:
1. Your reply message (2–3 sentences max)
2. A JSON block on a new line with any newly extracted data:
   {"intent": null, "budget_min": null, "budget_max": null,
    "timeline": null, "location_pref": null}
   Fill only the fields you extracted from THIS message. Leave others null.
```

Parse the JSON block from Claude's response and update the Lead record
immediately after each turn.

---

## Module 3: Dead lead resurrection system

### What it does
Any lead that has gone silent for 72 hours after initial contact, or was
previously scored COLD, enters a 90-day nurture sequence. The sequence sends
9 messages across 90 days, each one different in content and angle of
approach. Messages feel personal and timely, never like a broadcast.

### Sequence schedule
```
Step 1: Day 3    — Gentle check-in
Step 2: Day 7    — Market insight relevant to their area of interest
Step 3: Day 14   — New listing alert (closest match from property database)
Step 4: Day 21   — Value content (e.g. "5 things to check before buying in Lagos")
Step 5: Day 30   — Soft re-engagement question
Step 6: Day 45   — Social proof (anonymized success story)
Step 7: Day 60   — Urgency signal (market movement or interest rate update)
Step 8: Day 75   — Direct offer to help with no pressure
Step 9: Day 90   — Final graceful close
```

### BullMQ scheduled job
```typescript
// When a lead goes cold, schedule the first step
await nurtureQueue.add(
  'send-nurture-step',
  { leadId, step: 1 },
  { delay: 3 * 24 * 60 * 60 * 1000 } // 3 days in ms
)

// After each step, schedule the next one if lead is still cold
async function scheduleNextStep(leadId: string, currentStep: number) {
  const delays = [3, 7, 14, 21, 30, 45, 60, 75, 90]
  const nextStep = currentStep + 1
  if (nextStep > 9) return

  const daysUntilNext = delays[nextStep - 1] - delays[currentStep - 1]
  await nurtureQueue.add(
    'send-nurture-step',
    { leadId, step: nextStep },
    { delay: daysUntilNext * 24 * 60 * 60 * 1000 }
  )
}
```

### Claude prompt for nurture messages
```
You are writing a WhatsApp message to a real estate lead who has gone quiet.
This is step {{step}} of a 90-day nurture sequence.

Step purpose: {{step_purpose}}
Lead profile: {{lead_summary}}
Days since last contact: {{days_since_contact}}
Their original inquiry: {{original_message}}

Write a single WhatsApp message that:
- Feels personal and hand-written, not automated
- References something specific from their original inquiry
- Provides genuine value (insight, new listing, or useful tip)
- Ends with a soft, low-pressure question or statement
- Is 3–5 sentences maximum
- Never uses generic openers like "I hope this message finds you well"

Return only the message text.
```

### Resurrection detection
If a cold lead replies to any nurture message, immediately:
1. Cancel all remaining scheduled nurture jobs for that lead
2. Update lead status from COLD/DEAD back to CONTACTED
3. Route the reply back through the qualification engine
4. Alert the agent

---

## Module 4: Buyer-property matching engine

### What it does
When a new property listing is added to the system, the engine automatically
finds every buyer in the database whose preferences match that property and
sends them a personalized WhatsApp alert within minutes.

### Property embedding
When a new property is saved, generate a semantic embedding using the
Anthropic API or OpenAI embeddings and store it in the Property table.
Use pgvector for similarity search.

```typescript
async function embedProperty(property: Property): Promise<number[]> {
  const text = `
    ${property.title}. ${property.description}.
    Location: ${property.location}, ${property.area}.
    Price: ${property.price}. Type: ${property.type}.
    Bedrooms: ${property.bedrooms}. Bathrooms: ${property.bathrooms}.
    Amenities: ${property.amenities.join(', ')}.
  `
  // Call embedding API here and return vector
}
```

### Matching logic
```typescript
async function findMatchingBuyers(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  })

  // Rule-based pre-filter: budget, bedrooms, intent, location
  const candidates = await prisma.lead.findMany({
    where: {
      status: { in: ['QUALIFIED', 'WARM', 'HOT'] },
      intent: property.type === 'SALE' ? 'BUY' : 'RENT',
      budget_max: { gte: property.price * 0.9 },
      bedrooms: { lte: property.bedrooms + 1, gte: property.bedrooms - 1 }
    }
  })

  // Semantic re-rank: use vector similarity on location_pref vs property embedding
  // Return top matches sorted by score
  return candidates
}
```

### Match alert message
```
You are sending a personalized property match alert to a buyer via WhatsApp.

Property details:
{{property_details}}

Buyer profile:
{{buyer_profile}}

Write a WhatsApp message that:
- Opens with their name
- Explains specifically WHY this property matches what they told you they wanted
- Highlights the 2–3 most relevant features for this specific buyer
- Includes the price
- Ends with a single clear call to action: schedule a viewing or ask for more photos
- Feels personal, not like a mass blast
- Is under 150 words

Return only the message text.
```

---

## WhatsApp webhook handler

All inbound WhatsApp messages hit a single endpoint:

```
POST /webhooks/whatsapp
```

The handler must:
1. Verify the WhatsApp webhook signature
2. Extract the sender phone number and message body
3. Look up the Lead record by phone number
4. If no lead exists: create one with status NEW, trigger speed-to-lead agent
5. If lead exists and status is NEW/CONTACTED: route to qualification engine
6. If lead exists and status is COLD: treat as resurrection, cancel nurture jobs,
   route to qualification engine
7. Log every message to the Conversation table

---

## Agent dashboard (Next.js frontend)

Build the following pages:

### /dashboard
- Total leads count with status breakdown (NEW, QUALIFIED, HOT, COLD, CONVERTED)
- Today's activity feed (new leads, messages sent, leads converted)
- Hot leads panel: all leads scored 80+ with one-tap WhatsApp deep link

### /leads
- Full lead table with search, filter by status, sort by score
- Click into any lead to see full conversation transcript
- Manual override: agent can update lead status or add notes

### /properties
- Add new listing form (triggers embedding + buyer matching on save)
- Active listings with match count per property

### /sequences
- View all active nurture sequences
- Pause or cancel any sequence manually

---

## Environment variables required

```
DATABASE_URL=
REDIS_URL=
ANTHROPIC_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
NEXT_PUBLIC_API_URL=
```

---

## Project structure

```
/
├── apps/
│   ├── api/                  # Express backend
│   │   ├── src/
│   │   │   ├── agents/       # Claude agent prompts and logic
│   │   │   │   ├── speedToLead.ts
│   │   │   │   ├── qualification.ts
│   │   │   │   ├── nurture.ts
│   │   │   │   └── matching.ts
│   │   │   ├── webhooks/     # WhatsApp + lead source handlers
│   │   │   ├── queues/       # BullMQ workers and job definitions
│   │   │   ├── services/     # WhatsApp, SMS, email senders
│   │   │   └── index.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   └── web/                  # Next.js dashboard
│       └── src/
│           └── app/
│               ├── dashboard/
│               ├── leads/
│               ├── properties/
│               └── sequences/
└── packages/
    └── shared/               # Shared types and utilities
```

---

## Build order

Build in this exact sequence to avoid blocking dependencies:

1. Set up the monorepo, install dependencies, configure Prisma schema and
   run first migration
2. Build the WhatsApp webhook handler and message sender service
3. Build the speed-to-lead agent — get first end-to-end message sending
4. Add conversation logging to the database
5. Build the qualification engine with Claude conversation loop
6. Implement lead scoring and status updates
7. Build BullMQ queue infrastructure and the nurture sequence scheduler
8. Build the dead lead resurrection detection
9. Build property model, embedding generation, and buyer matching engine
10. Build the Next.js dashboard pages
11. Add agent alert system (hot lead WhatsApp notification to the agent)
12. End-to-end test with a real WhatsApp number

---

## Critical implementation notes

- Never expose the Anthropic API key on the frontend under any circumstances
- All Claude API calls happen server-side only
- WhatsApp messages must be rate-limited to comply with Meta's policies:
  no more than 1 message per 24-hour window to a lead who has not messaged
  first (template message rules apply — use approved message templates for
  outbound)
- Store all conversation history and use it on every Claude call to maintain
  context — Claude has no memory between API calls
- The qualification JSON extraction from Claude responses must be wrapped in
  a try/catch — Claude occasionally formats output differently
- For Nigerian phone numbers, normalize to E.164 format (+234XXXXXXXXXX)
  before storing or sending
- Build the WhatsApp webhook verification endpoint first — Meta requires it
  before activating the webhook
- Use database transactions when updating lead status + scheduling nurture
  jobs to avoid race conditions
```

---

## Frontend deployment — Hugging Face Spaces (zero cost)

Do NOT use Vercel. Deploy the Next.js dashboard to Hugging Face Spaces using
the Docker runtime. This is completely free.

### Step 1 — Dockerfile for the Next.js app

Create this Dockerfile inside the `apps/web/` directory:

```dockerfile
FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Hugging Face Spaces requires port 7860
EXPOSE 7860
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2 — next.config.js update

Add `output: 'standalone'` to your Next.js config so the build produces a
self-contained server:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

### Step 3 — README.md header for Hugging Face

Create a `README.md` in the `apps/web/` directory with this exact header
(Hugging Face reads this metadata to configure the Space):

```
---
title: Real Estate Agent Dashboard
emoji: 🏠
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---
```

### Step 4 — Create the Hugging Face Space

1. Go to https://huggingface.co/new-space
2. Give it a name (e.g. `real-estate-dashboard`)
3. Select SDK: **Docker**
4. Select template: **Blank**
5. Set visibility: **Private** (this is your client's dashboard)
6. Click "Create Space"

### Step 5 — Add environment secrets

In your Hugging Face Space settings under "Repository secrets", add:

```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

Never put the Anthropic API key or database credentials here — those stay
on the backend (Railway/Render), not the frontend Space.

### Step 6 — Deploy via Git

Hugging Face Spaces are Git repositories. Push your `apps/web/` contents
directly to the Space repo:

```bash
# Clone your HF Space locally
git clone https://huggingface.co/spaces/YOUR_USERNAME/real-estate-dashboard

# Copy your Next.js app files into it
cp -r apps/web/* real-estate-dashboard/

# Push
cd real-estate-dashboard
git add .
git commit -m "deploy dashboard"
git push
```

The Space will build and deploy automatically. Your dashboard will be live at:
`https://YOUR_USERNAME-real-estate-dashboard.hf.space`

### Step 7 — GitHub Actions for auto-deploy (optional but recommended)

Add this workflow to auto-push to HF Spaces on every push to main:

```yaml
# .github/workflows/deploy-dashboard.yml
name: Deploy dashboard to HF Spaces

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Push to Hugging Face Space
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: |
          cd apps/web
          git init
          git remote add hf https://YOUR_USERNAME:$HF_TOKEN@huggingface.co/spaces/YOUR_USERNAME/real-estate-dashboard
          git add .
          git commit -m "deploy ${{ github.sha }}"
          git push hf main --force
```

Add `HF_TOKEN` as a GitHub repository secret (generate it from your
Hugging Face account settings under Access Tokens).

---

## Full zero-budget infrastructure map

```
Component              Platform              Cost
─────────────────────────────────────────────────
Next.js dashboard      HF Spaces (Docker)    FREE
Express API backend    Railway (free tier)   FREE (500hrs/month)
PostgreSQL database    Railway (free tier)   FREE (1GB storage)
Redis (BullMQ)         Railway (free tier)   FREE
WhatsApp messaging     Meta Cloud API        FREE (1000 convos/month)
SMS fallback           Twilio                ~$0.0075/SMS
Domain (optional)      Namecheap             ~$10/year
─────────────────────────────────────────────────
Total monthly          $0 until scale        $0
```

When Railway free tier limits are hit (at real client scale), upgrade to
Railway Hobby plan at $5/month — still negligible. The Hugging Face Space
stays free indefinitely.
