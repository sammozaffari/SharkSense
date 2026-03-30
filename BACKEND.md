# SharkSense — Technical Implementation

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- MapLibre GL JS (CartoDB Voyager light tiles)
- Supabase PostgreSQL (vmzqzsinkxiuezpolsci.supabase.co)
- SunCalc for sunrise/sunset/moon phase
- Deployed on Vercel (free tier)

## Architecture

```
Scrapers (cli/) --> Supabase Postgres --> Next.js Frontend (Vercel)
                                      --> Direct API fallback
```

- Frontend reads from Supabase via `@supabase/supabase-js`
- Falls back to direct API calls if no recent data in DB
- Scrapers run as 3 scheduled Claude Code agents (hourly, daily, weekly)

## Key Decisions

- Three risk levels only (GREEN/AMBER/RED) — no numeric score displayed to users
- Species-specific branching: bull and white scored independently
- Combined score = max(bull_score, white_score); show species-dominant display when gap > 0.15
- Dashboard (`/`) shows all beaches; detail page (`/beach/[id]`) shows full breakdown
- No authentication; public read via Supabase RLS, service-role write

## Project Structure

```
app/              Next.js pages and API routes
components/       React components
lib/data/         Data fetching modules (weather, marine, discharge, etc.)
lib/geo/          Beach definitions, sun/moon, plume geometry
lib/risk/         Risk algorithm (bull, white, combined, projections)
lib/hooks/        React hooks
lib/types.ts      TypeScript interfaces
cli/              Node.js CLI scraper tool (10 scrapers)
data/             Static JSON (stormwater outlets, etc.)
research/         Research findings (10 documents + data/)
supabase/         Database migrations
docs/             Scraping docs and agent configs
```

## Data Sources (12 Scrapers)

| Source | Type | Schedule | Docs |
|--------|------|----------|------|
| @NSWSharkSmart Twitter | Nitter scrape | Hourly | `docs/agents/scrape-twitter.md` |
| Beachwatch (NSW EPA) | REST API | 6hr | `docs/agents/scrape-beachwatch.md` |
| Open-Meteo Weather+Marine | REST API | Hourly | `docs/agents/scrape-openmeteo.md` |
| WaterNSW Discharge | REST API | 6hr | `docs/agents/scrape-waternsw.md` |
| BOM Marine Warnings | RSS/HTML | 6hr | `docs/agents/scrape-bom.md` |
| Taronga ASID | Excel download | Weekly | `docs/agents/scrape-asid.md` |
| IMOS Animal Tracking | Web scrape | 6hr | `docs/agents/scrape-imos.md` |
| SharkSmart Activity | Web scrape | 6hr | `docs/agents/scrape-sharksmart.md` |
| MHL Wave Buoys | Placeholder | 6hr | `docs/agents/scrape-mhl.md` |
| Sydney Water Overflows | HTML scrape | 6hr | `docs/agents/scrape-sydneywater.md` |
| Google News RSS | RSS/XML | 6hr | `docs/agents/scrape-googlenews.md` |
| Tides (WillyWeather) | HTML scrape | 6hr | `docs/agents/scrape-tides.md` |

Full scraper documentation: `docs/SCRAPING.md`

## Database Schema

```
beaches                  5 pilot beaches (seeded)
shark_detections         Real-time tagged shark data (Twitter, IMOS, SharkSmart)
water_quality            Beachwatch pollution forecasts
environmental_snapshots  Weather, marine, discharge data per beach
marine_warnings          BOM storm warnings + Sydney Water overflows
wave_buoy_readings       MHL buoy data (when available)
historical_incidents     470 NSW incidents from Taronga ASID
scrape_logs              Audit log of every scraper run
```

## Scheduled Agents

| Agent | Cron | Schedule (AEDT) | Sources |
|-------|------|-----------------|---------|
| `sharksense-hourly-scrape` | `0 * * * *` | Every hour | twitter, openmeteo |
| `sharksense-daily-scrape` | `0 18 * * *` | 5am AEDT daily | bom, waternsw, sharksmart, sydneywater, imos, mhl, googlenews, tides |
| `sharksense-weekly-historical` | `0 16 * * 6` | 3am AEDT Sundays | asid |

## Risk Algorithm

### Colour Thresholds

```
GREEN:  score < 0.33   (Low Risk)
AMBER:  0.33 - 0.63    (Elevated Risk)
RED:    >= 0.63         (High Risk)
```

### Bull Shark Scoring (Oct-May)

Core factors (sum to 1.00):

| Factor | Weight | Key Threshold |
|--------|--------|---------------|
| Rainfall (7-day cumulative) | 0.30 | >=45mm moderate, >=100mm high |
| River discharge (ratio to 30-day median) | 0.22 | >2x elevated, >5x critical |
| Estuary proximity (static per beach) | 0.15 | <1km = max risk |
| SST | 0.12 | <19C = zero, 22-24C = peak |
| Turbidity (rainfall-derived proxy) | 0.08 | Clears in 3-7 days |
| Time of day | 0.08 | Dawn/dusk = highest |
| Tidal state | 0.05 | High tide = highest |

Modifiers (applied after core score, capped at 1.0):
- Food chain cascade: x1.2 multiplier (baitfish/dolphin within 500m)
- Sewage overflow: +0.08 (confirmed overflow within 72hrs)
- Lunar phase: +0.05 (illumination >75%)

### White Shark Scoring (May-Nov)

Core factors (sum to 1.00):

| Factor | Weight | Key Threshold |
|--------|--------|---------------|
| Upwelling (SST anomaly vs 14-day mean) | 0.25 | -3C+ = critical |
| Acoustic detection | 0.20 | Within 10km/6hrs = max |
| SST window | 0.18 | 14-18C = peak foraging |
| Historical incident density | 0.15 | Beach-specific from ASID |
| Season (day-of-year) | 0.12 | Sep-Nov = peak |
| Tidal state | 0.10 | High tide = highest |

Modifiers:
- Seal colony proximity: x1.2 (within 50km, Sep-Nov; not active for 5 pilot beaches)
- Chlorophyll-a: +0.05 (>1.5 mg/m3, future scraper needed)
- Lunar phase: +0.05 (illumination >75%)

### Combined Score

```
final_score = max(bull_score, white_score)
```

Species-dominant display: show which species drives risk when `abs(bull - white) > 0.15`.

### "When Will It Clear?" Algorithm

Three-stage clearance model:
1. **Active Rain**: Discharge rising or >2x baseline. Risk at current level.
2. **Decay Phase**: Rain stopped, discharge declining. Score halves every 3 days.
3. **Cleared**: Discharge <=1.5x baseline for 24hrs AND no >10mm rain in 72hrs AND no >25mm forecast in 72hrs.

Baseline = 30-day rolling median discharge at nearest WaterNSW gauge.

### Implementation Files

```
lib/risk/bullSharkRisk.ts       Bull shark scoring function
lib/risk/whiteSharkRisk.ts      White shark scoring function
lib/risk/combinedRisk.ts        Combined score, level, dominant factor
lib/risk/projectRisk.ts         5-day forecast projection
lib/risk/clearanceEstimate.ts   Time-to-clear estimate after rain
lib/risk/dominantFactor.ts      Identifies top contributing factor
```

Full scoring functions and thresholds: `research/09-risk-algorithm-design.md`
Machine-readable weights: `research/data/risk-algorithm-weights.json`
Validation scenarios (12): `research/data/validation-scenarios.json`

## Commands

```bash
# Frontend
npm run dev       # Dev server (Turbopack)
npm run build     # Production build
npm run test      # Run vitest

# CLI Scrapers (from cli/ directory)
cd cli
node --import tsx src/index.ts scrape <source>   # Run one scraper
node --import tsx src/index.ts scrape all         # Run all scrapers
node --import tsx src/index.ts db:status          # Check database health
node --import tsx src/index.ts db:seed            # Seed beaches table
```

## Environment Variables

```bash
# .env.local (frontend)
NEXT_PUBLIC_SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

# cli/.env (scrapers)
SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co
SUPABASE_SERVICE_KEY=<service role key>
```

## Testing

- `npm run test` runs vitest
- `lib/risk/__tests__/combinedRisk.test.ts` — risk algorithm unit tests
- `research/data/validation-scenarios.json` — 12 scenarios with expected outputs (Jan 2026 cluster = RED, calm winter day = GREEN)
