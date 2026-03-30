# Agent: Scrape Twitter (@NSWSharkSmart)

## Mission
Scrape tagged shark detection alerts from @NSWSharkSmart via Nitter and store in Supabase.

## Source
- **URL**: x.com/NSWSharkSmart (accessed via Nitter mirrors)
- **API Type**: HTML scraping (no auth required)
- **Data**: Tagged shark detections with species, tag ID, listening station, timestamp

## Schedule
Every hour (cron: `0 * * * *`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape twitter
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] twitter: Fetching @NSWSharkSmart tweets via Nitter...
[.] twitter: Using https://nitter.cz
[.] twitter: Found 20 tweets
[+] twitter: success (X records, Yms)
```

## Database Table
`shark_detections` with `source = 'twitter'`

## Error Handling
- If all Nitter instances are down, log error and retry next cycle
- If tweet format changes, detection parsing will return 0 records (logged as success with 0)
- Never fails silently -- all errors logged to `scrape_logs` table

## Verification
```sql
SELECT id, species, detected_at, station_id, tag_id
FROM shark_detections
WHERE source = 'twitter'
ORDER BY detected_at DESC
LIMIT 5;
```
