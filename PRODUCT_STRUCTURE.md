# ElderCareMatters V2 — Product Structure & Module Breakdown

> Source: IMpelhub Eldercare Design Spec (Final)
> Last updated: 2026-04-08
> Status: Planning / Pre-build

---

## WHAT IS ECM V2 IN ONE SENTENCE?

ElderCareMatters V2 is a platform where:
- **Families** describe what elder care they need
- The platform **scores and prices** that request as a "lead"
- **Providers** (attorneys, care managers, facilities) pay to receive those leads
- Geography determines which providers see which leads and what they pay

---

## THE TWO USERS (Who the platform serves)

| User Type | Who They Are | What They Want | Do They Pay? |
|-----------|-------------|----------------|--------------|
| Consumer (B2C) | Family members or caregivers | Find trustworthy, local elder care help | No — it's free |
| Provider (B2B) | Elder law attorneys, care managers, senior care facilities | Get qualified leads with predictable ROI | Yes — subscription + per lead |

---

## THE 10 MODULES (From the Spec)

---

### MODULE A — Guided Intake System
**What it is:** The chatbot/form that captures a consumer's request.

**What it does step by step:**
1. Consumer lands on the site (from Google, a blog article, the homepage)
2. A chat or form opens and asks structured questions:
   - Who needs care?
   - What type of service? (elder law, home care, memory care, care management, etc.)
   - Where are they located? (ZIP code → city/state is derived automatically)
   - How urgent is it?
   - What is their budget range?
   - What is their decision-making role? (primary decision-maker, researching, etc.)
   - Name, email, phone
3. That submission becomes a **lead object** in the database

**Why it matters:** This is the front door of the whole system. Without a structured intake, there's nothing to score, price, or sell.

**Key design principle:** Keep it short. 5–7 questions max. Use chat-style UX, not a long form.

---

### MODULE B — Lead Scoring Engine
**What it is:** A system that automatically grades every lead after it is submitted.

**Two scores are calculated:**

| Score | Name | What it Measures | Example |
|-------|------|-----------------|---------|
| LQS | Lead Quality Score | How reliable is the data? | Real email? Valid phone? ZIP matches city? |
| LIS | Lead Intent Score | How likely is this person to convert? | Urgency level, budget clarity, decision role |

**How the scores are used:**
- Higher scores → higher lead price
- Providers can see the scores BEFORE buying the lead
- This helps providers decide if the lead is worth purchasing

**Pricing formula from the spec:**
```
Lead Price = Base City Price × Quality Score × Intent Score × Geo Relevance
```

**Example in plain English:**
> A lead in New York City (high base price) from someone who said "urgent, I'm the decision-maker, budget $4k/month" (high LIS) with a valid email and phone (high LQS) = expensive, premium lead.
>
> A lead from someone "just researching" with no phone number = cheaper lead.

---

### MODULE C — Geo-Based Matching Engine
**What it is:** The rules engine that decides WHICH providers see WHICH leads.

**Why geography is the core differentiator:** The spec calls this the "foundational system layer." Everything — pricing, who gets leads, what SEO pages exist — is built around location.

**Geographic layers (from most specific to broadest):**
```
ZIP Code
   ↓
City  ← primary matching unit
   ↓
Radius (e.g., within 25 miles of Austin)
   ↓
Covered Cities (e.g., provider serves Austin + Round Rock + Cedar Park)
   ↓
State
   ↓
Multi-State (e.g., a large firm covering TX + LA + OK)
```

**How matching works:**
1. Lead comes in from ZIP 78701 (Austin, TX)
2. System finds all providers whose coverage includes Austin
3. Checks if their subscription is active
4. Serves the lead to eligible providers

**Geo also affects pricing:** A lead in San Francisco costs more than a lead in a small rural town, because the base city price is higher.

---

### MODULE D — Lead Marketplace
**What it is:** The interface where providers see available leads and choose to purchase them.

**How it works:**
1. Provider logs into their dashboard
2. They see a list of new leads in their coverage area
3. For each lead, they see **partial info only**:
   - Care type
   - General location (city, not full address)
   - Lead Quality Score
   - Lead Intent Score
   - Price to unlock
4. Provider clicks **"Purchase Lead"** → full contact details are revealed
5. They can now call or email the consumer directly

**Key rule from spec:** Each lead has a maximum number of buyers (e.g., 3 providers max per lead). This limits competition and justifies the price.

**Why this model works:** Providers only pay for leads they actually want. They can evaluate quality before spending money.

---

### MODULE E — Provider System
**What it is:** Everything on the provider's side of the platform.

**Three sub-components:**

**E1 — Provider Profile (Public-facing)**
- Business name, credentials, specialties
- Service types offered
- Coverage area
- "ECM Verified" badge (see Module K — Trust Framework)
- Visible on the public directory

**E2 — Subscription Management**
- Provider picks a plan (Base / Professional / Premium)
- Plan determines:
  - How many leads they receive
  - What geographic coverage is included
  - What features they unlock
- Managed through Stripe (payment processor)

**E3 — Lead Dashboard (Private)**
- Inbox: new leads available to purchase
- My Leads: leads already purchased
- Lead status tracking: New → Contacted → Won / Lost
- Billing history and credit balance

---

### MODULE F — Directory & Comparison Layer
**What it is:** The browseable, public-facing directory of providers. Think of it as the "old ECM" that still exists, but now serves a strategic purpose.

**Why keep the directory?**
- Builds trust before a consumer submits a request
- Helps with SEO (more indexed pages)
- Some consumers prefer to browse before chatting

**What a directory listing shows:**
- Provider name + photo
- Type of service
- Location / coverage area
- Verified badge
- Brief description
- "Request a Match" button → leads back to the intake chatbot (Module A)

**Important:** The directory drives consumers toward the intake system. It is not the end destination — it is a trust-building step on the way to lead capture.

---

### MODULE G — Consumer (User) Dashboard
**What it is:** A simple logged-in area for families who submitted a request.

**What consumers can do:**
- See the status of their request ("3 providers have been matched")
- Receive and respond to provider messages (via the platform)
- Track who has reached out
- Update their request if their needs change

**Why this matters:**
- Keeps consumers engaged on the platform
- Creates a safer experience (providers contact through the platform, not directly via personal email)
- Gives ECM visibility into whether connections are being made

---

### MODULE H — Messaging System
**What it is:** A controlled, platform-mediated communication layer between consumers and providers.

**How it works:**
- After a provider purchases a lead, they can send a message through the ECM platform
- Consumer receives the message via email notification + inside their dashboard
- Consumer replies through the platform
- All messages are logged

**Why "platform-mediated" matters:**
- ECM controls the relationship, not just the lead sale
- Allows ECM to track engagement and conversion
- Prevents providers from bypassing the platform entirely
- Reduces spam and unwanted contact for consumers

---

### MODULE I — Admin Control System
**What it is:** The internal backend that ECM staff uses to manage the entire platform.

**What admins can do:**

| Area | Admin Controls |
|------|---------------|
| Pricing | Set base city prices, adjust multipliers by category |
| Lead Distribution | Set max buyers per lead, pause/resume distribution |
| Provider Management | Approve/verify providers, manage subscriptions, handle disputes |
| Content Management | Publish/edit blog articles, location pages, guides |
| Lead Review | Flag suspicious leads, issue refunds, quality control |

**Think of this as:** The cockpit. Without it, you can't run the platform.

---

### MODULE J — Content Co-Creation Engine
**What it is:** A system to produce and publish helpful content that brings in organic (free) traffic from Google.

**Two types of content:**

**J1 — SEO Location Pages (Auto-generated structure)**
- Pages like `/elder-care/texas/austin/` or `/elder-law-attorney/california/los-angeles/`
- Each page targets the search query "elder care in [city]"
- These pages feed directly into the intake chatbot (Module A)
- This is how people find ECM without paying for ads

**J2 — Editorial Content (Guides + Articles)**
- "How to know when a parent needs memory care"
- "What does an elder law attorney do?"
- "Assisted living vs. home care: which is right?"
- Providers can contribute articles (builds their authority + gives ECM content)

**Why this module matters for revenue:**
- SEO traffic is free
- Each visitor is a potential lead
- High-ranking location pages = consistent, scalable lead volume
- Provider-contributed content = network effect

---

### MODULE K — Trust Framework
**What it is:** The system that makes consumers feel safe enough to submit their personal information.

**Trust signals built into the platform:**

| Signal | What It Means |
|--------|---------------|
| "ECM Verified" badge | ECM has checked the provider's business license and legitimacy |
| Credential display | Provider shows certifications, licenses (claimed vs. verified) |
| Structured profiles | Consistent, professional presentation for every provider |
| Platform messaging | Consumers know they won't be cold-called by strangers |
| Lead score transparency | Providers see scores, so they trust the lead quality |

**Why trust is a business asset:**
The spec notes ECM's biggest strength is its trusted reputation in the elder care ecosystem. V2 must preserve and systematize that trust, not erode it.

---

## HOW ALL MODULES CONNECT (The Full Flow)

```
CONSUMER JOURNEY
────────────────
[SEO Page / Homepage / Blog Article]  ← Module J brings them here
        ↓
[Guided Intake Chatbot/Form]           ← Module A captures their need
        ↓
[Lead Object Created in Database]
        ↓
[Lead Scored: LQS + LIS]              ← Module B scores it
        ↓
[Geo Matching: Find eligible providers]← Module C matches by location
        ↓
[Lead priced: Base × Quality × Intent × Geo]
        ↓
[Lead appears in Provider Marketplace] ← Module D shows it to providers

PROVIDER JOURNEY
────────────────
[Provider sees partial lead + scores + price] ← Module D
        ↓
[Provider purchases lead → full contact revealed]
        ↓
[Provider messages consumer via platform] ← Module H
        ↓
[Consumer receives message + responds]  ← Module G
        ↓
[Provider updates lead status: Won/Lost]← Module E
        ↓
[ECM tracks ROI for provider]

ADMIN / BACKGROUND
──────────────────
[Admin sets city pricing, caps, rules]  ← Module I
[Content team publishes SEO pages]      ← Module J
[Trust badges assigned to providers]    ← Module K
```

---

## REVENUE MODEL (From the Spec)

### A — Subscriptions (Monthly recurring revenue)
Providers pay monthly for access to the platform and leads in their area.

| Tier | Suggested Coverage | What's Included |
|------|-------------------|-----------------|
| Base | 1 city | Limited leads/month, basic profile |
| Professional | City + radius OR multiple cities | More leads, larger coverage |
| Premium | State or multi-state | Maximum leads, priority placement |

Subscription price increases with geographic coverage.

### B — Pay-Per-Lead (Transaction revenue)
Providers buy individual leads from the marketplace.

Pricing formula: `Base City Price × LQS × LIS × Geo Relevance`

- A high-quality, urgent lead in a major metro = most expensive
- A low-intent, researching lead in a small city = least expensive

---

## MVP SCOPE (What to build first — from the spec)

The spec is clear: **start small, prove the loop.**

### Build in Phase 1:
- [ ] Guided intake (chatbot/form) → lead saved to database
- [ ] Basic lead scoring (urgency + budget = intent; valid email/phone = quality)
- [ ] Geo matching: ZIP → city → match to providers in that city
- [ ] Provider onboarding: signup, profile, subscription payment
- [ ] Lead marketplace: provider sees leads, purchases to unlock contact info
- [ ] Basic notification emails (lead received, new message)

### Defer to Phase 2+:
- Advanced radius and multi-state matching
- Consumer dashboard
- In-platform messaging system
- Content engine / SEO location pages
- Admin control panel (use manual processes first)
- Advanced ROI analytics

### Explicitly avoid early on (per spec):
- Overbuilt features before product-market fit
- Complex automation
- Edge-case handling

---

## TECH STACK (Recommended for Beginners)

| Layer | Tool | Plain English Explanation |
|-------|------|--------------------------|
| Frontend (website) | Next.js | The code that builds your web pages |
| Styling | Tailwind CSS | Makes things look good without complex CSS |
| Intake/Chatbot | Typeform (MVP) → custom later | Captures consumer form data |
| Database | Supabase | Stores leads, providers, subscriptions |
| Auth (login) | Supabase Auth | Handles provider signup/login securely |
| Payments | Stripe | Subscriptions + lead purchases |
| Email notifications | Resend | Sends emails when leads are created/purchased |
| Hosting | Vercel | Publishes your website live |
| CMS (blog) | Sanity | Lets non-developers publish articles |
| ZIP → City lookup | Zippopotam.us API (free) | Converts ZIP codes to city/state automatically |

---

## UPDATED SITE MAP

```
ElderCareMatters.com
│
├── / (Home)                     ← intake chatbot lives here
├── /how-it-works                ← for consumers
├── /for-providers               ← B2B marketing + signup
│
├── /services/                   ← care type landing pages
│   ├── /home-care
│   ├── /assisted-living
│   ├── /memory-care
│   ├── /elder-law
│   ├── /care-management
│   └── /hospice
│
├── /locations/                  ← SEO pages (Module J)
│   └── /[state]/[city]/
│       └── /[state]/[city]/[service]/
│
├── /providers/                  ← public directory (Module F)
│   └── /[provider-slug]/
│
├── /blog/                       ← content engine (Module J)
│   └── /[article-slug]/
│
├── /app/                        ← logged-in area
│   │
│   ├── /app/consumer/           ← consumer side (Module G)
│   │   ├── /dashboard
│   │   └── /messages
│   │
│   └── /app/provider/           ← provider side (Module E)
│       ├── /dashboard
│       ├── /leads               ← marketplace (Module D)
│       ├── /billing
│       ├── /profile
│       └── /messages
│
├── /admin/                      ← internal only (Module I)
│
├── /login
├── /signup
├── /about
└── /contact
```

---

## KEY DIFFERENCES: Your Original Structure vs. This Spec

| Topic | Original Draft | Spec Update |
|-------|---------------|-------------|
| Provider types | Care facilities only | Also elder law attorneys + care managers |
| Lead purchase model | Auto-distributed | Provider-CHOSEN (they browse + buy) |
| Lead scoring | Not included | Central feature (LQS + LIS) |
| Lead pricing | Flat rate | Dynamic: city × quality × intent × geo |
| Geography | ZIP-based only | Multi-layer: ZIP, city, radius, state, multi-state |
| Consumer dashboard | Not in MVP | Keep for later; focus intake first |
| Messaging | Email notifications | Platform-mediated messages (Module H) |
| Trust system | Basic | Formal: ECM Verified badge + credential display |

---

## NEXT STEPS

1. Confirm this module breakdown is accurate to your vision
2. Decide: which 3 modules do we build first?
   - Recommended MVP order: **A (Intake) → B (Scoring) → D (Marketplace)**
3. Set up the project repo and tech stack
