# Review Analytics — Pixii.ai

AI-powered Amazon review analytics for competitive intelligence. Enter your Amazon listing ASIN and instantly get competitor analysis, revenue estimates, purchase criteria insights, and a downloadable PDF report.

**Live demo:** [review-analytics-pixii.vercel.app](https://review-analytics-pixii.vercel.app)

## What it does

An Amazon seller pastes their product ASIN — the app finds 9 real competitors, scrapes their listings, runs AI analysis on customer reviews, and delivers:

- **Your Listing vs. 9 Competitors** — your product highlighted against the competition
- **Key Market Insight** — one actionable sentence cross-referencing what customers care about most vs. where competitors are weakest
- **Purchase Criteria** — ranked by importance with sentiment analysis and review quotes
- **Revenue Estimates** — BSR power-law model with confidence scoring, seasonality, and category calibration
- **Market Opportunities** — data-driven gaps found from competitor weaknesses and neutral criteria
- **PDF Report** — branded, shareable report with all insights

## APIs & Tools

| Tool | Purpose | Tier |
|------|---------|------|
| **RapidAPI Real-Time Amazon Data** | Live product scraping — prices, ratings, images, reviews, comparable products | Free (100 req/mo) |
| **Groq (llama-3.3-70b)** | Primary AI for review analysis — fast, 30 RPM | Free |
| **Google Gemini Flash** | Secondary AI fallback | Free |
| **OpenAI GPT-4o-mini** | Tertiary AI fallback (paid) | Paid |
| **jsPDF** | Client-side PDF report generation | Open source |

AI cascade: **Groq → Gemini → OpenAI → sample data**. The app never crashes — it always delivers results.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Recharts** for purchase criteria visualization
- **jsPDF + jspdf-autotable** for PDF export

## Getting Started

```bash
git clone https://github.com/amanrcy1/review-analytics-pixii.git
cd review-analytics-pixii
npm install
```

Create `.env.local` with your API keys:

```env
# Required for real Amazon data
RAPIDAPI_KEY=your_key_here

# AI providers (at least one recommended)
GROQ_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Optional
OPENAI_API_KEY=your_key_here
MAX_COMPETITORS=9
REVIEW_PAGES_PER_PRODUCT=1
```

Get your free API keys:
- **RapidAPI:** [rapidapi.com](https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data) — subscribe to free plan
- **Groq:** [console.groq.com/keys](https://console.groq.com/keys)
- **Gemini:** [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) and enter an ASIN like `B0CK9GL14F` or search `magnesium supplements`.

## How It Works

1. **Product Discovery** — RapidAPI fetches the user's listing + comparable products. Falls back to keyword search if comparable products are insufficient.

2. **Review Collection** — Fetches customer reviews for each product. Sample reviews used when API quota is exhausted.

3. **AI Analysis** — Each product's reviews are analyzed by Groq/Gemini/OpenAI to extract purchase criteria, strengths, weaknesses, and opportunities. Cascading fallback ensures results always arrive.

4. **Revenue Estimation** — BSR power-law model calibrated per Amazon category with seasonality factors, review velocity cross-validation, and confidence bands.

5. **Market Insights** — Aggregates all competitor data to surface the killer insight, data-driven opportunities, and strategic recommendations.

## Key Design Decisions

- **"Your Listing" framing** — ASIN input highlights the user's product distinctly, because sellers want to know "how do I stack up?" not just "show me data"
- **Killer insight** — One sentence at the top cross-referencing the #1 purchase criterion with the biggest market gap. This is what makes a seller say "I need this tool."
- **Graceful degradation** — Every API has a fallback. Every failure shows a clear message. The app works with zero API keys (demo mode) or all of them.
- **PDF export** — Sellers share reports with partners and investors. A downloadable PDF shows you understand the user's workflow beyond the screen.

## Project Structure

```
app/                    # Next.js App Router
  (app)/page.tsx        # Main page with search, history, settings
  api/analyze/route.ts  # Analysis API endpoint
lib/                    # Backend logic
  ai-analyzer.ts        # Groq/Gemini/OpenAI cascade
  amazon-analyzer.ts    # Orchestrator — scrape, analyze, estimate
  amazon-scraper.ts     # RapidAPI product & review fetching
  revenue-estimator.ts  # BSR power-law revenue model
src/features/analytics/ # UI components
  components/           # Dashboard, cards, charts, PDF generator
  types.ts              # Shared TypeScript interfaces
```

## License

MIT
