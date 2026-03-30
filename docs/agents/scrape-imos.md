# Agent: Scrape IMOS (Acoustic Shark Tracking)

## Mission
Query the IMOS Animal Tracking system for real acoustic shark detections in NSW waters.

## Source
- **URL**: animaltracking.aodn.org.au
- **API Type**: Web scraping / API discovery (JS-rendered app)
- **Auth**: None
- **Data**: Acoustic tag detections from VR4G receivers -- species, location, timestamp

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Status
**Partial** -- the IMOS web interface is a JavaScript SPA. The scraper attempts to discover API endpoints from the page source. Full scraping may require Puppeteer.

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape imos
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] imos: Fetching IMOS animal tracking data...
[~] imos: partial (0 records, Yms)
    IMOS uses JS app; may need Puppeteer for full scraping
```

## Database Table
`shark_detections` (source = 'imos')

## Alternative Access
- REMORA R package: imos-animaltracking.github.io/remora/
- AWS Open Data: registry.opendata.aws/aodn_animal_acoustic_tracking_delayed_qc/
- Contact: IMOS.AnimalTrackingFacility@sims.org.au

## NSW Bounding Box
```
minLat: -37.5, maxLat: -28.0
minLng: 149.0, maxLng: 154.5
```

## Verification
```sql
SELECT id, species, lat, lng, detected_at
FROM shark_detections
WHERE source = 'imos'
ORDER BY detected_at DESC
LIMIT 5;
```
