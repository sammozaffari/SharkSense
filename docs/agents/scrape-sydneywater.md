# Agent: Scrape Sydney Water (Overflow Alerts)

## Mission
Check Sydney Water's wastewater monitoring page for sewage overflow alerts near pilot beaches.

## Source
- **URL**: sydneywater.com.au/water-the-environment/how-we-manage-sydneys-water/wastewater-network/wastewater-monitoring.html
- **API Type**: HTML scraping
- **Auth**: None
- **Data**: Active overflow events, wet weather alerts

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape sydneywater
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] sydneywater: Checking Sydney Water overflow alerts...
[.] sydneywater: Found X overflow mentions
[+] sydneywater: success (X records, Yms)
```
Note: 0 records is normal when no active overflow events exist.

## Database Table
`marine_warnings` (with title prefixed "Sydney Water:")

## Data Relevance
Sewage overflows near beaches:
- Reduce water visibility (turbid, discoloured water)
- Attract baitfish to stormwater outlets
- Both factors increase bull shark risk

## Affected Beaches
manly, dee-why, nielsen-park, bondi (all in Greater Sydney catchment)

## Error Handling
- Page structure may change; scraper searches for overflow-related headings and tables
- Alerts stored with 48hr expiry
- 15-second request timeout

## Verification
```sql
SELECT title, description, severity, issued_at
FROM marine_warnings
WHERE title LIKE 'Sydney Water:%'
ORDER BY issued_at DESC
LIMIT 5;
```
