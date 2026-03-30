# Agent: Scrape ASID (Taronga Historical Incidents)

## Mission
Download the Australian Shark-Incident Database from Zenodo and load NSW incidents into Supabase.

## Source
- **URL**: zenodo.org/api/records/18752301/files/Australian%20Shark-Incident%20Database%20Public%20Version.xlsx/content
- **API Type**: Excel file download
- **Auth**: None
- **Data**: 1296 total incidents (470 NSW), spanning 1791-present

## Schedule
Weekly -- Sunday 3am AEDT (cron: `0 16 * * 6`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape asid
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] asid: Downloading ASID Excel from Zenodo...
[.] asid: Parsed 1296 incident records
[.] asid: 470 NSW incidents
[+] asid: success (470 records, Yms)
```

## Database Table
`historical_incidents`

## Error Handling
- Zenodo download may fail with 404 if record ID changes; check zenodo.org for latest
- Excel column names may vary between versions; scraper normalizes common variations
- Species normalization: white/bull/tiger/wobbegong/unknown
- Outcome normalization: fatal/injured/uninjured
- Incidents >50km from any pilot beach get `nearest_beach_id = null`

## Verification
```sql
SELECT species, COUNT(*), MIN(incident_date), MAX(incident_date)
FROM historical_incidents
GROUP BY species
ORDER BY COUNT(*) DESC;
```
