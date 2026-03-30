# White Shark Environmental Risk Factors

**SharkSense Research Document 02**
**Date:** 2026-03-29
**Scope:** NSW coast, *Carcharodon carcharias* (white shark / great white shark)

---

## Introduction

White sharks (*Carcharodon carcharias*) are the principal species responsible for fatal unprovoked shark bites on NSW beaches. In 2025, three of Australia's five unprovoked fatalities were white sharks attacking surfers, contributing to Australia recording the most fatal shark attacks globally that year (ISAF 2025 Annual Report). Unlike bull sharks, whose risk is primarily rainfall- and estuary-driven, white shark risk is governed by oceanographic and ecological factors: cold-water upwelling, seal colony proximity, seasonal migration timing, sea surface temperature (SST) preferences, and beach-specific historical incident patterns. This document catalogues each factor with measurable proxies suitable for integration into the SharkSense risk algorithm.

---

## Factor 1: Upwelling Events and SST Anomalies

- **Risk mechanism:** Coastal upwelling draws cold, nutrient-rich deep water to the surface, triggering phytoplankton and zooplankton blooms. This bloom sustains baitfish aggregations (sardines, anchovies, eastern Australian salmon *Arripis trutta*), which in turn attract white sharks inshore as a foraging response. Separately, the cooler inshore SST produced by upwelling falls within the white shark's preferred thermal window (14–19°C), making these conditions doubly attractive. The 2015 Ballina attack cluster — 11 incidents in 24 months on the Far North Coast — directly coincided with documented cold-water upwelling events. Researchers attribute the clustering to the East Australian Current (EAC) forcing white sharks into nearshore upwelling zones along the shelf-narrowing bioregion between 28.5°S and 31°S.
- **Species specificity:** White shark primary; applies broadly to all large predatory sharks but upwelling-foraging linkage is strongest for white sharks in eastern Australia.
- **Measurable proxy:** Negative SST anomaly (inshore vs. climatological baseline or inshore vs. offshore differential). A temperature drop of ≥2–3°C relative to the 7-day rolling average at a given beach site, or an inshore reading below 18°C coinciding with an inshore-offshore differential, indicates an active upwelling event. Chlorophyll-a concentration from satellite (Sentinel-3 / NASA MODIS) is a secondary proxy confirming the bloom stage of the cascade.
- **Data source:** NOAA CoralTemp or Copernicus Marine SST (CMEMS) satellite products at 0.05° resolution; Open-Meteo Marine API (sst variable); NASA Earthdata MODIS Aqua chlorophyll-a. Bitemetrix (bitemetrix.com) — Ronnie Vickery's NSW-focused platform — aggregates satellite SST and upwelling detection to produce daily Low/Moderate/Medium/High risk ratings specifically for NSW beach zones.
- **Threshold values:**
  - SST anomaly ≤ −2°C relative to 14-day rolling mean at the same location → AMBER
  - SST anomaly ≤ −3°C or inshore temp drops below 17°C → RED
  - Chlorophyll-a > 1.5 mg/m³ inshore → amplifying signal (upwelling bloom confirmed)
- **Lag time:** Plankton bloom response to upwelling: 3–7 days. Baitfish concentration: 5–14 days post-bloom initiation. White shark foraging response: 1–3 days after baitfish concentration establishes. Total lag from upwelling trigger to peak shark risk: approximately 7–14 days; however, the shark may arrive concurrently with cooler water, so immediate SST drop should be treated as an amber trigger, not just a lagged one.
- **Confidence level:** High — direct observational correlation in the literature (Macquarie University 2019 MEPS model, Swellnet 2015 cluster analysis, MEPS 2021 oceanographic habitat study all confirm the SST-anomaly/attack relationship).
- **Weight recommendation:** 0.30 (per existing SharkSense algorithm specification; supported by evidence).
- **Sources:**
  - Macquarie University / Lighthouse (2019): "World-first findings pinpoint where and when sharks are more likely to attack." https://lighthouse.mq.edu.au/article/november-2019/World-first-findings-pinpoint-where-and-when-sharks-are-more-likely-to-attack — accessed 2026-03-29
  - Swellnet (2015): "North Coast shark activity: A new theory." https://www.swellnet.com/news/surfpolitik/2015/08/11/north-coast-shark-activity-new-theory — accessed 2026-03-29
  - MEPS 2021 — Oceanographic conditions associated with white shark habitat use along eastern Australia: https://www.int-res.com/abstracts/meps/v659/meps13572 — accessed 2026-03-29
  - MEPS 2019 — Environmental predictive models for shark attacks in Australian waters: https://www.int-res.com/abstracts/meps/v631/p165-179 — accessed 2026-03-29
  - Bitemetrix / Swellnet profile of Ronnie Vickery (Aug 2024): https://www.swellnet.com/news/talking-heads/2024/08/15/ronnie-vickery-in-the-hot-seat — accessed 2026-03-29
  - Stabmag Bitemetrix explainer: https://stabmag.com/news/something-new-on-the-menu-re-shark-information/ — accessed 2026-03-29
  - UNSW MEPS Vol. 622 (2019) white shark habitat SST: https://www.unsw.edu.au/content/dam/pdfs/science/bees/research-reports/2024-05-oceanography/m622p121.pdf — accessed 2026-03-29
  - Carbon Brief (2024): "Climate change 'bait and switch' threatens sharks and rays." https://www.carbonbrief.org/climate-change-bait-and-switch-threatens-sharks-and-rays/ — accessed 2026-03-29

---

## Factor 2: Seal Colony Proximity

- **Risk mechanism:** Australian fur seals (*Arctocephalus pusillus doriferus*) and New Zealand fur seals (*Arctocephalus forsteri*) are primary prey items for adult white sharks. Seal colonies act as predictable, high-caloric prey aggregations that anchor white shark residence in coastal zones near the haul-out site. When seals are present in large numbers, sharks actively patrol approach corridors between the colony and open-water feeding areas. Montague Island (Barunguba) is the largest Australian fur seal colony in NSW, located approximately 9 km offshore from Narooma (36.25°S). Colony numbers fluctuate dramatically: baseline year-round population is approximately 25 animals, rising to 700+ during the breeding season (winter months). Numbers at the northern haul-out specifically peak in September–October as seals migrate back from Bass Strait breeding grounds. This peak coincides with the prime NSW white shark migration window (May–November), making the spring period especially high-risk near Montague Island and adjacent south coast beaches.
- **Species specificity:** White shark primary (adult predation); bull sharks also prey opportunistically on smaller seals but this is not a primary driver for bull shark presence.
- **Measurable proxy:** Seasonal calendar (September–October peak at Montague Island); proximity of beach to known seal haul-out sites (distance in km from GBRMPA/Parks NSW records). No real-time sensor exists for seal abundance at Montague Island; distance from colony remains the operative proxy.
- **Data source:** NSW National Parks seal haul-out location data: https://www.nationalparks.nsw.gov.au/plants-and-animals/australian-fur-seal; Australian Museum species record: https://australian.museum/learn/animals/mammals/australian-fur-seal/; SPRAT species profile (Australian Government): https://environment.gov.au/cgi-bin/sprat/public/publicspecies.pl?taxon_id=21
- **Threshold values:**
  - Beach within 50 km of Montague Island AND month is September–November → AMBER modifier (multiplier ×1.2 on white shark base score)
  - Beach within 20 km of any active seal colony → always-on AMBER flag
  - Note: Pilot beaches Manly, Dee Why, Bondi, and Newcastle/Nobbys are all >150 km from Montague Island; Nielsen Park is ~170 km. South coast expansion would elevate this factor significantly.
- **Lag time:** Essentially zero lag — seal presence is the direct risk trigger, not an upstream environmental variable. Risk tracks the seasonal calendar.
- **Confidence level:** High — well-established predator–prey relationship; Montague Island seasonality confirmed by multiple sources.
- **Weight recommendation:** 0.15 for pilot beaches (low proximity penalty); re-weight to 0.25 for future south coast beaches (Narooma, Jervis Bay).
- **Sources:**
  - NSW National Parks: Australian fur seal. https://www.nationalparks.nsw.gov.au/plants-and-animals/australian-fur-seal — accessed 2026-03-29
  - Sapphire Coast Travel Guide: Fur Seals at Montague Island. https://sapphire-coast.com.au/montague-island/seals-montague-island/ — accessed 2026-03-29
  - Australian Museum: Australian Fur Seal. https://australian.museum/learn/animals/mammals/australian-fur-seal/ — accessed 2026-03-29
  - ResearchGate: The hunting strategy of white shark near a seal colony. https://www.researchgate.net/publication/227288082_The_hunting_strategy_of_white_shark_Carcharodon_carcharias_near_a_seal_colony — accessed 2026-03-29
  - SPRAT: Arctocephalus pusillus species profile. https://environment.gov.au/cgi-bin/sprat/public/publicspecies.pl?taxon_id=21 — accessed 2026-03-29

---

## Factor 3: Migration Corridors and Seasonal Patterns

- **Risk mechanism:** White sharks exhibit clear seasonal coastal migration along eastern Australia. Historical catch records (1950–1993) show NSW catch rates are highest May–November, peaking September–November. Satellite and acoustic tracking by CSIRO and the NSW DPI (300+ juvenile sharks tagged, of which 50 with acoustic tags and 32 with satellite tags) confirms a northward coastal movement in autumn–winter and a southward return in late spring–summer. From September, tracked sharks increase time in southern Queensland and northern NSW (~27.5°S), then gradually move south to 37.5°–42.5°S by March. This means Sydney-area beaches (33–34°S) are in the migration corridor during roughly May–December each year, with peak occurrence September–November. Sharks are available for tagging in NSW from May through December. Two nursery aggregation sites for juvenile white sharks are confirmed in eastern Australia: Port Stephens (Hunter Coast, NSW) — the most accessible, covering a 50–60 km stretch where juveniles aggregate from early spring to mid-summer in water 1–120 m depth, often within 5 m depth in the surf zone — and 90 Mile Beach-Corner Inlet (eastern Victoria).
- **Species specificity:** White shark only. Bull shark distribution is not driven by this oceanic migration pattern.
- **Measurable proxy:** Day-of-year (DOY) as a direct migration season indicator; IMOS acoustic receiver detections within 48 hours at nearby arrays (Coffs Harbour, Sydney, Narooma cross-shelf lines); SharkSmart @NSWSharkSmart Twitter tagged-shark alerts; CSIRO/NSW DPI public detection data.
- **Data source:**
  - CSIRO white shark research: https://www.csiro.au/en/research/animals/marine-life/sharks/white-shark-research-findings
  - SharkSmart NSW DPI distribution page: https://www.sharksmart.com.au/research/white-shark-distribution-population/
  - IMOS Animal Tracking Facility: https://imos.org.au/facility/animal-tracking/acoustic-telemetry
  - Scientific Reports (2020) — Spatiotemporal distribution patterns: https://www.nature.com/articles/s41598-020-66876-z
- **Threshold values:**
  - DOY 121–334 (May 1 – Nov 30) → seasonal risk ON; base score elevated
  - DOY 244–334 (Sept 1 – Nov 30) → peak season, maximum multiplier
  - IMOS detection of tagged white shark within 50 km in past 24 hours → immediate AMBER/RED flag (detection-based factor, see Factor 5)
- **Lag time:** None — this is a calendar-based background risk modifier, not a triggered signal.
- **Confidence level:** High — confirmed by 70 years of catch data and modern satellite tracking.
- **Weight recommendation:** 0.15 (as "season" weight in existing algorithm).
- **Sources:**
  - CSIRO White Shark Research Findings: https://www.csiro.au/en/research/animals/marine-life/sharks/white-shark-research-findings — accessed 2026-03-29
  - Scientific Reports (2020) — Spatiotemporal distribution patterns of immature Australasian white sharks: https://www.nature.com/articles/s41598-020-66876-z — accessed 2026-03-29
  - PMC version of above: https://pmc.ncbi.nlm.nih.gov/articles/PMC7311443/ — accessed 2026-03-29
  - SharkSmart NSW Government — White Shark Distribution: https://www.sharksmart.com.au/research/white-shark-distribution-population/ — accessed 2026-03-29
  - Great white shark nursery off Hunter coast (The Leader): https://www.theleader.com.au/story/2027804/great-white-shark-nursery-off-hunter-coast/ — accessed 2026-03-29
  - ISAF 2025 Annual Summary — Australia fatalities: https://www.floridamuseum.ufl.edu/shark-attacks/yearly-worldwide-summary/ — accessed 2026-03-29

---

## Factor 4: Sea Surface Temperature Preference Range

- **Risk mechanism:** White sharks are endothermic (regionally warm-blooded via countercurrent heat exchangers), allowing them to tolerate a wide SST range (10–27°C), but activity, feeding efficiency, and coastal residency are maximised in the 14–22°C window. MEPS 2021 tracking of 77 eastern Australian white sharks found the greatest number of daily tag positions when SST was 14–18°C. Area-restricted movement (foraging behaviour) was most frequent at 19–23°C. Sharks mainly stayed within 50 m of the surface in 14–19°C water. The East Australian Current (EAC) runs warm (>22°C in summer) along the continental slope; when the EAC is strong and pushes against the coast, it restricts white shark access to NSW beaches. When the EAC weakens or cold-core eddies develop inshore, the thermally suitable 14–19°C band expands shoreward, drawing sharks into the surf zone. Climate projections (ICES Journal of Marine Science, May 2025) using satellite tag data from 41 white sharks (2015–2020) predict a poleward shift in suitable thermal habitat in austral winter/spring, and equatorward contraction in summer/autumn. By 2080, equatorial bioregions will become year-round unsuitable; poleward regions (including southern NSW and Victoria) will increase in suitability by 27–38% in autumn, winter, and spring. SE Australian waters are warming at 3–4× the global average rate, accelerating this redistribution.
- **Species specificity:** White shark primary; the 14–22°C thermal window is well-established for this species. Bull sharks prefer warmer water (>22°C) and are not attracted by the same SST conditions.
- **Measurable proxy:** Absolute SST at the beach site from satellite or Open-Meteo Marine API. A reading of 14–22°C places the beach within the white shark optimal thermal window. Outside this range (SST > 24°C or SST < 12°C) white shark activity is attenuated.
- **Data source:** Open-Meteo Marine API (`sea_surface_temperature`); NOAA CoralTemp (daily 5 km resolution); Copernicus CMEMS SST product.
- **Threshold values:**
  - SST 14–18°C → peak white shark foraging probability; highest risk window
  - SST 18–22°C → area-restricted movement common; moderate-to-high risk
  - SST 22–24°C → reduced but not absent risk; AMBER maintained during migration season
  - SST > 24°C → white shark risk substantially reduced (EAC dominance); GREEN unless recent detection
  - SST < 12°C → below optimal range; low white shark activity; GREEN
- **Lag time:** Instantaneous — SST is a real-time environmental condition. Risk is concurrent with the temperature window, not lagged.
- **Confidence level:** High — multiple independent tagging studies and modelling papers converge on the 14–22°C range.
- **Weight recommendation:** 0.20 (as "temp" weight in existing algorithm).
- **Sources:**
  - MEPS 2021 — Oceanographic conditions associated with white shark habitat use along eastern Australia: https://www.int-res.com/abstracts/meps/v659/meps13572 — accessed 2026-03-29
  - ICES Journal of Marine Science (May 2025) — Seasonal changes in habitat suitability driven by ocean warming: https://academic.oup.com/icesjms/article/82/5/fsaf062/8140451 — accessed 2026-03-29
  - PMC — Preliminary Data: Habitat Use of Subadult and Adult White Sharks in Eastern Australian Waters: https://pmc.ncbi.nlm.nih.gov/articles/PMC9598950/ — accessed 2026-03-29
  - Scientific Reports (2020) — Spatiotemporal distribution patterns: https://www.nature.com/articles/s41598-020-66876-z — accessed 2026-03-29
  - CSIRO — Where do white sharks go in Australian waters: https://www.csiro.au/en/research/animals/marine-life/sharks/where-do-white-sharks-go-in-australian-waters — accessed 2026-03-29
  - Frontiers in Marine Science (2020) — Future distribution of suitable habitat for pelagic sharks under climate change: https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.00570/full — accessed 2026-03-29
  - AdaptNSW — Climate change impacts on our oceans: https://www.climatechange.environment.nsw.gov.au/impacts-climate-change/natural-environment/oceans — accessed 2026-03-29

---

## Factor 5: Acoustic Detection and Recent Sighting History

- **Risk mechanism:** A tagged shark detected by the IMOS/SharkSmart acoustic receiver network within the past 24–48 hours provides direct, real-time evidence of white shark presence in the coastal zone. The NSW Shark Monitoring Network (SMN) operates 37 listening stations (VR4G acoustic receivers) along the NSW coast. Each receiver detects tagged animals within a ~500 m radius. When a tagged shark swims past a station, an alert is transmitted via satellite and published within ~1 hour to @NSWSharkSmart Twitter and the SharkSmart app. Acoustic receivers are positioned at key cross-shelf lines at Coffs Harbour, Sydney, and Narooma (IMOS arrays). Over 300 juvenile white sharks have been tagged in the NSW program; any detection substantially elevates the local risk for 24–48 hours as sharks are not stationary and may continue along the coast. Untagged sharks constitute the majority of the population; detections therefore represent a minimum-presence floor, not the full population signal.
- **Species specificity:** White shark and other tagged species (tiger sharks, bull sharks). Tag data can be species-filtered.
- **Measurable proxy:** @NSWSharkSmart Twitter feed (scrape for acoustic detections); SharkSmart app API; IMOS Animal Tracking Facility public data portal.
- **Data source:**
  - SharkSmart NSW DPI: https://www.sharksmart.nsw.gov.au/shark-activity
  - SharkSmart Shark Monitoring Network: https://www.sharksmart.com.au/research/shark-monitoring-network
  - IMOS Animal Tracking: https://imos.org.au/facility/animal-tracking/acoustic-telemetry
  - @NSWSharkSmart Twitter (scrape via Nitter, as per SharkSense scraper `scrape-twitter.md`)
- **Threshold values:**
  - Tagged white shark detected within 10 km of beach in past 6 hours → RED
  - Tagged white shark detected within 50 km in past 24 hours → AMBER
  - Tagged white shark detected within 100 km in past 48 hours → low modifier (+0.05 to score)
  - No detection in 72 hours → detection factor returns to baseline (0)
- **Lag time:** Near-zero — acoustic detections are transmitted within ~1 hour of the shark passing the receiver. The lag between detection and public alert is typically under 60 minutes.
- **Confidence level:** High for presence confirmation; Medium for absence inference (most sharks are untagged).
- **Weight recommendation:** 0.20 (as "detection" weight in existing algorithm).
- **Sources:**
  - SharkSmart — Shark Monitoring Network: https://www.sharksmart.com.au/research/shark-monitoring-network — accessed 2026-03-29
  - IMOS — Shark Smart article: https://imos.org.au/news/newsitem/shark-smart/ — accessed 2026-03-29
  - SharkSmart Technology, Trials and Research: https://www.sharksmart.nsw.gov.au/technology-trials-and-research — accessed 2026-03-29
  - Scientific Reports (2020): https://www.nature.com/articles/s41598-020-66876-z — accessed 2026-03-29

---

## Factor 6: Historical Incident Density (Beach-Specific)

- **Risk mechanism:** Certain NSW beaches have structurally elevated white shark risk due to persistent geographic features: proximity to nursery zones, upwelling topography, shelf narrowing, or river mouth influence. Historical incident clustering at specific sites suggests that environmental conditions favouring human–white shark interaction recur at those locations. The ASID contains 1,196 documented shark bites in Australia (1791–2022). Of these, white shark bites are most heavily concentrated in NSW. The Far North Coast bioregion (Tweed to Byron/Ballina, ~28.5°–28.8°S) accounts for approximately 16% (nearly 1 in 6) of all Australian shark attacks, with 11 incidents in the 2014–2016 cluster alone (6 fatal white shark attacks on this coast since 2015). This corridor coincides with a section of coast where the continental shelf narrows, the EAC is most active, and cold-water upwelling is most frequent. At the Port Stephens nursery zone (~32.7°S), juvenile white sharks have been confirmed spending significant time in 1–5 m surf zone depths. Historical hotspot data functions as a structural baseline risk multiplier — beaches with high historical incident density should have their risk floors raised regardless of current environmental conditions.
- **Species specificity:** White shark — historical hotspots derived from species-filtered ASID data.
- **Measurable proxy:** Historical incident count per beach (ASID database query: state = NSW, species = white shark, coordinates matched to SharkSense beach list). Normalised per person-hours of ocean use for true exposure-adjusted rate (complex; use raw incident count as first approximation).
- **Data source:**
  - Taronga ASID: https://taronga.org.au/conservation-and-science/australian-shark-incident-database
  - ASID Zenodo dataset (downloadable CSV): https://zenodo.org/records/11334212
  - GitHub ASID (Corey Bradshaw, Flinders University): https://github.com/cjabradshaw/AustralianSharkIncidentDatabase
  - Scientific Data (2022) — The Australian Shark-Incident Database: https://www.nature.com/articles/s41597-022-01453-9
  - SharkAttackData.com NSW table: https://www.sharkattackdata.com/place/australia/new_south_wales
- **Threshold values:** (Relative to 5 pilot beaches — requires ASID query for calibration)
  - 0 confirmed white shark incidents at beach → baseline factor (0.0)
  - 1–2 incidents → low historical risk (+0.05 modifier)
  - 3–5 incidents → moderate historical risk (+0.10 modifier)
  - 6+ incidents → high historical risk (+0.15 modifier)
  - Note: Ballina / Byron Bay corridor is expected to score ≥6; Newcastle/Nobbys is moderate; Manly, Dee Why, Bondi are expected to be low-to-moderate.
- **Lag time:** None — this is a static baseline modifier updated annually when the ASID is refreshed (weekly scraper schedule appropriate).
- **Confidence level:** Medium — historical density is a valid structural predictor but does not capture year-to-year variation. Exposure bias (more popular beaches appear higher risk due to more ocean users) is uncontrolled.
- **Weight recommendation:** 0.15 (as "historical" weight in existing algorithm).
- **Sources:**
  - Taronga Conservation Society Australia — ASID: https://taronga.org.au/conservation-and-science/australian-shark-incident-database — accessed 2026-03-29
  - ASID Zenodo dataset: https://zenodo.org/records/11334212 — accessed 2026-03-29
  - Scientific Data (2022): https://www.nature.com/articles/s41597-022-01453-9 — accessed 2026-03-29
  - PMC version: https://pmc.ncbi.nlm.nih.gov/articles/PMC9259633/ — accessed 2026-03-29
  - ISAF 2025 Australia data: https://www.floridamuseum.ufl.edu/shark-attacks/yearly-worldwide-summary/ — accessed 2026-03-29
  - ibtimes.com.au — Australia records most fatal shark attacks in 2025: https://www.ibtimes.com.au/australia-records-most-fatal-shark-attacks-2025-says-new-global-report-1861727 — accessed 2026-03-29

---

## Algorithm Integration Summary

| Factor | Algorithm Weight | Confidence | Real-time? |
|--------|-----------------|------------|------------|
| Upwelling / SST Anomaly | 0.30 | High | Yes (hourly SST via Open-Meteo) |
| Acoustic Detection / Sighting | 0.20 | High (present) / Medium (absent) | Yes (<1 hr lag via @NSWSharkSmart) |
| Sea Surface Temperature (absolute) | 0.20 | High | Yes (hourly) |
| Season / Migration Calendar | 0.15 | High | Static calendar |
| Historical Incident Density | 0.15 | Medium | Static (weekly refresh) |
| Seal Colony Proximity | 0.15* | High | Seasonal calendar |

*Seal colony factor is incorporated as a seasonal and geographic multiplier rather than a standalone weighted score for the 5 pilot beaches, given their distance from Montague Island. For any future south coast beach expansion (Narooma, Ulladulla, Jervis Bay), seal proximity should be elevated to 0.25 and combined with upwelling weighting.

**Total: 1.00** when upwelling (0.30) + detection (0.20) + temperature (0.20) + season (0.15) + historical (0.15) = 1.00. Seal colony operates as a conditional multiplier for geographic proximity.

---

## Key Data Access Points

| Dataset | URL | Scraper Module |
|---------|-----|---------------|
| IMOS Animal Tracking detections | https://imos.org.au/facility/animal-tracking/acoustic-telemetry | `scrape-imos.md` |
| @NSWSharkSmart Twitter / Nitter | https://www.sharksmart.nsw.gov.au/shark-activity | `scrape-twitter.md` |
| Open-Meteo Marine (SST) | https://marine-api.open-meteo.com | `scrape-openmeteo.md` |
| Taronga ASID (Excel download) | https://zenodo.org/records/11334212 | `scrape-asid.md` |
| Copernicus CMEMS SST | https://marine.copernicus.eu/ | New scraper recommended |
| NASA MODIS Chlorophyll-a | https://oceancolor.gsfc.nasa.gov/ | New scraper recommended (upwelling confirmation) |

---

## Gaps and Recommended Additional Research

1. **Chlorophyll-a API integration:** No current SharkSense scraper monitors chlorophyll-a as an upwelling-bloom proxy. Adding a CMEMS or MODIS chlorophyll-a feed would improve upwelling event detection accuracy.
2. **Specific SST differential threshold (Bitemetrix):** The exact inshore-vs-offshore temperature differential used by Ronnie Vickery (reportedly ≥3°C) could not be confirmed from public sources. Direct contact with Bitemetrix recommended for methodology details.
3. **South coast expansion:** All pilot beaches are in greater Sydney or the Hunter region. Future expansion to Narooma, Bermagui, or Jervis Bay would activate the seal colony proximity factor as a major risk driver.
4. **EAC eddy tracking:** Cold-core eddies downstream of the EAC separation point (~34°S) create localised upwelling zones along the Sydney coast. Real-time eddy tracking (e.g., CSIRO Bluelink ocean model) would improve prediction of white shark foraging habitat appearance near Bondi and Manly.
