# Agent: Scrape WaterNSW (River Discharge)

## Mission
Fetch real-time river discharge data from WaterNSW gauges and update environmental snapshots.

## Source
- **URL**: realtimedata.waternsw.com.au/cgi/webservice.exe
- **API Type**: REST API (flat query params)
- **Auth**: None
- **Data**: Discharge in ML/day from river gauges

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## API Parameters
- **datasource**: `PROV` (provisional/real-time). Do NOT use `A` (archived) — it returns stale data.
- **variable**: `141.01` (Discharge Rate ML/Day). `141.00` errors on some gauges.
- **Concurrency limit**: Max 2 simultaneous requests (error 219 if exceeded)

## Active Gauges
- Nielsen Park: gauge `213004` (Parramatta River catchment)
- Newcastle: gauge `210149` (Hunter River)
- Alternative Newcastle gauge: `210001` (Hunter River at Singleton — main river, better proxy for bull shark risk)

## Steps
```bash
cd cli
npm install --silent
source .env
node --import tsx src/index.ts scrape waternsw
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] waternsw: Fetching discharge for 2 gauges...
[.] waternsw:   nielsen-park: 45.2 ML/day
[.] waternsw:   newcastle: 120.5 ML/day
[+] waternsw: success (2 records, Yms)
```

## Database Table
`environmental_snapshots` (updates `current_discharge` and `baseline_discharge` columns)

## Error Handling
- If gauge has no current data, returns 0 ML/day (risk algorithm uses baseline)
- Only beaches with non-null `water_nsw_gauge_id` are queried
- 30-second timeout per gauge request

## Verification
```sql
SELECT beach_id, current_discharge, baseline_discharge, fetched_at
FROM environmental_snapshots
WHERE current_discharge IS NOT NULL
ORDER BY fetched_at DESC
LIMIT 5;
```
