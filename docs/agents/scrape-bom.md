# Agent: Scrape BOM (Marine Warnings)

## Mission
Fetch Bureau of Meteorology marine warnings for NSW coastal areas.

## Source
- **RSS**: bom.gov.au/fwo/IDN11001.xml (Sydney), IDN11002.xml (Hunter), IDN11003.xml (Central Coast)
- **Fallback**: bom.gov.au/nsw/warnings/ (HTML scrape)
- **API Type**: RSS/XML + HTML
- **Auth**: None

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape bom
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] bom: Fetching BOM marine warnings for NSW...
[+] bom: success (X records, Yms)
```
Note: 0 records is normal when no active marine warnings exist.

## Database Table
`marine_warnings`

## Error Handling
- Each RSS feed is tried independently; failures don't block others
- Falls back to HTML scraping if RSS feeds fail
- Warnings inserted with 24hr default expiry

## Verification
```sql
SELECT title, region, severity, issued_at, expires_at
FROM marine_warnings
ORDER BY issued_at DESC
LIMIT 5;
```
