# Agent: Scrape SharkSmart (Activity Map)

## Mission
Scrape the NSW SharkSmart activity map for SMART drumline alerts and shark sightings.

## Source
- **URL**: sharksmart.nsw.gov.au/shark-activity
- **API Type**: HTML/JS scraping
- **Auth**: None
- **Data**: Shark detections, SMART drumline captures, drone sightings

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Status
**Partial** -- the SharkSmart activity map is JavaScript-rendered. The scraper searches for embedded JSON marker data in script tags and data attributes. May need Puppeteer for full extraction.

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape sharksmart
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] sharksmart: Fetching SharkSmart activity page...
[~] sharksmart: partial (0 records, Yms)
    No detections parsed (page may use JS rendering)
```

## Database Table
`shark_detections` (source = 'sharksmart')

## Error Handling
- Site may return 403 for some user agents
- JS-rendered content not accessible without headless browser
- When no data found, logs as "partial" not "error"

## Verification
```sql
SELECT id, species, lat, lng, detected_at, raw_text
FROM shark_detections
WHERE source = 'sharksmart'
ORDER BY detected_at DESC
LIMIT 5;
```
