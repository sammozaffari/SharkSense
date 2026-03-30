# Agent: Scrape Open-Meteo (Weather + Marine)

## Mission
Fetch current weather and marine conditions from Open-Meteo for all 5 pilot beaches and store environmental snapshots.

## Source
- **Weather**: api.open-meteo.com/v1/forecast
- **Marine**: marine-api.open-meteo.com/v1/marine
- **API Type**: REST API (free, no auth)
- **Data**: Rainfall, temperature, wind, SST, waves, swell, offshore SST

## Schedule
Every hour (cron: `0 * * * *`)

## Steps
```bash
cd cli
npm install --silent
echo 'SUPABASE_URL=https://vmzqzsinkxiuezpolsci.supabase.co' > .env
echo 'SUPABASE_SERVICE_KEY=<your-service-key>' >> .env
node --import tsx src/index.ts scrape openmeteo
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] openmeteo: Fetching weather + marine data for 5 beaches...
[.] openmeteo:   manly: done
[.] openmeteo:   dee-why: done
[+] openmeteo: success (5 records, Yms)
```

## Database Table
`environmental_snapshots`

## Error Handling
- Each beach is fetched independently; one failure doesn't block others
- Offshore SST fetch failure is non-fatal (upwelling detection degraded but not broken)
- Defaults: SST=20C, waves=0, wind=0 if API values missing

## Verification
```sql
SELECT beach_id, rainfall_72hr, sst, wave_height, fetched_at
FROM environmental_snapshots
ORDER BY fetched_at DESC
LIMIT 5;
```
