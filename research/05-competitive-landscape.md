# SharkSense Competitive Landscape

**Research date:** 2026-03-29
**Scope:** Competing apps, adjacent tools, academic predecessors, and government platforms in the shark risk / ocean safety space.

---

## 5.1 SharkSmart (NSW Government)

**URL:** https://www.sharksmart.nsw.gov.au
**App:** iOS — https://apps.apple.com/au/app/sharksmart/id915621811 | Android — https://play.google.com/store/apps/details?id=mobiddiction.com.sharksmart.nsw
**Last verified:** 2026-03-29

### What it does
SharkSmart is the NSW Government's official shark management platform. It delivers real-time push alerts when tagged sharks are detected by listening stations, posts drone sightings from Surf Life Saving NSW, and provides access to SMART drumline catch-and-release data. A companion watch app (Apple Watch, Wear OS via Android SDK 26+) delivers beach-specific alerts independently of the phone on cellular-capable watches.

### The $6.7M December 2025 / January 2026 Enhancement
In December 2025 a $2.5M announcement extended SLSNSW summer drone operations and boosted the Surfing NSW boardrider-club drone fleet and training. A further funding tranche brought the total enhancement to $6.7M. Key deliverables:

- **30 additional drone patrol locations** added from 24 January 2026 — 19 new Sydney beaches and 11 regional sites — operating seven days a week through 27 April 2026.
- **50 total SLSNSW drones** covering beaches from Tweed to Bega. As of the latest reporting, 29,431 flights over 8,044 flying hours have been completed in 2025/26, with 461 sharks sighted and 170 countermeasures enacted.
- **Every NSW coastal LGA** now has at least one drone patrol location during the summer program.
- **Targeted bull shark tagging and monitoring** introduced in Sydney Harbour and other estuaries — the first time the program has specifically instrumented bull sharks in urban waterways. Data from this tagging will directly inform the 2026/27 strategy.
- **37 tagged shark listening stations** across all coastal LGAs; any White, Tiger, or Bull shark tagged and swimming within 500m triggers an automatic public alert via the SharkSmart app and @NSWSharkSmart on X.
- **Community Shark Bite Kits** (tourniquets, compression bandages, thermal blankets) placed at unpatrolled beaches statewide.
- **SharkSmart app usability improvements** announced as part of the December 2025 package; no environmental sensor integration (rainfall, discharge, SST) was disclosed publicly.

### Shark Net Phase-Out
The 2025/26 net deployment season (September 2025 – March 2026) still included 51 beaches across eight LGAs. Three councils were invited into a trial net-removal program; the NSW Premier subsequently cancelled the trial before it began. Randwick Council voted against nets at Maroubra and Coogee (no target species caught since 2020). The trajectory is incremental replacement with drones rather than an abrupt phase-out. Nets remain deployed for 2025/26.

### SharkSmart Watch App
- **Apple Watch:** companion to iPhone (works on non-cellular as companion; independently on cellular watches). Requires watchOS 7+.
- **Android Wear OS:** companion app, Android SDK 26+.
- Features: alerts filtered by "Around Me" radius, My Beaches, By Time, By Region.

### Environmental Data Features
The app exposes tagged shark detections and drone sightings only. No environmental predictor variables (rainfall, river discharge, SST, turbidity, upwelling indices) are surfaced to users. The 2022/23 Annual Performance Report references a future database intended to incorporate "all activities and environmental conditions in temporal and spatial fields" but this has not shipped as a user-facing feature as of 2026-03-29.

### API / Open Data
No public developer API or open data feed has been announced. The back-end is operated by Mobiddiction via a centralised SharkSmart PRO field mobility platform; field officers log data through SharkSmart PRO which syncs to the central system. No evidence of machine-readable endpoints being made available to third parties.

| Dimension | Detail |
|-----------|--------|
| **Type** | Government reactive alert platform |
| **Strengths** | Authoritative data, real-time push alerts, 37 listening stations, broad drone coverage, watch app, large user awareness |
| **Weaknesses** | No predictive risk score, no environmental signal fusion, no bull/white shark branch logic, no API, no historical context surfaced |
| **Gap SharkSense fills** | Predictive risk score derived from rainfall, discharge, upwelling, and historical data — actionable 24-48h ahead of conditions, not just after a shark is detected |
| **User base** | Government platform — no subscriber count published |
| **Last updated** | January 2026 (drone expansion announcement) |

**Sources:**
- [SharkSmart Current Program](https://www.sharksmart.nsw.gov.au/current-program) (accessed 2026-03-29)
- [NSW Government $4.2M expansion release](https://www.nsw.gov.au/ministerial-releases/42-million-expansion-to-improve-shark-safety-summer) (accessed 2026-03-29)
- [NSW Government $2.5M boost release](https://www.nsw.gov.au/ministerial-releases/minns-government-announces-25-million-boost-to-summer-beach-safety-immediate-extra-shark-surveillance-drones) (accessed 2026-03-29)
- [Northern Beaches Advocate — More drones for shark detection](https://www.northernbeachesadvocate.com.au/2026/01/04/more-drones-for-shark-detection/) (accessed 2026-03-29)
- [NPA NSW — From Nets to Networks](https://npansw.org.au/2025/08/31/from-nets-to-networks-a-changing-current-for-shark-control-in-nsw/) (accessed 2026-03-29)
- [SharkSmart App page](https://www.sharksmart.nsw.gov.au/sharksmart-app) (accessed 2026-03-29)
- [Manly Community Forum — Shark Management](https://manlycommunityforum.org/nsw-shark-management-program-and-manly-beach-safety-arrangements/) (accessed 2026-03-29)

---

## 5.2 Dorsal

**URL:** https://www.dorsalwatch.com
**App Store:** https://apps.apple.com/au/app/dorsal-shark-reports/id1045887929
**Google Play:** https://play.google.com/store/apps/details?id=io.fruitful.dorsal
**Last verified:** 2026-03-29

### What it does
Dorsal is a free, community-powered shark sighting and alert app, often described as "the Waze of shark spotting." Anyone can file a geo-tagged report with photos or video. Official reports from government bodies and lifesavers are aggregated alongside community sightings. A Dorsal CMS layer allows volunteer moderators and authorities to verify and edit public reports. Premium subscription ($9.99/year) removes ads and enables push notifications.

### Current Status (as of 2026-03-29)
- **User count:** Over 500,000 users (as stated on dorsalwatch.com homepage; earlier App Store descriptions cited 250,000 — the discrepancy reflects an older listing not updated to match the homepage figure).
- **Geographic coverage:** Australia, Hawaii, Mainland USA, Reunion Island.
- **Last app update:** January 23, 2026 — general fixes and performance improvements.
- **Partnerships:** "Expressions of Interest now open" for partnerships, suggesting active pursuit of official data-sharing agreements with authorities.

### UX Issues (documented in user reviews, 2023–2025)
User reviews on Google Play and the App Store have repeatedly cited:
- **Map zoom regression:** Map zooms back out automatically, preventing users from examining local areas.
- **Background polling:** App continues polling when idle, causing battery drain.
- **Intrusive advertising:** Ad frequency on the free tier described as disruptive.
- **Crowdsourcing reliability:** Potential for fake, inaccurate, or absent reports at any given beach; quality depends entirely on community density.
App changelog entries from February 2023, June 2023, and March 2024 reference "general fixes" without resolving these core complaints in user feedback.

### Strengths
- Largest crowdsourced shark sighting community in the Southern Hemisphere.
- Network effect: report density is highest in high-population Australian coastal zones (Sydney, Gold Coast).
- Official report aggregation adds a verified data layer.
- Watch app available (premium).

### Weaknesses
- Reactive only — no predictive risk score.
- No environmental data (rainfall, SST, upwelling, discharge).
- Coverage gaps at beaches with low user density.
- No species-specific risk branching.
- UX friction (zoom, ads, polling) degrades user experience.
- No bull shark / white shark distinction.

| Dimension | Detail |
|-----------|--------|
| **Type** | Crowdsourced sighting and alert app |
| **Gap SharkSense fills** | Predictive risk derived from oceanographic conditions, not just "was a shark seen nearby today?" |
| **User base** | 500,000+ |
| **Last updated** | January 2026 |

**Sources:**
- [Dorsal homepage](https://www.dorsalwatch.com/) (accessed 2026-03-29)
- [Dorsal on Google Play](https://play.google.com/store/apps/details?id=io.fruitful.dorsal&hl=en_US) (accessed 2026-03-29)
- [Dorsal App Store listing](https://apps.apple.com/au/app/dorsal-shark-reports/id1045887929) (accessed 2026-03-29)
- [TechCrunch — Dorsal launches in USA](https://techcrunch.com/2016/06/22/relax-surfers-dorsals-crowdsourced-shark-reporting-app-is-now-available-in-the-usa/) (accessed 2026-03-29)
- [Tracking Sharks — Dorsal App Part 1](https://www.trackingsharks.com/dorsal-shark-reporting-app-part-1/) (accessed 2026-03-29)

---

## 5.3 Bitemetrix (Ronnie Vickery)

**URL:** https://www.facebook.com/p/BiteMetrix-61557983529315/ (Facebook presence confirmed; no standalone website located as of 2026-03-29)
**Last verified:** 2026-03-29

### What it does
Bitemetrix is a free daily shark risk assessment service for NSW ocean users, created by fisherman and surfer Ronnie Vickery. It is the closest intellectual predecessor to SharkSense's white shark risk branch. Vickery produces daily at-a-glance illustrations showing elevated shark-human interaction risk zones along the NSW coastline, updated as conditions change.

### Methodology
Vickery's approach is entirely focused on oceanographic signatures associated with white shark presence:
- **Upwelling events:** Cool, nutrient-rich water rising along the shelf break triggers phytoplankton blooms → zooplankton → baitfish → large marine predators including white sharks.
- **Sea surface temperature (SST) interpretation:** Vickery interprets satellite SST imagery manually to identify frontal zones and temperature gradients that correlate with prey aggregations and predator presence.
- **Risk levels:** Low / Moderate / Medium / High (note: Moderate and Medium are separate discrete levels in his framework).
- **Update cadence:** Daily, with intra-day updates when conditions change significantly.
- **Geographic scope:** Currently fully operational in NSW only; national roll-out planned.

### Origin
Bitemetrix was created after Vickery spent years tracking ocean currents and fish movements, and had been monitoring Port Macquarie conditions in the lead-up to a shark attack there in August 2023. The system crystallised from his observation that oceanographic precursors to shark activity were visible but not communicated to the public.

### Strengths
- Only publicly available daily risk product focused on upwelling-driven white shark habitat in NSW — the specific ecological mechanism SharkSense's white shark branch also targets.
- Free service with no commercial barrier.
- Grounded in the same oceanographic logic as peer-reviewed literature on white shark coastal habitat use.
- Practical "at a glance" format, not a data dump.

### Weaknesses
- No automated data ingestion — relies on manual SST image interpretation by one individual.
- Not scalable or auditable: no algorithmic transparency, no data lineage.
- No bull shark branch (no rainfall, discharge, or estuary proximity analysis).
- No beach-level granularity — risk zones are broad coastal segments.
- No API, no app, no push alerts.
- Single point of failure: if Ronnie stops updating, service stops.
- No integration with listening station detections or drumline data.
- Limited to NSW by design.

### Gap SharkSense fills relative to Bitemetrix
SharkSense operationalises and extends Bitemetrix's core insight — that upwelling drives white shark coastal presence — through automated data pipelines (Open-Meteo, satellite SST, IMOS detections), adds the bull shark branch (missing entirely from Bitemetrix), provides beach-level spatial granularity, and delivers results as a machine-readable risk score that feeds an app.

| Dimension | Detail |
|-----------|--------|
| **Type** | Manual daily oceanographic risk assessment |
| **Gap SharkSense fills** | Automated multi-source pipeline, bull shark branch, beach-level resolution, app delivery, API potential |
| **User base** | Unknown (Facebook-based distribution) |
| **Last updated** | Active as of early 2026 (Facebook page active) |

**Sources:**
- [Stab Mag — Something New On Our Shark Tracking Radar](https://stabmag.com/news/something-new-on-the-menu-re-shark-information/) (accessed 2026-03-29)
- [Swellnet — Ronnie Vickery: In The Hot Seat](https://www.swellnet.com/news/talking-heads/2024/08/15/ronnie-vickery-in-the-hot-seat) (accessed 2026-03-29)
- [Surfer Magazine — What's New With Shark Deterrents](https://www.surfer.com/gear/new-shark-deterrent-technology) (accessed 2026-03-29)
- [BiteMetrix Facebook page](https://www.facebook.com/p/BiteMetrix-61557983529315/) (accessed 2026-03-29)

---

## 5.4 SCIRP AI Shark Attack Forecasting Paper + SafeWaters.ai

### 5.4a The Paper

**Citation:** "Forecasting Shark Attack Risk Using AI: A Deep Learning Approach"
**Journal:** *Journal of Data Analysis and Information Processing (JDAIP)*, Scientific Research Publishing (SCIRP)
**Published:** October 2023
**URL:** https://www.scirp.org/journal/paperinformation?paperid=128264
**PDF:** https://www.scirp.org/pdf/jdaip_2023101114181388.pdf
**ResearchGate:** https://www.researchgate.net/publication/374656299_Forecasting_Shark_Attack_Risk_Using_AI_A_Deep_Learning_Approach

### Methodology
The study developed a deep learning / fully connected neural network trained on the Global Shark Attack File (200+ years of historical incident data) combined with environmental metadata. The task is a binary classification: did an attack occur (1) or not (0) on a given date at a given location? The model's output is then mapped to Low / Medium / High risk categories.

**Training data:** Over 200 years of shark attack records from the Global Shark Attack File, with approximately 30–40 marine weather variables for each attack day and matched non-attack days at the same locations.

**Marine weather variables (disclosed and inferred):**
Sources citing the paper reference approximately 30 monitored variables; the full list from the published paper includes at minimum:
1. Water temperature
2. Swell direction
3. Swell height
4. Moon phase
5. Weather description (e.g., cloudy, sunny)
6. Cloud cover (%)
7. Wind speed
8. Date / day of year (seasonal proxy)
9. Latitude / longitude
10. Tide state (inferred from associated app documentation)

The paper's supplementary material and the associated SafeWaters.ai product documentation reference "40 different variables" in some sources and "roughly thirty marine weather variables" in others. The exact authoritative list of all variables is not fully reproduced in accessible secondary sources reviewed for this report.

**Accuracy:** The model correctly classified 82–89% of historical attack days as "high risk" in test data (figures vary slightly across published sources — 82% in the paper itself, 83% and 89% cited in marketing materials). This represents retrospective pattern-matching accuracy on labelled data, not a prospective prediction rate.

### What the paper gets right (applicable to SharkSense)
- Validates that machine learning can find environmental signatures predictive of elevated shark-human interaction risk.
- Demonstrates that a relatively modest variable set (30–40) drawn from accessible marine weather data can achieve meaningful classification accuracy.
- Provides academic credibility for the general approach SharkSense takes.

### What's missing for NSW specifically
- **No species branching.** The model treats all shark attacks as one category; bull shark and white shark ecologies are distinct and respond to entirely different environmental drivers (rainfall/discharge vs. upwelling/SST).
- **Trained on global data.** NSW conditions (east Australian upwelling, tropical cyclone runoff, estuarine bull sharks) are diluted by global training data and may not reflect local signal fidelity.
- **No real-time data pipeline.** The paper is a model demonstration, not an operational system.
- **No localised beach resolution for NSW.** Attack-based training data at NSW beaches is sparse; the model relies on global density.
- **No integration with Australian authoritative data** (IMOS animal tracking, SharkSmart listening stations, WaterNSW discharge, Beachwatch).

### 5.4b SafeWaters.ai (the commercial application)

**URL:** https://www.safewaters.ai
**App Store:** https://apps.apple.com/us/app/safewaters-ai-shark-forecasts/id6456268262
**Google Play:** https://play.google.com/store/apps/details?id=app.bravostudio.A01H469ZEXKNRHPGJA82JH8ZNR6
**Last verified:** 2026-03-29

The SCIRP paper is the direct research foundation for the commercial SafeWaters.ai app. Key characteristics:

- **7-day global shark risk forecast** for any beach worldwide.
- **Freemium** pricing: free download, subscription required for unlimited access (reported ~$0.99/month; some users reported unexpected ~$18 charges for "free trials").
- **Inputs:** 40+ marine weather variables (water temp, swell, moon phase, cloud cover, wind, tide) + date + location.
- **Output:** Risk level (implied Low / Medium / High) with surf conditions overlay (wave height, tide times, visibility).
- **Feature in development (as of Nov 2025):** Live drone feed integration — users would be able to watch AI-monitored beach drone footage.
- **Developer response Nov 2025** confirms active development.
- **Accuracy claim:** 83–89% on historical test data.

**Weaknesses:**
- Global model — not tuned for NSW species-specific dynamics.
- Location gaps: named surf breaks not always indexed.
- No data from Australian authoritative sources (IMOS, SharkSmart, WaterNSW).
- Billing transparency issues reported.
- No bull shark / rainfall / discharge branch.

| Dimension | Detail |
|-----------|--------|
| **Type** | AI-powered global shark risk forecast app |
| **Gap SharkSense fills** | NSW-specific species branching, real-time Australian sensor data, bull shark rainfall logic, no paywall friction |
| **User base** | Not disclosed |
| **Last updated** | November 2025 (developer response); January 2026 (App Store) |

**Sources:**
- [SCIRP paper page](https://www.scirp.org/journal/paperinformation?paperid=128264) (accessed 2026-03-29)
- [SafeWaters.ai homepage](https://www.safewaters.ai/) (accessed 2026-03-29)
- [SafeWaters.ai App Store listing](https://apps.apple.com/us/app/safewaters-ai-shark-forecasts/id6456268262) (accessed 2026-03-29)
- [SafeWaters.ai Google Play](https://play.google.com/store/apps/details?id=app.bravostudio.A01H469ZEXKNRHPGJA82JH8ZNR6) (accessed 2026-03-29)
- [Scripps News — App forecasts shark risk with 89% accuracy](https://www.scrippsnews.com/science-and-tech/artificial-intelligence/app-says-it-can-forecast-risk-of-shark-attacks-with-89-accuracy) (accessed 2026-03-29)
- [Stab Mag — Can This App Predict Shark Attacks?](https://stabmag.com/elsewhere/this-app-claims-to-predict-when-youre-more-likely-to-get-attacked-by-a-shark/) (accessed 2026-03-29)
- [SkyWork review — SafeWaters.ai deep dive](https://skywork.ai/skypage/en/ai-shark-forecast-app/1977557279531134976) (accessed 2026-03-29)
- [Daily Jaws — SafeWaters Kickstarter](https://thedailyjaws.com/news/revolutionary-shark-attack-risk-forecast-app-safewaters-launches-kickstarter) (accessed 2026-03-29)

---

## 5.5 New Entrants and Adjacent Tools

### 5.5a Sharktivity (Atlantic White Shark Conservancy)

**URL:** https://www.atlanticwhiteshark.org/sharktivity-app
**App Store:** https://apps.apple.com/us/app/sharktivity-by-awsc/id1097933510
**Last verified:** 2026-03-29

Sharktivity is the AWSC's white shark sighting and acoustic detection app for Cape Cod, Massachusetts. Version 2.8.1 (September 2025) introduced "Sharktivity Pro" — a paid subscription tier offering Field Updates (behind-the-scenes research notes from the science team), home screen widgets, and customisation. Standard alerts (sightings, acoustic detections) remain free. Public sightings are verified by the New England Aquarium before publication. The app has no environmental predictor variables, is US East Coast only, and does not address bull sharks or Southern Hemisphere oceanography. **Not a direct competitor for NSW** but a relevant reference for community-integrated acoustic detection + sighting reporting done at institutional quality.

### 5.5b OCEARCH Global Shark Tracker

**URL:** https://www.ocearch.org/tracker
**App:** https://play.google.com/store/apps/details?id=org.ocearch.SharkTrackerAndroid
**Last verified:** 2026-03-29

OCEARCH is a data-centric research organisation that tags and tracks large migratory sharks globally using SPOT satellite tags (surface ping, average 5-year lifespan). The Global Shark Tracker is a free public map of tagged shark positions. Key 2025/26 development: recovery of multiple pop-up satellite archival tags (PSATs) from white sharks tagged off Nova Scotia in 2025, yielding depth, temperature, and light-level time-series. OCEARCH's Australian engagement has historically been limited (2015 tiger shark project in western Victoria/WA). **No API for external developers** has been announced. Data policy requires researcher partnerships for raw data access. OCEARCH is a data source, not a consumer product; SharkSense would consume IMOS animal tracking data rather than OCEARCH data for NSW.

### 5.5c Surf Forecast Platforms (Surfline / Magic Seaweed / Swellnet)

**Status as of 2026-03-29:** No shark-specific features identified on any platform.

- **Surfline** (surfline.com) acquired Magic Seaweed (MSW) in May 2023, consolidating two of the largest surf forecast platforms. Neither Surfline nor MSW has launched shark activity features as of 2026-03-29. Surfline's product focus remains wave height, wind, tide, and cam footage.
- **Swellnet** (swellnet.com), founded in Australia in 2002, covers Australian surf forecast and conditions. No shark risk feature has been launched. Swellnet has published editorial coverage of Bitemetrix (Ronnie Vickery interview, August 2024) and the broader shark-risk-assessment space, indicating editorial awareness without product action.

**Gap SharkSense fills vs. surf platforms:** The surf forecast audience (SharkSense's primary user base — surfers, swimmers) visits these platforms daily for go/no-go beach decisions. None of them surface shark risk. SharkSense is a natural data layer these platforms could embed or link; partnership or widget integration is a realistic distribution channel.

### 5.5d SafeWaters.ai (see §5.4b above)
Already documented as the primary new-entrant predictive tool. It is the closest global competitor to SharkSense's core value proposition.

### 5.5e University Research Groups

No new academic groups building operational NSW-specific shark risk prediction tools were identified in searches conducted for this report. The most relevant academic work is the 2023 SCIRP paper (§5.4). University of NSW has published peer-reviewed oceanographic work on east Australian upwelling (relevant to white shark habitat modelling) and a 2025 novel risk assessment framework comparing shark-bite mitigation strategies (Henriksen et al., *People and Nature*, Wiley). Neither represents a competing public tool. The Florida Program for Shark Research at the University of Florida maintains the Global Shark Attack File (data source for SafeWaters.ai) but does not operate a public risk app. UCSB published machine-learning work on longline bycatch risk (2023) — focused on shark conservation, not human safety.

| Platform | Shark Feature | Gap SharkSense fills |
|----------|--------------|---------------------|
| Surfline / MSW | None | Entire shark risk layer missing from Australia's largest surf audience platform |
| Swellnet | None (editorial awareness) | Same; editorial familiarity creates potential media/partnership path |
| Sharktivity (AWSC) | US East Coast only, reactive | NSW species, predictive score, bull shark branch |
| OCEARCH | Research data, no consumer product | Consumer-facing risk score, Australian beach specificity |

**Sources:**
- [Sharktivity by AWSC](https://www.atlanticwhiteshark.org/sharktivity-app) (accessed 2026-03-29)
- [OCEARCH Shark Tracker](https://www.ocearch.org/tracker/) (accessed 2026-03-29)
- [OCEARCH Data Policy](https://www.ocearch.org/data-policy/) (accessed 2026-03-29)
- [Surfline MSW join announcement](https://www.surfline.com/surf-news/msw-joined-surfline/182111) (accessed 2026-03-29)
- [Swellnet — Ronnie Vickery interview](https://www.swellnet.com/news/talking-heads/2024/08/15/ronnie-vickery-in-the-hot-seat) (accessed 2026-03-29)
- [Henriksen et al. 2025 — Novel risk assessment framework](https://besjournals.onlinelibrary.wiley.com/doi/full/10.1002/pan3.70054) (accessed 2026-03-29)
- [Florida Museum — Shark Bytes data science post](https://www.floridamuseum.ufl.edu/sharks/blog/a-data-science-approach-to-fifty-years-of-shark-bites/) (accessed 2026-03-29)

---

## Summary Competitive Matrix

| Competitor | Type | Predictive? | Species Branch? | NSW-Specific? | Real-Time Env. Data? | API? | User Base |
|------------|------|-------------|-----------------|---------------|----------------------|------|-----------|
| SharkSmart (NSW Gov) | Alert / detection | No | No | Yes | No | No | n/a (gov) |
| Dorsal | Crowdsourced sighting | No | No | Yes + 3 others | No | No | 500K+ |
| Bitemetrix | Manual daily forecast | Partial (white only) | White only | Yes | Manual SST | No | Unknown |
| SafeWaters.ai | AI risk forecast | Yes | No | Global | Historical only | No | Unknown |
| Sharktivity (AWSC) | Sighting + detection | No | White shark | US East only | No | No | Unknown |
| OCEARCH | Research tracking | No | Multi-species | Global | Satellite tags | Research only | Research |
| Surfline / MSW | Surf forecast | No | None | Partial | Wave/wind/tide | Yes (paid) | Millions |
| **SharkSense** | **Predictive risk** | **Yes** | **Bull + White** | **Yes (5 beaches)** | **Yes (10 sources)** | **Planned** | **MVP** |

---

## Key Strategic Findings

1. **No direct competitor offers species-specific branching for NSW.** The bull shark / white shark split — each with its own environmental driver logic — is unaddressed by every tool in this landscape.

2. **SharkSmart is a distribution threat, not a feature competitor.** The government platform has reach and authority but no predictive capability. SharkSense's risk score could complement SharkSmart data (SMART drumlines, listening stations as inputs) rather than compete directly. The absence of a public API is a data-access obstacle, not an insurmountable one.

3. **Bitemetrix is the validation case.** Ronnie Vickery's manual upwelling-tracking product demonstrates that a daily shark risk product based on oceanographic signals has an audience and fills a real need. SharkSense automates and extends this concept with full data-pipeline infrastructure and adds the bull shark branch.

4. **SafeWaters.ai is the most direct product competitor.** It is global, live on both app stores, and based on peer-reviewed AI methodology. Its weaknesses — global training data dilution, no NSW-specific sources, no species branching, billing friction — are precisely the gaps SharkSense is architected to fill for the NSW market.

5. **Surf platforms are the largest distribution opportunity.** Surfline and Swellnet serve SharkSense's primary audience daily. Neither has a shark risk product. A widget or data API partnership would be the highest-leverage distribution path once SharkSense has demonstrated reliability.

6. **The $6.7M government investment is a tailwind, not a headwind.** Increased public awareness of shark risk — through the December 2025 / January 2026 media cycle — raises demand for predictive tools. SharkSense can position as the answer to the question the government's announcement implicitly asks: "how do I know when conditions are risky before I get to the beach?"
