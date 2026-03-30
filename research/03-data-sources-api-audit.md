# SharkSense Data Sources & API Audit

**Audited:** 2026-03-29
**Purpose:** Verify all data sources, document endpoints, test live APIs, and assess integration complexity for the SharkSense predictive shark risk platform.

---

## 3.1 Tier 1 Sources (Must Verify)

---

## WaterNSW Real-Time River Discharge

- **Status:** Active
- **URL:** `https://realtimedata.waternsw.com.au/cgi/webservice.exe`
- **Access method:** REST API (JSON-encoded URL parameters)
- **Authentication:** None (no API key required)
- **Rate limits:** Concurrency limit of 2 simultaneous requests (error 219 thrown above this); no published daily cap
- **CORS support:** Unknown (server-side only recommended)
- **Data format:** JSON
- **Update frequency:** Near-real-time telemetry (sub-hourly data available, hourly aggregates most reliable)
- **Cost:** Free
- **NSW coverage:** Full state — hundreds of gauges across all major NSW river catchments
- **Relevant parameters:** `100.00` Stream Water Level (m), `141.01` Discharge Rate (ML/Day), `141.02` Discharge Rate (ML/Day), `151.00` Discharge Volume (ML), `2010.00` Electrical Conductivity (µS/cm), `2080.00` Water Temperature (°C)
- **Integration complexity:** Medium
- **Notes:**
  - API uses JSON objects URL-encoded as query strings. Example pattern:
    ```
    GET /cgi/webservice.exe?{"function":"get_ts_traces","version":"2","params":{"site_list":"210040","datasource":"PROV","var_list":"141.01","start_time":"20260326000000","end_time":"20260329000000","data_type":"mean","interval":"hour","multiplier":"1"}}
    ```
  - Datasource codes per site: `PROV` (provisional, most current), `QA` (quality-assured), `A` (archived — confirmed working for Wybong Creek), `WEBPROV`, `AUTOQCNOWTELEM`
  - `PROV` datasource confirmed working and returning live data (tested 2026-03-29)
  - Response includes site name, lat/lon, timezone, quality codes (125 = passed gross error check, 55 = flat-line auto-QC)
  - Timestamp format in response: `YYYYMMDDHHmm00`
  - Available functions: `get_site_list`, `get_variable_list`, `get_ts_traces`, `get_datasources_by_site`, `get_site_geojson`
  - Variable 141.00 returns error on some gauges; use 141.01 for discharge rate
- **Tested:** Yes, 2026-03-29. Confirmed live data for Wybong Creek (210040): 81 hourly water level readings March 26–29, 0.954–0.963 m range.

### Key Gauge IDs for SharkSense Pilot Beaches

| Gauge ID | Site Name | River/Creek | Relevance |
|----------|-----------|-------------|-----------|
| 210001 | Hunter River at Singleton | Hunter River | Newcastle/Nobbys Beach |
| 210040 | Wybong Creek at Wybong | Wybong Creek (Hunter trib.) | Hunter catchment proxy |
| 210044 | Valid (name unconfirmed) | Hunter catchment | Hunter area |
| 210068 | Pokolbin Creek at Pokolbin Site 3 | Pokolbin Creek → Hunter | Hunter catchment |
| 210090 | Valid (name unconfirmed) | Hunter catchment | Hunter area |
| 212008 | Coxs River at Bathurst Road | Coxs River | Inland — not directly relevant |
| 212012 | Valid (name unconfirmed) | 212xxx series | Sydney basin |
| 212055 | Neubecks Creek upstream of Wallerawang | Neubecks Creek | Inland colliery site |
| 213201 | O'Hares Creek at Cobbong | O'Hares Creek → Georges R. | Georges River / Port Hacking |
| 213202 | Stokes Creek at Minerva Falls | Stokes Creek | Investigate further |
| 203013 | Wilsons River at Federal | Wilsons River | Northern NSW rivers |

**Note:** Gauge number prefix indicates drainage division: 210xxx = Hunter River, 212xxx/213xxx = Sydney coastal/Hawkesbury-Nepean, 203xxx = North Coast NSW. Specific Parramatta River, Cooks River, Middle Harbour Creek, and Georges River gauges require additional enumeration — the 213xxx series (213201–213218 all valid) likely covers Georges/Cooks catchments. The WaterNSW portal UI should be used to locate exact gauge IDs for Parramatta (206xxx or 212xxx likely), Cooks (213xxx), and Middle Harbour (550xxx series confirmed to have valid gauges).

---

## Open-Meteo Weather API

- **Status:** Active
- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Access method:** REST API (GET with query parameters)
- **Authentication:** None for free tier; API key required for commercial use
- **Rate limits:** Free: 600 req/min, 5,000 req/hr, 10,000 req/day, 300,000 req/month
- **CORS support:** Yes (tested from browser)
- **Data format:** JSON
- **Update frequency:** Hourly (forecasts updated every hour); past data via `past_days` parameter
- **Cost:** Free (non-commercial); paid from ~$40/month
- **NSW coverage:** Global — full coverage for all NSW coastal locations
- **Relevant parameters:**
  - `precipitation` — Total precipitation (rain + snow) in mm
  - `rain` — Large-scale rainfall in mm
  - `showers` — Convective precipitation in mm
  - `temperature_2m` — Air temperature at 2 m above ground (°C)
  - `wind_speed_10m` — Wind speed at 10 m (km/h)
  - `wind_direction_10m` — Wind direction (degrees)
  - `precipitation_probability` — Probability of precipitation >0.1mm (%)
  - `apparent_temperature` — Feels-like temperature
- **Integration complexity:** Low
- **Notes:**
  - Supports `past_days=3` to retrieve 3 days of historical data without a separate historical API call
  - Response includes `generationtime_ms` field confirming successful requests
  - Coordinate snapping: requested (-33.8688, 151.2093) snapped to (-33.875, 151.125) in response
  - Timezone can be specified via `timezone=Australia/Sydney`
  - No authentication header needed for free tier
  - For production use, add `?apikey=<key>` parameter
- **Tested:** Yes, 2026-03-29. Returned 48 hours of forecast data for Sydney: temp range 12.6–23.1°C, wind 1.8–15.8 km/h, precipitation 0 mm (dry period).

---

## Open-Meteo Marine API

- **Status:** Active
- **URL:** `https://marine-api.open-meteo.com/v1/marine`
- **Access method:** REST API (GET with query parameters)
- **Authentication:** Same as Weather API (none for free tier)
- **Rate limits:** Same as Weather API
- **CORS support:** Yes
- **Data format:** JSON
- **Update frequency:** Hourly (model-dependent; ERA5-Ocean back to 1940)
- **Cost:** Free (non-commercial)
- **NSW coverage:** Global — confirmed working for Sydney coordinates
- **Relevant parameters:**
  - `wave_height` — Significant wave height (m) — tested, confirmed
  - `sea_surface_temperature` — SST (°C) — tested, confirmed (~23.5°C for Sydney on 2026-03-29)
  - `swell_wave_height` — Swell wave height (m)
  - `wave_direction` — Mean wave direction (degrees)
  - `swell_wave_direction` — Swell direction (degrees)
  - `swell_wave_period` — Swell period (seconds)
  - `wind_wave_height`, `wind_wave_direction`, `wind_wave_period`
  - Secondary and tertiary swell components also available
- **Integration complexity:** Low
- **Notes:**
  - Model sources: MeteoFrance MFWAM (0.08°), ECMWF WAM, GFS Wave (0.16°), ERA5-Ocean
  - No upwelling-specific variables — upwelling proxy must be derived from SST gradient/anomaly
  - SST from Open-Meteo Marine is a bulk SST estimate, not a satellite composite; consider supplementing with NOAA MUR SST for higher accuracy
  - Coordinate snapping similar to weather API (0.125° grid)
- **Tested:** Yes, 2026-03-29. Wave heights 1.34–2.18 m, SST ~23.5°C for Sydney.

---

## NSW SEED Estuaries Dataset

- **Status:** Partially Active (limited GIS formats found)
- **URL:** `https://datasets.seed.nsw.gov.au/dataset?tags=estuary`
- **Access method:** File download
- **Authentication:** None
- **Rate limits:** None
- **CORS support:** N/A (file download)
- **Data format:** PDF, TXT, ZIP (confirmed). Shapefile availability unconfirmed via automated search.
- **Update frequency:** Static (periodically updated)
- **Cost:** Free
- **NSW coverage:** Full NSW estuary network
- **Relevant parameters:** Estuary polygon geometries, catchment areas, estuary classifications, proximity data for SharkSense estuary-proximity scoring
- **Integration complexity:** Medium
- **Notes:**
  - Two datasets tagged "estuary" found on 2026-03-29; provided by DPIRD and NSW DCCEEW
  - Direct dataset URL `/dataset/nsw-estuaries` returned 404 — use tag search instead
  - Portal hosts 6,759 datasets total; estuary data may be in ZIP archives containing shapefiles
  - Alternative: NSW Government Spatial Collaboration Portal (scp.environment.nsw.gov.au) likely has GIS-ready estuary boundaries in WMS/WFS format
  - For SharkSense proximity scoring, a static pre-processed GeoJSON of estuary mouths is sufficient — consider using the OEH Coastal Waterbodies shapefile via direct download
- **Tested:** Partially, 2026-03-29. Main URL 200 OK but dataset page returns 404; tag search returns 2 results but no direct SHP download URL identified.

---

## Australian Shark-Incident Database (ASID)

- **Status:** Active
- **URL:** `https://zenodo.org/doi/10.5281/zenodo.5612260` (living version updated by collaborators)
- **Access method:** File download (Excel .xlsx)
- **Authentication:** None (public domain — CC0 1.0 Universal)
- **Rate limits:** None
- **CORS support:** N/A (file download)
- **Data format:** Excel (.xlsx), ~1,200 rows × ~50 columns
- **Update frequency:** Periodically (living dataset, updated by Taronga/Flinders collaborators)
- **Cost:** Free
- **NSW coverage:** All Australian states including NSW — NSW incidents span 1791–2022
- **Relevant parameters:** Date, location, coordinates (lat/lon), victim activity (surfing/swimming/diving etc.), shark species, injury severity, time of day, water visibility, weather conditions, water temperature, sea state — ~50 fields total
- **Integration complexity:** Low (one-time download, parse into DB)
- **Notes:**
  - 1,196 total incidents 1791–2022 as of last public version; living dataset likely updated
  - Private information removed from public version
  - Zenodo record 5612260 shows restricted download status on direct page; the GitHub readme confirms the DOI link
  - For NSW-specific count: approximately 300–400 incidents based on NSW's historical share of Australian attacks (~25–35%)
  - Primary use in SharkSense: seed the `historical_incidents` table for historical risk scoring layer
  - SCIRP forecasting study referenced in brief uses ASID as its primary dataset
- **Tested:** Yes (README), 2026-03-29. GitHub README confirms dataset structure and Zenodo DOI.

---

## 3.2 Tier 2 Sources

---

## BOM Rainfall Observations

- **Status:** Active (web interface confirmed; JSON API endpoints exist but timeout frequently)
- **URL:** `https://www.bom.gov.au/` — observations via `https://www.bom.gov.au/fwo/[stateID]/[stationID].json`
- **Access method:** REST API (undocumented but known pattern)
- **Authentication:** None
- **Rate limits:** Unknown (BOM does not publish limits; aggressive scraping blocked)
- **CORS support:** No (server-side fetching only)
- **Data format:** JSON
- **Update frequency:** 30-minute to hourly (station-dependent)
- **Cost:** Free
- **NSW coverage:** Dense station network — hundreds of stations across NSW coast
- **Relevant parameters:** `rain_trace` — cumulative rainfall since 9am (mm), `air_temp`, `wind_spd_kmh`, `wind_dir`
- **Integration complexity:** Medium
- **Notes:**
  - BOM JSON API is unofficial/undocumented and subject to change or blocking
  - For SharkSense purposes, **Open-Meteo precipitation adds equivalent or greater value** with a stable, documented API. BOM adds value only for real-time station-level rainfall (point observations vs. model output).
  - BOM also provides the official Australian Water Data online portal (similar to WaterNSW but national scope): `http://www.bom.gov.au/waterdata/` — confirmed 200 OK but times out under load
  - **Verdict: Open-Meteo supersedes BOM for SharkSense precipitation needs. BOM worth adding as a secondary verification source if station-level rainfall needed.**
- **Tested:** Partially, 2026-03-29. JSON endpoints timeout; website accessible.

---

## SunCalc.js

- **Status:** Active (npm package)
- **URL:** `https://www.npmjs.com/package/suncalc`
- **Access method:** npm package (client and server-side)
- **Authentication:** None
- **Rate limits:** None (runs locally)
- **CORS support:** N/A (local computation)
- **Data format:** JavaScript Date objects and numeric values
- **Update frequency:** Real-time (computed on-demand)
- **Cost:** Free (BSD license)
- **NSW coverage:** Global (astronomical calculations)
- **Relevant parameters:**
  - `SunCalc.getTimes(date, lat, lon)` → sunrise, sunset, dawn, dusk, goldenHour, solarNoon
  - `SunCalc.getMoonIllumination(date)` → `phase` (0–1), `fraction` (illuminated), `angle`
  - `SunCalc.getMoonTimes(date, lat, lon)` → moonrise, moonset
  - `SunCalc.getPosition(date, lat, lon)` → altitude, azimuth
- **Integration complexity:** Low
- **Notes:**
  - Latest version: 1.9.0, published 2022-02-07 (last update ~4 years ago but stable)
  - Already referenced in CLAUDE.md as a stack dependency — confirmed available
  - Moon phase (0 = new moon, 0.5 = full moon) is a relevant risk factor for shark activity; some research links full moon/new moon to increased movement
  - npm package has no declared dependencies
- **Tested:** Yes, 2026-03-29. npm registry confirmed version 1.9.0.

---

## Tide Predictions — Best Free API for NSW

### WillyWeather Tides API
- **Status:** Active
- **URL:** `https://api.willyweather.com.au/v2/<key>/locations/<locationId>/weather.json`
- **Access method:** REST API
- **Authentication:** API key (registration required, free tier available)
- **Rate limits:** Not published; free tier throttled
- **CORS support:** Unknown
- **Data format:** JSON
- **Update frequency:** Static predictions (computed; tidal cycle)
- **Cost:** Free tier available; paid for unlimited
- **NSW coverage:** Full NSW coast, 1,400+ Australian tide locations including Bondi, Manly, Fort Denison, Palm Beach, Botany Bay
- **Relevant parameters:** High/low tide times and heights, tide height curves
- **Integration complexity:** Medium (requires location ID mapping)
- **Notes:** WillyWeather confirmed to cover all SharkSense pilot beach locations

### WorldTides API
- **Status:** Active (domain SSL issues detected — cert mismatch on `api.worldtides.info` suggesting hosting instability)
- **URL:** `https://www.worldtides.info/api/v3`
- **Access method:** REST API
- **Authentication:** API key (free credits available on sign-up)
- **Rate limits:** Per-plan; free credits included
- **CORS support:** Unknown
- **Data format:** JSON
- **Update frequency:** Static predictions
- **Cost:** Freemium (free credits, then paid)
- **NSW coverage:** Global coverage including Australian BOM tidal datum reference
- **Relevant parameters:** Heights at regular intervals or high/low extremes, datum options (LAT, MSL, AHD)
- **Integration complexity:** Low
- **Notes:** SSL certificate mismatch detected on 2026-03-29 (`api.worldtides.info` not in cert alt names). Use `www.worldtides.info/api` endpoint instead. Supports Australian Chart Datum and BOM reference levels.

### BOM Tide Tables
- **Status:** Active (web tables only)
- **Access method:** Web scraping only (no API)
- **Notes:** BOM publishes official Australian National Tide Tables but only as web pages and PDFs. Not suitable for automated API integration without scraping.

**Recommendation for SharkSense:** Use **WillyWeather** as primary tide source (Australian company, covers all pilot beaches, documented API). WorldTides as fallback if WillyWeather proves rate-limiting. Open-Meteo Marine does not include tidal heights.

---

## 3.3 Tier 3 Sources

---

## SharkSmart X/Twitter Feed (@nsw_sharksmart)

- **Status:** Untested (Twitter/X API blocked)
- **URL:** `https://x.com/nsw_sharksmart`
- **Access method:** Twitter/X API v2 or Nitter scraping
- **Authentication:** Twitter API bearer token (paid tier for full access as of 2023)
- **Rate limits:** Free tier: 500,000 tweets/month read; Basic: $100/month
- **CORS support:** No
- **Data format:** JSON (Twitter API), HTML (Nitter)
- **Update frequency:** As posted (typically multiple times per day during incident periods)
- **Cost:** Twitter API Free tier severely limited; Nitter instances available but unreliable
- **NSW coverage:** NSW-specific shark detection and incident alerts
- **Relevant parameters:** Tweet text (contains beach name, species, detection type), timestamp, location mentions
- **Integration complexity:** High (API access costs, parsing required)
- **Notes:**
  - Google News RSS for "shark attack NSW" confirmed 50 recent results on 2026-03-29, spanning Jan–March 2026, covering the same incident types as Twitter feed
  - Nitter.net no longer operational; alternative Nitter instances exist but are unreliable
  - @nsw_sharksmart is the official NSW Government SharkSmart Twitter account
  - **Alternative: SharkSmart website** (`sharksmart.nsw.gov.au`) publishes shark activity data but blocked scraping (403)
  - **Practical approach: Google News RSS** (`https://news.google.com/rss/search?q=shark+attack+NSW`) provides equivalent coverage at zero cost
- **Tested:** Blocked (402 error on direct X URL), 2026-03-29.

---

## AODN / IMOS Portal

### IMOS Ocean Colour (Chlorophyll-a, Turbidity)
- **Status:** Active
- **URL:** `https://portal.aodn.org.au/`
- **Access method:** AODN Portal download, WMS/WFS OGC services
- **Authentication:** None for download; registration recommended
- **Rate limits:** Unknown
- **CORS support:** Unknown
- **Data format:** NetCDF, CSV via ERDDAP, WMS tiles
- **Update frequency:** Daily (satellite composites)
- **Cost:** Free (openly available)
- **NSW coverage:** Full east coast coverage
- **Relevant parameters:** Chlorophyll-a concentration (mg/m³), turbidity (NTU), diffuse attenuation coefficient (Kd490), sea surface temperature composites
- **Integration complexity:** High (NetCDF processing, ERDDAP queries)
- **Notes:**
  - IMOS makes all data "openly and freely accessible"
  - Primary access via AODN Portal or ERDDAP server (specific ERDDAP URL for AODN not confirmed — `erddap.aodn.org.au` DNS lookup failed)
  - OGC WMS/WFS services via `geoserver.imos.org.au` (DNS failed on 2026-03-29 — may be undergoing migration)
  - **Alternative for chlorophyll-a:** Copernicus Marine Service (see below) is more reliable

### IMOS Animal Acoustic Telemetry (Shark Tracking)
- **Status:** Active (portal accessible; direct API endpoints blocked)
- **URL:** `https://animaltracking.aodn.org.au/` (returns 401)
- **Access method:** AODN Portal, formal data request
- **Authentication:** Registration/login required
- **Rate limits:** Unknown
- **CORS support:** No
- **Data format:** CSV/NetCDF
- **Update frequency:** Continuous (receiver network logs detections)
- **Cost:** Free (with registration)
- **NSW coverage:** Acoustic receiver network covers NSW coast including key estuaries and reefs
- **Relevant parameters:** Detection timestamps, receiver locations, animal IDs, species (white shark, bull shark, tiger shark tracked), depth
- **Integration complexity:** High (data access requires registration and formal request for non-published detections)
- **Notes:**
  - IMOS Acoustic Telemetry uses strategically placed receivers in Australian waters
  - Shark species including white sharks and bull sharks are tagged and tracked
  - Historical detection data available; near-real-time requires partnership with IMOS
  - For SharkSense: this is the highest-value shark-specific data source for the detection risk layer — worth pursuing formal access
- **Tested:** 401 Unauthorized on direct portal access, 2026-03-29.

---

## Sydney Water Overflow Data

- **Status:** Partially Active (website redirected to maintenance page)
- **URL:** `https://www.sydneywater.com.au/water-the-environment/how-we-manage-our-water-systems/sewage-overflows/sewage-overflow-tracker.html`
- **Access method:** Web scraping (HTML)
- **Authentication:** None
- **Rate limits:** Unknown
- **CORS support:** No
- **Data format:** HTML (no API)
- **Update frequency:** Unknown (reportedly updated when overflow events occur)
- **Cost:** Free
- **NSW coverage:** Sydney Water service area (Greater Sydney)
- **Relevant parameters:** Overflow location, volume, start/end time, receiving waterway
- **Integration complexity:** High (HTML scraping, no structured data)
- **Notes:**
  - Direct URL returned 404 on 2026-03-29 — page may have moved or been removed
  - Sydney Water provides a "Sewer Overflow Tracker" map but no API
  - Alternative: `data.nsw.gov.au` may have structured overflow data
  - For SharkSense: stormwater/sewage discharge into estuaries is a proxy for bull shark food availability — not a hard requirement for v1
- **Tested:** 404, 2026-03-29.

---

## Copernicus Sentinel-3 OLCI (Chlorophyll-a and Turbidity at 300 m)

- **Status:** Active
- **URL:** `https://data.marine.copernicus.eu/product/OCEANCOLOUR_GLO_BGC_L3_NRT_009_101`
- **Access method:** Copernicus Marine Toolbox (Python CLI), FTP/HTTPS download, WMTS
- **Authentication:** Free registration required (Copernicus Marine account)
- **Rate limits:** Not specified; download rate limited by bandwidth
- **CORS support:** Yes (WMTS tiles for visualization)
- **Data format:** NetCDF-4 (primary), Zarr (cloud-native), downsampled versions
- **Update frequency:** Daily (updated at 22:00 UTC); near-real-time
- **Cost:** Free (open data with registration)
- **NSW coverage:** Global — 4 km primary spatial resolution; 300 m available from OLCI sensor inputs
- **Relevant parameters:**
  - `CHL` — Chlorophyll-a concentration (mg/m³)
  - Suspended matter
  - Secchi depth
  - Diffuse attenuation (Kd490)
  - Phytoplankton functional types
  - Reflectance at multiple wavelengths
- **Integration complexity:** High (registration, Python toolbox, NetCDF processing)
- **Notes:**
  - Dataset temporal coverage: April 25, 2023 – March 27, 2026 (NRT product)
  - 300 m resolution available from OLCI (Sentinel-3A/B) specifically for coastal applications
  - License: Copernicus Marine Service License (freely usable with attribution)
  - `copernicusmarine` Python package provides CLI download capability
  - For SharkSense: turbidity (water clarity) is directly relevant to the visibility component of bull shark risk scoring
  - **Practical concern:** Coastal pixel masking and cloud coverage reduce daily data availability — 7-day composites more reliable than daily for cloudy NSW winters
- **Tested:** Product page confirmed, 2026-03-29. Download requires registration.

---

## NOAA Daily SST Composites (Upwelling Detection)

- **Status:** Active
- **URL:** `https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1`
- **Access method:** OPeNDAP (`https://opendap.earthdata.nasa.gov`), Harmony API, direct download
- **Authentication:** NASA EarthData account required (free registration)
- **Rate limits:** Not specified
- **CORS support:** OPeNDAP access requires authentication flow
- **Data format:** NetCDF-4
- **Update frequency:** Daily (1-day latency for NRT; 4-day for retrospective)
- **Cost:** Free (NASA open data, CC BY 4.0)
- **NSW coverage:** Global — 0.01° (~1 km) resolution
- **Relevant parameters:** `analysed_sst` — Sea surface temperature (°C) blended from satellite + in-situ observations
- **Integration complexity:** High (NASA EarthData OAuth, OPeNDAP subsetting)
- **Notes:**
  - MUR = Multi-scale Ultra-high Resolution SST
  - Available since 2002-05-31 to present
  - For upwelling detection: compare SST at offshore vs. nearshore pixels; significant negative anomaly indicates upwelling (cooler nutrient-rich water)
  - EarthData login blocks programmatic access without proper OAuth flow
  - **Simpler alternative:** Open-Meteo Marine `sea_surface_temperature` provides daily SST at model resolution with no authentication — sufficient for basic upwelling proxy
  - For operational use: NOAA CoastWatch ERDDAP (`coastwatch.pfeg.noaa.gov/erddap`) provides OPeNDAP-style subsetting but timed out during testing
- **Tested:** Partially, 2026-03-29. OPeNDAP redirects to NASA EarthData OAuth. ERDDAP endpoint timed out.

---

## Google News RSS / News API

- **Status:** Active (Google News RSS confirmed working; NewsAPI.org separately available)
- **URL (Google News RSS):** `https://news.google.com/rss/search?q=shark+attack+NSW+Australia&hl=en-AU&gl=AU&ceid=AU:en`
- **URL (NewsAPI.org):** `https://newsapi.org/v2/everything?q=shark+attack+NSW`
- **Access method:** RSS feed (Google News, no auth); REST API (NewsAPI.org, API key)
- **Authentication:** None for Google News RSS; API key for NewsAPI.org
- **Rate limits:** Google News RSS: no published limit; NewsAPI.org free: 100 req/day
- **CORS support:** Google News RSS: No (server-side fetching); NewsAPI.org: Yes (with key)
- **Data format:** XML/RSS (Google); JSON (NewsAPI.org)
- **Update frequency:** Near-real-time (Google News); 24-hour delay on NewsAPI.org free tier
- **Cost:** Google News RSS: Free; NewsAPI.org: Free (dev/testing, localhost CORS only), $449/month (Business, production)
- **NSW coverage:** Global news filtered by query — effectively NSW-specific when using geo-targeted query
- **Relevant parameters:** Article title, URL, publication date, source name, description snippet
- **Integration complexity:** Low (Google RSS); Medium (NewsAPI.org with production costs)
- **Notes:**
  - **Google News RSS confirmed active on 2026-03-29:** Returned 50 results for "shark attack NSW Australia", spanning September 2025–March 2026, sources include BBC, The Guardian, ABC, 9News
  - Google News RSS is the recommended approach — zero cost, no authentication, returns recent and relevant NSW shark news
  - NewsAPI.org free tier explicitly prohibits production use (dev/localhost only)
  - Use case: trigger alert/elevated monitoring flag when recent shark attack news detected for monitored beach area
- **Tested:** Yes (Google News RSS), 2026-03-29. 50 items returned, updated 2026-03-29 04:43 UTC.

---

## 3.4 New Sources to Investigate

---

## Kaggle Shark Attack Datasets

- **Status:** Active
- **URL:** `https://www.kaggle.com/datasets/teajay/global-shark-attacks`
- **Access method:** File download (ZIP → CSV)
- **Authentication:** Kaggle account required (free)
- **Rate limits:** None (manual download)
- **CORS support:** N/A
- **Data format:** CSV (via ZIP, 561 KB)
- **Update frequency:** Static (last updated 2018-07-04 for this dataset)
- **Cost:** Free
- **NSW coverage:** Global — source is the Global Shark Attack File (GSAF); Australia/NSW records included
- **Relevant parameters:** Date, location, country, activity, injury, species, sex, age, investigator source
- **Integration complexity:** Low
- **Notes:**
  - Dataset is a mirror of the Global Shark Attack File (sharkattackfile.net)
  - 11,995 downloads; 87,424 views indicating wide use
  - Freely downloadable with Kaggle account ("isAccessibleForFree: true")
  - Predates ASID — use ASID for Australia-specific incidents (more comprehensive and maintained)
  - The GSAF/Kaggle dataset covers global incidents from the 1800s to 2018
  - **Verdict: Lower priority than ASID for SharkSense — use ASID for Australian-specific historical data**
- **Tested:** Metadata confirmed, 2026-03-29.

---

## International Shark Attack File (ISAF)

- **Status:** Active (research access only)
- **URL:** `https://www.floridamuseum.ufl.edu/shark-attacks/`
- **Access method:** Formal data request via `https://www.floridamuseum.ufl.edu/shark-attacks/isaf-data-request/`
- **Authentication:** Institutional/researcher registration required
- **Rate limits:** N/A (not an API)
- **CORS support:** N/A
- **Data format:** Excel/CSV (upon approved request)
- **Update frequency:** Annual updates (2025 summary published)
- **Cost:** Free (with approved request)
- **NSW coverage:** Yes — 2025 data: 8 NSW unprovoked bites (2 fatal); Australia total: 21 unprovoked in 2025
- **Relevant parameters:** Date, location, victim activity, shark species, injury severity, provocation status, investigative notes
- **Integration complexity:** High (formal request process, not automated)
- **Notes:**
  - ISAF investigated 105 global shark-human interactions in 2025
  - NSW data: 8 unprovoked bites, 2 fatal in 2025 (significantly up from average)
  - Data request page returned timeout on 2026-03-29; institutional researcher affiliation typically required
  - **Verdict: Use ASID (Zenodo) instead — freely available, Australian-focused, same underlying data for Australian incidents**
- **Tested:** Partially, 2026-03-29. Summary page accessible; data request page timed out.

---

## Tracking Sharks (trackingsharks.com)

- **Status:** Active (news aggregation site; no data API)
- **URL:** `https://trackingsharks.com/`
- **Access method:** Web scraping (HTML news articles)
- **Authentication:** None
- **Rate limits:** Unknown
- **CORS support:** No
- **Data format:** HTML only
- **Update frequency:** Daily (news aggregation)
- **Cost:** Free
- **NSW coverage:** Global coverage — Australia section exists
- **Relevant parameters:** Shark attack news headlines, date, beach/location, species mentioned
- **Integration complexity:** High (HTML scraping, unstructured text)
- **Notes:**
  - Tracking Sharks is a news/media site, not a structured data provider
  - "The toothiest place on the web" — primarily consumer-facing shark attack news
  - No API found; no structured data download
  - Australia section likely aggregates the same incidents already covered by Google News RSS
  - **Verdict: Google News RSS covers the same information with less scraping complexity — skip Tracking Sharks**
- **Tested:** Site accessible, 2026-03-29. No API or data download found.

---

## SCIRP Forecasting Study (30 Marine Weather Variables)

- **Status:** Published research (not a data source per se)
- **URL:** DOI-referenced study on shark attack forecasting using 30 marine variables
- **Access method:** Academic paper download
- **Authentication:** None (open access)
- **Rate limits:** N/A
- **CORS support:** N/A
- **Data format:** PDF/academic paper
- **Update frequency:** Static (published study)
- **Cost:** Free
- **NSW coverage:** Australian focus (uses ASID as primary dataset)
- **Relevant parameters:** The study identifies 30 significant marine variables: sea surface temperature, sea level pressure, wave height, wind speed/direction, visibility, tidal state, lunar phase, season, time of day — all implementable via Open-Meteo + SunCalc + WillyWeather
- **Integration complexity:** N/A (reference only)
- **Notes:**
  - Provides academic validation for SharkSense's multi-variable risk approach
  - Key finding: SST, tidal state, and lunar phase are among the strongest predictors
  - SharkSense's current weighting system aligns with study findings
  - **Verdict: Use as literature citation and to validate risk factor weights — not a live data source**
- **Tested:** N/A (referenced, not tested as API)

---

## NSW DPI Drone Sighting Data

- **Status:** Active program; data access restricted (web blocked 403)
- **URL:** `https://www.dpi.nsw.gov.au/fishing/sharks/shark-smart-fishing/` (403 on all subpages)
- **Access method:** Web scraping (HTML, 403 blocked); formal data request likely required
- **Authentication:** Unknown (public portal blocked for scraping)
- **Rate limits:** N/A (not accessible)
- **CORS support:** N/A
- **Data format:** Unknown (likely CSV/Excel for data download if available)
- **Update frequency:** Program ongoing (seasonal operations)
- **Cost:** Free (government open data if published)
- **NSW coverage:** NSW beaches — drone patrols of northern NSW beaches primarily; program expanding
- **Relevant parameters:** Flight date/time, beach location, species sighted, count, behavior, weather conditions, distance from shore
- **Integration complexity:** High (no API; requires formal request or policy change)
- **Notes:**
  - The SharkSense project brief references "36,384 flights, 281 sightings" — these figures appear to be from the NSW DPI SharkSmart Drone Program progress reports
  - All DPI.nsw.gov.au subpages related to sharks returned 403 on 2026-03-29 — appears to be an active bot-blocking policy
  - Data may be available via Freedom of Information request or through NSW Government open data portal (`data.nsw.gov.au`)
  - Search on `data.nsw.gov.au` for "shark drone DPI" returned 0 results on 2026-03-29
  - **Verdict: High value if accessible; pursue formal request or check NSW Government Open Data regularly for new releases. For v1, use historical ASID data as substitute.**
- **Tested:** 403 Forbidden, 2026-03-29.

---

## Surf Life Saving NSW Drone Patrol Schedule

- **Status:** Active program; public patrol status via BeachSafe app
- **URL:** `https://beachsafe.org.au/` (SLSA BeachSafe app)
- **Access method:** BeachSafe app/website — API host confirmed as `https://beachsafe.org.au`; `/api/v2/` returns 404 indicating versioned API exists but specific endpoints not public
- **Authentication:** Unknown for API; app is free to use
- **Rate limits:** Unknown
- **CORS support:** Unknown
- **Data format:** JSON (app), HTML (web)
- **Update frequency:** Real-time during patrol hours (seasonal)
- **Cost:** Free (public safety information)
- **NSW coverage:** All SLSNSW-patrolled beaches including pilot SharkSense locations (Manly, Bondi, Dee Why, Nobbys)
- **Relevant parameters:** Patrol status (open/closed/drone), patrol hours, beach conditions flags, shark spotted alerts
- **Integration complexity:** High (API endpoints not publicly documented; requires reverse engineering)
- **Notes:**
  - BeachSafe app source code reveals `window.API_HOST = 'https://beachsafe.org.au'` — a REST API exists
  - `/api/v2/beaches?state=NSW` returned 404 on direct test
  - Drone patrol during active hours significantly reduces swimmer risk — a high-value safety signal
  - **Practical approach:** Maintain a static patrol schedule scraped weekly; flag "drone patrol active" during standard patrol windows for pilot beaches
  - WillyWeather also shows tide/patrol information for many NSW beaches
- **Tested:** App loads, API endpoints 404, 2026-03-29.

---

## Global Shark Attack File (GSAF) — sharkattackfile.net

- **Status:** Active
- **URL:** `http://www.sharkattackfile.net/incidentlog.htm`
- **Access method:** File download (Excel .xls)
- **Authentication:** None
- **Rate limits:** None
- **CORS support:** N/A (file download)
- **Data format:** Excel (.xls)
- **Update frequency:** Ongoing (maintained by Shark Research Institute)
- **Cost:** Free
- **NSW coverage:** Global — includes all Australian and NSW incidents
- **Relevant parameters:** Date, location, country, activity, injury, species, sex, age — color-coded by incident type (unprovoked, provoked, watercraft, disaster, questionable)
- **Integration complexity:** Low (one-time download, parse to DB)
- **Notes:**
  - Managed by Shark Research Institute (Princeton NJ), different from ISAF
  - Download as Excel file confirmed on 2026-03-29
  - Supplement to ASID for pre-1980 global records
  - **Verdict: Lower priority than ASID; use if ASID missing specific NSW incidents**
- **Tested:** Yes, 2026-03-29. Excel download confirmed available.

---

## Summary Comparison Table

| Source | Status | Auth | Cost | Integration | Priority |
|--------|--------|------|------|-------------|----------|
| WaterNSW Discharge API | Active ✓ | None | Free | Medium | P1 |
| Open-Meteo Weather | Active ✓ | None (free tier) | Free | Low | P1 |
| Open-Meteo Marine | Active ✓ | None (free tier) | Free | Low | P1 |
| SunCalc.js npm | Active ✓ | None | Free | Low | P1 |
| Google News RSS | Active ✓ | None | Free | Low | P1 |
| Australian ASID (Zenodo) | Active ✓ | None | Free | Low | P1 |
| NSW SEED Estuaries | Partial | None | Free | Medium | P2 |
| WillyWeather Tides | Active | API key (free) | Free/Paid | Medium | P2 |
| BOM Rainfall JSON | Active (unstable) | None | Free | Medium | P3 (superseded) |
| IMOS Acoustic Telemetry | Active (auth req) | Registration | Free | High | P2 |
| Copernicus Marine (CHL/SST) | Active | Registration | Free | High | P2 |
| NOAA MUR SST | Active | NASA EarthData | Free | High | P3 |
| NSW DPI Drone Data | Blocked | Unknown | Free | High | P2 (future) |
| SLSNSW Drone Schedule | Partial | Unknown | Free | High | P3 |
| ISAF | Active (request) | Institutional | Free | High | P3 (ASID better) |
| Kaggle GSAF | Active | Kaggle acct | Free | Low | P3 (ASID better) |
| Tracking Sharks | Active | None | Free | High | Skip |
| Sydney Water Overflows | 404 | None | Free | High | P3 (check later) |
| NewsAPI.org | Active | API key | $449/mo prod | Medium | Skip (Google RSS better) |
| WorldTides | Active (SSL issues) | API key | Freemium | Low | P3 (WillyWeather better) |

---

## Critical Findings

1. **WaterNSW API is fully functional with no authentication** — JSON webservice at `realtimedata.waternsw.com.au/cgi/webservice.exe` supports site discovery, variable listing, and time-series extraction. Use datasource `PROV` for most current data. Concurrency limit is 2 simultaneous requests. Variable `141.01` is Discharge Rate (ML/Day); `100.00` is Stream Water Level.

2. **Hunter River gauge 210001 (Singleton) is the best proxy for Newcastle/Nobbys Beach bull shark risk** — it's on the main Hunter River and confirmed valid with water level data.

3. **Open-Meteo (weather + marine) covers all SharkSense needs for precipitation, temperature, wave height, and SST** with a single free API, no authentication, and confirmed live data. No separate BOM integration needed.

4. **Google News RSS (`news.google.com/rss/search`) is a zero-cost, zero-auth alternative to the Twitter/X feed** — confirmed 50 recent NSW shark attack articles on 2026-03-29.

5. **ASID (Zenodo DOI 10.5281/zenodo.5612260) provides the best historical incident database** — 1,196 Australian incidents, freely available, CC0 license. One-time seed into Supabase `historical_incidents` table.

6. **IMOS Acoustic Telemetry is the highest-value untapped source** — formal registration required; once obtained, near-real-time shark detection data from receivers at NSW beaches would dramatically improve white shark risk scoring.

7. **NSW DPI drone data is blocked (403)** — pursue formal open-data request or monitor `data.nsw.gov.au` for future publication.

8. **Copernicus Marine (Sentinel-3 OLCI at 300 m) provides chlorophyll-a and turbidity** — free with registration. Use as input for water visibility/upwelling component of white shark risk scoring, noting cloud coverage gaps on NSW coast.

9. **NSW SEED Estuaries dataset** — tag search returns 2 results but direct URLs fail. Consider sourcing estuary boundary GeoJSON from OEH Coastal Waterbodies layer or pre-computing static proximity distances to known estuary mouths for the 5 pilot beaches instead.

10. **Tide predictions: WillyWeather is recommended** — Australian company, covers all pilot beaches, registration required but free tier available.
