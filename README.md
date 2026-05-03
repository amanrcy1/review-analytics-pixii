# Amazon Review Analytics

AI-powered competitive intelligence for Amazon sellers. Enter a product category or ASIN, get real competitor data, revenue estimates, and purchase criteria insights.

**Built for [Pixii.ai](https://pixii.ai)**

---

## How It Works

```
User enters "magnesium supplements" or ASIN (B07K2GKQM1)
  → RapidAPI fetches real Amazon products, reviews & images
    → Google Gemini Flash analyzes reviews with AI
      → BSR power-law model estimates competitor revenue
        → Dashboard displays actionable insights
```

## What You Get

- **Competitor Analysis** — Real product data with pricing, ratings, BSR, and images
- **Revenue Estimates** — Industry-standard BSR-to-sales model (12 category curves, seasonality, triangulation)
- **Purchase Criteria** — AI extracts what customers care about, ranked by importance with review quotes
- **Market Opportunities** — Strengths, weaknesses, and gaps across the competitive landscape

## Input Modes

| Input | Example | What Happens |
|-------|---------|-------------|
| Keyword | `magnesium supplements` | Searches Amazon, analyzes top results |
| ASIN | `B07K2GKQM1` | Fetches your listing + 9 competitors |
| Amazon URL | `amazon.com/dp/B07K2GKQM1` | Extracts ASIN, same as above |

## APIs Used

| API | Purpose | Cost |
|-----|---------|------|
| [RapidAPI Real-Time Amazon Data](https://rapidapi.com/bmayoub151/api/real-time-amazon-api-data) | Products, reviews, images | Free (100 req/mo) |
| [Google Gemini Flash](https://aistudio.google.com/apikey) | AI review analysis | Free (1M tokens/day) |
| OpenAI GPT-4o-mini *(optional fallback)* | AI review analysis | $5 min credit |

All APIs are optional — the app runs with realistic sample data when no keys are configured.

## Quick Start

```bash
git clone <repo-url>
cd amazon-review-analytics
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

## Environment Variables

```env
# Required for real data (both free)
GEMINI_API_KEY=        # https://aistudio.google.com/apikey
RAPIDAPI_KEY=          # https://rapidapi.com — subscribe to Real-Time Amazon Data

# Optional
OPENAI_API_KEY=        # Paid fallback for AI analysis

# Scaling (adjust based on API tier)
MAX_COMPETITORS=8              # Products to analyze per query
REVIEW_PAGES_PER_PRODUCT=1     # Pages of reviews per product
```

### Scaling Guide

| Tier | Settings | Reviews/Query | Queries/Month |
|------|----------|---------------|---------------|
| Free (100 calls/mo) | 8 competitors, 1 page | ~80 | ~11 |
| Basic ($10/mo, 1000 calls) | 10 competitors, 10 pages | ~1000 | ~9 |

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS · Recharts · Google Gemini · RapidAPI

## Deploy

```bash
npm run build
vercel deploy
```

Set `GEMINI_API_KEY` and `RAPIDAPI_KEY` in Vercel → Settings → Environment Variables.

## Project Structure

```
app/
  (app)/page.tsx              — Landing page + results dashboard
  api/analyze/route.ts        — Analysis API endpoint
  api/placeholder/[...]/      — SVG placeholder image generator
  globals.css                 — Design system
  layout.tsx                  — Root layout
  types.ts                    — Re-exports from single source of truth
lib/
  amazon-scraper.ts           — RapidAPI integration (search, ASIN, reviews)
  ai-analyzer.ts              — Gemini → OpenAI → sample fallback
  revenue-estimator.ts        — BSR power-law model (12 categories)
  amazon-analyzer.ts          — Orchestrates the full pipeline
src/features/analytics/
  components/                 — ResultsDashboard, CompetitorCard, Charts, MarketInsights
  types.ts                    — Single source of truth for all types
  index.ts                    — Barrel exports
```

## Revenue Estimation Model

Uses the industry-standard power-law relationship:

```
Monthly Units = coefficient × BSR^exponent × marketplace × seasonality
```

- 12 category-specific curves (Health, Electronics, Home, Beauty, etc.)
- Triangulated with review velocity cross-validation (2% review rate)
- Seasonality adjustment (Jan 0.85× → Dec 1.45×)
- Confidence bands (±15% for top 500 BSR, ±70% for deep tail)
- Category-specific return rate deductions (3% health → 15% clothing)

Same methodology used by Jungle Scout, Helium 10, and SellerSprite.

---

MIT License
