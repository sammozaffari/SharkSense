# Agent: Scrape MHL (Wave Buoy Data)

## Mission
Fetch real-time wave buoy readings from Manly Hydraulics Laboratory stations.

## Source
- **API**: api.manly.hydraulics.works/api.php
- **Auth**: Required (not publicly available)
- **Data**: Significant wave height, peak period, direction, SST from WAVESYD buoy

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Status
**Placeholder** -- the MHL API requires authentication that is embedded in their web application's JavaScript. Currently, wave data is sourced from Open-Meteo Marine API instead.

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape mhl
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] mhl: MHL API requires auth — using Open-Meteo marine data as wave source
[.] mhl: To get MHL access: email data-request@mhl.nsw.gov.au
[~] mhl: partial (0 records, Xms)
```

## Database Table
`wave_buoy_readings`

## To Enable
1. Email data-request@mhl.nsw.gov.au requesting API access
2. Get API key/token
3. Update cli/src/scrapers/mhl.ts with authentication
4. Stations: WAVESYD (Sydney), WAVEEDN (Eden), WAVECRH (Crowdy Head)

## Verification
```sql
SELECT station, significant_height, peak_period, direction, sst, recorded_at
FROM wave_buoy_readings
ORDER BY recorded_at DESC
LIMIT 5;
```
