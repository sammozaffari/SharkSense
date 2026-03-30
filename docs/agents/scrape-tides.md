# Agent: Scrape Tides (WillyWeather)

## Mission
Fetch tide predictions for all 5 pilot beaches and calculate current tidal state for the risk algorithm.

## Source
- **URL**: `tides.willyweather.com.au/nsw/sydney/{locationId}.html`
- **API Type**: HTML scraping (embedded JSON tide data)
- **Auth**: None (public pages)
- **Data**: High/low tide times and heights, current tidal state

## Why This Matters
Research finding (Hammerschlag et al. 2006, 2,546 observed white shark attacks): **tidal state is the #1 environmental predictor of white shark predation events**, ranking above visibility, temperature, and sea conditions. High tide allows sharks closer to shore.

Tidal state weight in risk algorithm:
- Bull shark: 0.05
- White shark: 0.10

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## WillyWeather Location IDs
- Manly: 5131
- Dee Why: 5131 (uses Manly, nearest station)
- Nielsen Park: 4950 (Sydney Harbour)
- Bondi: 5131 (uses Manly, nearest ocean station)
- Newcastle: 4988

## Steps
```bash
cd cli
npm install --silent
source .env
node --import tsx src/index.ts scrape tides
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] tides: Fetching tide predictions for pilot beaches...
[.] tides:   manly: mid_rising
[.] tides:   nielsen-park: high
[+] tides: success (5 records, Yms)
```

## Database Table
`environmental_snapshots` — updates `tide_state` and `tide_data` columns on the latest snapshot for each beach.

## Tidal State Values
- `low` — Low tide or just past low
- `mid_rising` — Rising towards high tide
- `high` — At or near high tide (highest risk)
- `mid_falling` — Falling from high tide

## Error Handling
- If WillyWeather page structure changes, falls back to logging partial
- Each beach is fetched independently; one failure doesn't block others
- If no tide data can be fetched, environmental snapshot keeps existing values

## Database Schema Note
Requires `tide_state` (text) and `tide_data` (jsonb) columns on `environmental_snapshots`. Add migration if not present.

## Verification
```sql
SELECT beach_id, tide_state, fetched_at
FROM environmental_snapshots
WHERE tide_state IS NOT NULL
ORDER BY fetched_at DESC
LIMIT 5;
```
