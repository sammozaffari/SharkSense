# SharkSense

Predictive shark risk intelligence for NSW ocean users.

- **Product vision and requirements**: `SHARKSENSE.md`
- **Technical implementation**: `BACKEND.md`
- **Scraper documentation**: `docs/SCRAPING.md`
- **Research findings**: `research/` (10 documents)

## Quick Commands

```bash
npm run dev                                           # Frontend dev server
npm run build                                         # Production build
npm run test                                          # Run tests
cd cli && node --import tsx src/index.ts scrape all   # Run all scrapers
cd cli && node --import tsx src/index.ts db:status    # Check DB health
```

## Architecture

- Next.js 16 + React 19 + TypeScript + Tailwind v4
- Supabase Postgres, Vercel deployment
- 12 scrapers in `cli/`, 3 scheduled agents
- Risk: GREEN (<0.33) / AMBER (0.33-0.63) / RED (>=0.63)
- Species branching: bull (rainfall) vs white (upwelling), combined = max

## Key Decisions

- No authentication; public read via Supabase RLS
- Scrapers write via service role key
- Frontend falls back to direct API calls if DB data is stale
- 5 pilot beaches: Manly, Dee Why, Nielsen Park, Bondi, Newcastle
