# Agent: Scrape Google News (Shark News RSS)

## Mission
Fetch recent shark-related news articles from Google News RSS for NSW, replacing unreliable Nitter/Twitter scraping as a supplementary detection awareness source.

## Source
- **URL**: `news.google.com/rss/search?q=shark+attack+NSW+Australia&hl=en-AU&gl=AU&ceid=AU:en`
- **API Type**: RSS/XML (free, no auth)
- **Data**: News article titles, links, publication dates, source names

## Schedule
Every 6 hours (cron: `0 */6 * * *`)

## Steps
```bash
cd cli
npm install --silent
source .env
node --import tsx src/index.ts scrape googlenews
node --import tsx src/index.ts db:status
```

## Expected Output
```
[.] googlenews: Fetching Google News RSS for shark news...
[.] googlenews: Found 50 articles
[+] googlenews: success (X records, Yms)
```

## Database Table
`marine_warnings` with title prefixed "News:" and severity "info"

## Why This Exists
The Twitter/@NSWSharkSmart scraper relies on Nitter instances which are increasingly unreliable. Google News RSS provides broader shark news coverage at zero cost with no authentication. Articles expire after 7 days.

## Error Handling
- If Google News returns non-200, logs error to `scrape_logs`
- Filters articles by shark-related keywords to avoid false positives
- Deduplicates by URL-based ID

## Verification
```sql
SELECT title, severity, issued_at, source_url
FROM marine_warnings
WHERE title LIKE 'News:%'
ORDER BY issued_at DESC
LIMIT 5;
```
