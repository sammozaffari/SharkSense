# Agent: Scrape Beachwatch (NSW EPA Water Quality)

## Mission
Fetch water quality pollution forecasts from the Beachwatch API for all 5 pilot beaches.

## Source
- **URL**: api.beachwatch.nsw.gov.au/sites (GeoJSON)
- **Fallback**: api.beachwatch.nsw.gov.au/public/sites/rss (RSS)
- **API Type**: REST API (no auth required)
- **Data**: Pollution forecast (Unlikely/Possible/Likely), star rating per beach

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape beachwatch
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] beachwatch: Fetching from Beachwatch GeoJSON API...
[.] beachwatch: Got 245 sites from GeoJSON API
[.] beachwatch:   manly: forecast=Unlikely, rating=null
[+] beachwatch: success (5 records, Yms)
```

## Database Table
`water_quality`

## Error Handling
- If GeoJSON endpoint returns non-200, falls back to RSS feed
- If both fail, logs error to `scrape_logs`
- Beach name matching is case-insensitive

## Verification
```sql
SELECT beach_id, rating, forecast, sampled_at
FROM water_quality
ORDER BY sampled_at DESC
LIMIT 5;
```
