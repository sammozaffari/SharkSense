# SharkSense Data Scraping System

## Architecture

```
Scheduled Claude Code Agents (Anthropic Cloud)
  │  Runs every 1hr / 6hr / weekly
  │
  ▼
sharksense-cli (Node.js CLI)
  │  cd cli && node --import tsx src/index.ts scrape <source>
  │
  ▼
Supabase PostgreSQL (vmzqzsinkxiuezpolsci.supabase.co)
  │  8 tables: beaches, shark_detections, water_quality,
  │  environmental_snapshots, marine_warnings, wave_buoy_readings,
  │  historical_incidents, scrape_logs
  │
  ▼
Next.js Frontend (Vercel)
  │  Reads via @supabase/supabase-js
  │  Falls back to direct API calls if no recent data
```

## Quick Reference

```bash
# Run from cli/ directory
cd cli

# Run a specific scraper
node --import tsx src/index.ts scrape twitter
node --import tsx src/index.ts scrape beachwatch
node --import tsx src/index.ts scrape openmeteo
node --import tsx src/index.ts scrape waternsw
node --import tsx src/index.ts scrape bom
node --import tsx src/index.ts scrape asid
node --import tsx src/index.ts scrape imos
node --import tsx src/index.ts scrape sharksmart
node --import tsx src/index.ts scrape mhl
node --import tsx src/index.ts scrape sydneywater
node --import tsx src/index.ts scrape googlenews
node --import tsx src/index.ts scrape tides

# Run all scrapers
node --import tsx src/index.ts scrape all

# Check database status
node --import tsx src/index.ts db:status

# Seed beaches table
node --import tsx src/index.ts db:seed
```

## Scheduled Agents

| Agent | Cron | Schedule (AEDT) | Sources |
|-------|------|-----------------|---------|
| `sharksense-hourly-scrape` | `0 * * * *` | Every hour | twitter, openmeteo |
| `sharksense-daily-scrape` | `0 18 * * *` | 5am AEDT daily | bom, waternsw, sharksmart, sydneywater, imos, mhl, googlenews, tides |
| `sharksense-weekly-historical` | `0 16 * * 6` | 3am AEDT Sundays | asid |

Manage at: https://claude.ai/code/scheduled

---

## Data Sources

### 1. Twitter / @NSWSharkSmart

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/twitter.ts` |
| **Source** | `x.com/NSWSharkSmart` via Nitter (no auth needed) |
| **API Type** | HTML scraping via Nitter instances |
| **Auth** | None |
| **Schedule** | Every hour |
| **DB Table** | `shark_detections` (source = 'twitter') |

**What it does:**
1. Tries multiple Nitter instances (privacy-respecting Twitter frontends) until one responds
2. Parses the HTML timeline for tweet content
3. Filters for detection tweets containing "detected by" + "tagged"
4. Extracts: species (White/Bull/Tiger), tag ID, listening station name, timestamp
5. Geocodes station names to lat/lng using a built-in lookup table
6. Upserts to `shark_detections` with deduplication by `id`

**Tweet format parsed:**
```
DPI Fisheries advise: tagged White Shark #12345 detected by Manly receiver
at 10:23am (AEDT) on 15/03/2026. Last detected at 8:45am by Dee Why receiver.
Tagged and released 01/02/2026 (AEDT) at Port Stephens.
```

**Known limitations:**
- Nitter instances go up and down; scraper tries 3 instances
- Only gets tweets visible on the profile page (~20 most recent)
- Station geocoding covers major NSW stations; unknown stations are skipped

---

### 2. Beachwatch (NSW EPA)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/beachwatch.ts` |
| **Source** | `api.beachwatch.nsw.gov.au` |
| **API Type** | REST API (GeoJSON) with RSS fallback |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `water_quality` |

**What it does:**
1. Fetches `/sites` GeoJSON endpoint (245 NSW beach sites)
2. Matches our 5 pilot beaches by site name
3. Extracts: pollution forecast (Unlikely/Possible/Likely), star rating, lat/lng
4. Falls back to `/public/sites/rss` if GeoJSON fails
5. Inserts to `water_quality` table

**Beach name mapping:**
- manly → "Manly Beach", "South Steyne Beach", "North Steyne Beach"
- dee-why → "Dee Why Beach"
- nielsen-park → "Nielsen Park"
- bondi → "Bondi Beach"
- newcastle → "Nobbys Beach", "Newcastle Beach"

**Data relevance:** Pollution forecast correlates with water visibility, which affects shark risk (turbid water = higher bull shark risk).

---

### 3. Open-Meteo (Weather + Marine)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/openmeteo.ts` |
| **Source** | `api.open-meteo.com` + `marine-api.open-meteo.com` |
| **API Type** | REST API (JSON) |
| **Auth** | None (free, no key) |
| **Schedule** | Every hour |
| **DB Table** | `environmental_snapshots` |

**What it does:**
1. Gets all beaches from `beaches` table
2. For each beach, fetches in parallel:
   - Weather: 72hr rainfall, temperature, wind speed/direction, 7-day precipitation forecast
   - Marine: SST, wave height, swell height/period
   - Offshore SST (20km east offset for upwelling detection)
3. Inserts a snapshot per beach to `environmental_snapshots`

**Fields stored:**
- `rainfall_72hr`, `current_temp`, `wind_speed`, `wind_direction`
- `sst`, `wave_height`, `swell_height`, `swell_period`, `offshore_sst`
- `precipitation_forecast` (JSON array of hourly mm values)

---

### 4. WaterNSW (River Discharge)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/waternsw.ts` |
| **Source** | `realtimedata.waternsw.com.au` |
| **API Type** | REST API (JSON) |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `environmental_snapshots` (updates existing rows) |

**What it does:**
1. Gets beaches with non-null `water_nsw_gauge_id` from DB
2. For each gauge, requests 24hr discharge data (variable 141 = ML/day)
3. Uses flat query parameters (not JSON wrapper)
4. Updates the latest `environmental_snapshots` row with discharge values
5. Falls back to 0 ML/day if gauge has no current data

**Active gauges:**
- Nielsen Park: gauge `213004` (Parramatta River catchment)
- Newcastle: gauge `210149` (Hunter River)

**Known limitations:** Many WaterNSW gauges have intermittent data availability. The scraper handles missing data gracefully by returning 0, which causes the risk algorithm to use baseline values.

---

### 5. BOM (Marine Warnings)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/bom.ts` |
| **Source** | `bom.gov.au/marine/` + RSS feeds |
| **API Type** | RSS/XML + HTML scraping |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `marine_warnings` |

**What it does:**
1. Fetches RSS/XML feeds for NSW coastal areas (IDN11001, IDN11002, IDN11003)
2. Parses `<item>` elements for title, description, publish date
3. Classifies severity from title text (warning/watch/advice)
4. Falls back to scraping `bom.gov.au/nsw/warnings/` HTML page
5. Inserts warnings with 24hr expiry

**Data relevance:** Storm warnings indicate dangerous ocean conditions and may correlate with increased shark activity (prey displacement, turbid water).

---

### 6. Taronga ASID (Historical Incidents)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/asid.ts` |
| **Source** | Zenodo (record 18752301) |
| **API Type** | Excel file download |
| **Auth** | None |
| **Schedule** | Weekly |
| **DB Table** | `historical_incidents` |

**What it does:**
1. Downloads the Australian Shark-Incident Database Excel from Zenodo
2. Parses with `xlsx` library
3. Filters for NSW incidents only (470 of 1296 total)
4. Normalizes species names (White/Bull/Tiger/Wobbegong/Unknown)
5. Normalizes outcomes (fatal/injured/uninjured)
6. Matches each incident to nearest pilot beach by lat/lng (within ~50km)
7. Batch upserts to `historical_incidents`

**Data relevance:** Historical incident density at a location is a factor in the white shark risk algorithm.

---

### 7. IMOS (Animal Tracking)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/imos.ts` |
| **Source** | `animaltracking.aodn.org.au` |
| **API Type** | Web scraping (JS-rendered app) |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `shark_detections` (source = 'imos') |
| **Status** | Partial -- requires Puppeteer for full JS rendering |

**What it does:**
1. Fetches the IMOS tracking page HTML
2. Searches for API endpoint URLs in embedded JavaScript
3. If API found, queries for shark detections in NSW bounding box
4. Filters for White/Bull/Tiger sharks
5. Upserts to `shark_detections`

**Known limitations:** The IMOS web app is a JavaScript SPA. The scraper attempts to find API endpoints in the page source but may need Puppeteer for full rendering. The REMORA R package is an alternative programmatic access method.

---

### 8. SharkSmart (Activity Map)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/sharksmart.ts` |
| **Source** | `sharksmart.nsw.gov.au/shark-activity` |
| **API Type** | HTML/JS scraping |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `shark_detections` (source = 'sharksmart') |
| **Status** | Partial -- page uses JS rendering |

**What it does:**
1. Fetches the SharkSmart activity page
2. Searches for embedded JSON marker data in `<script>` tags
3. Looks for elements with `data-lat`/`data-lng` attributes
4. Parses any found detections with species, location, time
5. Upserts to `shark_detections`

**Known limitations:** The SharkSmart map is JS-rendered. May need Puppeteer. The site also returns 403 to some user agents.

---

### 9. MHL (Wave Buoys)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/mhl.ts` |
| **Source** | `api.manly.hydraulics.works` |
| **API Type** | REST API (requires auth) |
| **Auth** | Required (embedded in MHL web app) |
| **Schedule** | Every 6 hours |
| **DB Table** | `wave_buoy_readings` |
| **Status** | Placeholder -- API requires authentication |

**Current state:** The MHL API at `api.manly.hydraulics.works/api.php` requires authentication that is embedded in their web app's JavaScript. Wave data is currently sourced from Open-Meteo marine API instead.

**To get access:** Email `data-request@mhl.nsw.gov.au` requesting API access for the WAVESYD buoy data.

---

### 10. Sydney Water (Overflow Alerts)

| Field | Value |
|-------|-------|
| **File** | `cli/src/scrapers/sydneywater.ts` |
| **Source** | `sydneywater.com.au` wastewater monitoring page |
| **API Type** | HTML scraping |
| **Auth** | None |
| **Schedule** | Every 6 hours |
| **DB Table** | `marine_warnings` (with "Sydney Water:" prefix) |

**What it does:**
1. Fetches the Sydney Water wastewater monitoring page
2. Searches for headings containing "overflow" or "wet weather"
3. Extracts alert titles and descriptions
4. Also checks tables for overflow event data
5. Stores as `marine_warnings` with 48hr expiry

**Data relevance:** Sewage overflows reduce water visibility and attract baitfish near stormwater outlets, both of which increase bull shark risk.

---

## Database Schema

```
beaches                    -- 5 pilot beaches (seeded from data/beaches.json)
shark_detections           -- Real-time tagged shark data (Twitter, IMOS, SharkSmart)
water_quality              -- Beachwatch pollution forecasts and ratings
environmental_snapshots    -- Weather, marine, discharge data per beach
marine_warnings            -- BOM storm warnings + Sydney Water overflow alerts
wave_buoy_readings         -- MHL buoy data (when available)
historical_incidents       -- 470 NSW incidents from Taronga ASID
scrape_logs                -- Audit log of every scraper run
```

## Adding a New Scraper

1. Create `cli/src/scrapers/newsource.ts`
2. Export an `async function scrapeNewSource()`
3. Use `db` from `../db.js` for Supabase writes
4. Use `logScrape()` and `log()` from `../logger.js`
5. Add to the `SCRAPERS` map in `cli/src/index.ts`
6. Create `docs/agents/scrape-newsource.md`
7. Add to a scheduled agent or create a new one

## Troubleshooting

**Check scraper health:**
```bash
cd cli && node --import tsx src/index.ts db:status
```

**Re-run a failed scrape:**
```bash
node --import tsx src/index.ts scrape <source>
```

**Common errors:**
- `All Nitter instances unavailable` -- Twitter scraper can't reach any Nitter mirror. Wait and retry.
- `No trace data` -- WaterNSW gauge has no current readings. Normal for some gauges.
- `page may use JS rendering` -- IMOS/SharkSmart need Puppeteer. Currently partial.
- `MHL API requires authentication` -- Email data-request@mhl.nsw.gov.au for access.
