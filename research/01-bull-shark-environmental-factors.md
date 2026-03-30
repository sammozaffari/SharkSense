# Bull Shark Environmental Risk Factors
## SharkSense Risk Algorithm Research — Factor Domain: Bull Shark (Carcharhinus leucas)

**Research date:** 2026-03-29
**Scope:** NSW coast, focus on 5 pilot beaches: Manly, Dee Why, Nielsen Park (Sydney Harbour), Bondi, Newcastle/Nobbys
**Algorithm context:** Bull shark score is one branch of a two-branch risk model (bull shark + white shark); final score = max of both. Weights below are relative contributions within the bull shark sub-model only.

---

Bull sharks (*Carcharhinus leucas*) are the dominant bite-risk species in NSW estuarine and nearshore coastal waters. Unlike white sharks — whose risk is driven by upwelling, prey availability (seals/cetaceans) and open-ocean temperature — bull shark risk is fundamentally **rainfall-driven and estuary-linked**. Bull sharks are euryhaline (tolerating full freshwater to full seawater), routinely use rivers as nursery habitat, and are pulled into coastal waters by the same nutrient/prey pulse that follows heavy rain events. Seven quantifiable environmental factors govern this risk in NSW waters.

---

## Factor 1: Rainfall and Catchment Discharge

- **Risk mechanism:** Heavy rainfall over catchments flushes nutrients, organic matter, prey fish, and juvenile bait species from rivers and estuaries into nearshore coastal waters. Bull sharks follow this prey flush outward from their estuarine holding areas. Additionally, freshwater discharge plumes reduce salinity in the surf zone, creating brackish corridors that bull sharks preferentially track. NSW Government advisories (January 2026) explicitly state: "Heavy rain can flush nutrients, fish and bull sharks out of rivers and estuaries and may result in more bull shark activity along beaches."
- **Species specificity:** Bull shark primarily. White sharks avoid turbid freshwater plumes; tiger sharks show partial association.
- **Measurable proxy:** (1) Cumulative 7-day catchment rainfall (mm) from Bureau of Meteorology AWDN gauges; (2) River discharge rate (ML/day or m³/s) from WaterNSW real-time API gauges at key estuary entry points (e.g., Windsor gauge for Hawkesbury-Nepean, Maitland gauge for Hunter River).
- **Data source:** BOM AWDN rainfall API (`http://www.bom.gov.au/climate/data/`); WaterNSW Surface Water Data API (`https://api-portal.waternsw.com.au/`); NSW Government real-time water portal (`https://realtimedata.waternsw.com.au/`).
- **Threshold values:**
  - **≥100 mm cumulative rainfall over 7 days** triggers statistically significant increase in bull shark beach-area catch rates (Werry et al. 2018, Queensland Shark Control Program data 1996–2007, 10 locations, 1,783 km of Queensland coastline).
  - **>45 mm rainfall** associated with elevated bull shark nearshore detection in NSW 5.5-year acoustic telemetry study (Smoothey et al. 2023, 233 tagged sharks, 21 NSW beaches).
  - Increased detections begin at **>45 mm** (moderate) and become strongly elevated at **≥100 mm** cumulative.
- **Lag time:** Bull shark beach-area catches increase **1–8 days post-rainfall event**, with peak occurrence typically 3–5 days after the rainfall peak (Werry et al. 2018). Raoult (Griffith University, January 2026): "It can take up to a week after heavy rain for the water to clear and for the threat of bull sharks to ease."
- **Confidence level:** **High** — Werry et al. 2018 is peer-reviewed, multi-location across 1,783 km of coastline over 11 years; replicated directionally in Smoothey et al. 2023 NSW study.
- **Weight recommendation:** 0.30 (primary driver in bull shark sub-model, consistent with SharkSense algorithm specification)
- **Sources:**
  - Werry, J.M. & Sumpton, W. (2018). "Rainfall and sea surface temperature: key drivers for occurrence of bull shark, *Carcharhinus leucas*, in beach areas." *Global Ecology and Conservation*, 16, e00531. https://www.sciencedirect.com/science/article/pii/S2351989418302476 (accessed 2026-03-29)
  - Smoothey, A.F. et al. (2023). "Bull Shark (*Carcharhinus leucas*) Occurrence along Beaches of South-Eastern Australia: Understanding Where, When and Why." *Biology*, 12(9), 1189. https://pmc.ncbi.nlm.nih.gov/articles/PMC10526001/ (accessed 2026-03-29)
  - NSW Government Ministerial Release (2026). "Increased bull shark activity expected around beaches and waterways following heavy rainfall." https://www.nsw.gov.au/ministerial-releases/increased-bull-shark-activity-expected-around-beaches-and-waterways-following-heavy-rainfall (accessed 2026-03-29)
  - Raoult, V. (Griffith University), quoted in CNN (2026-01-20). "Four shark attacks in two days. Why Australia's beaches are so dangerous this year." https://edition.cnn.com/2026/01/20/australia/australia-shark-attacks-sydney-intl-hnk (accessed 2026-03-29)

---

## Factor 2: River Discharge Rate and Estuary Outflow

- **Risk mechanism:** River discharge rate quantifies the volume and velocity of freshwater entering coastal waters. High discharge creates an extended brackish plume in the surf zone, which (a) displaces prey fish seaward, (b) carries carcasses and organic matter that attract sharks, and (c) directly correlates with turbidity. Distinct from rainfall alone — discharge integrates catchment saturation, antecedent moisture, and reservoir releases, meaning discharge can remain elevated for days after rain ceases. Research shows salinity and freshwater inflow have the "greatest influence" on bull shark spatial distribution in estuarine systems (Florida Caloosahatchee study, applicable by analogy to NSW).
- **Species specificity:** Bull shark primarily. Bull sharks are uniquely adapted to move freely across the full salinity gradient; discharge-driven salinity reduction is a navigation cue.
- **Measurable proxy:** River discharge in ML/day or m³/s from WaterNSW gauges. Key gauges for pilot beaches: Hunter River at Singleton/Maitland (Nobbys), Parramatta River at Parramatta (Nielsen Park/Manly Cove), Middle Harbour Creek (Manly/Dee Why), Cooks River (Botany Bay), Georges River at Liverpool (Cronulla/Kurnell near Bondi Bay system).
- **Data source:** WaterNSW API (`https://realtimedata.waternsw.com.au/cgi/webservice.pl`); SEED NSW Hydrography dataset (`https://datasets.seed.nsw.gov.au/dataset/nsw-hydrography`).
- **Threshold values:** No single peer-reviewed NSW discharge threshold published. Operational proxy: discharge **>2× 30-day rolling mean** at the nearest gauge is a reasonable elevated-risk trigger. In subtropical systems, high-discharge periods (wet season average >3× dry season average) correlate with bull shark estuarine use changes (Matich 2024).
- **Lag time:** 0–72 hours from discharge peak to coastal water turbidity peak; 1–5 days until bull shark nearshore detection peak (mirrors rainfall lag, with discharge as the mechanism).
- **Confidence level:** **Medium** — well-established mechanism (euryhalinity, prey displacement) but specific discharge threshold for NSW not peer-reviewed; derived from Queensland catch data and Florida acoustic telemetry by analogy.
- **Weight recommendation:** 0.25 (second-ranked driver per SharkSense specification)
- **Sources:**
  - Matich, P. et al. (2024). "Long-term effects of climate change on juvenile bull shark migratory patterns." *Journal of Animal Ecology*, 93, 1445–1461. https://besjournals.onlinelibrary.wiley.com/doi/10.1111/1365-2656.14140 (accessed 2026-03-29)
  - WaterNSW Data API Documentation. https://github.com/andrewcowley/WaterNSW-data-API-documentation/blob/master/getting-started.md (accessed 2026-03-29)
  - NSW SEED NSW Hydrography Dataset. https://datasets.seed.nsw.gov.au/dataset/nsw-hydrography (accessed 2026-03-29)

---

## Factor 3: Estuary Proximity

- **Risk mechanism:** Bull shark risk declines with distance from the nearest estuary or river mouth. Estuaries function as nursery grounds (juveniles may remain in the river for up to 5 years; Smoothey 2023), as holding areas for adult bulls during warm months, and as the launching point for post-rainfall coastal excursions. Beach proximity to an estuary mouth determines both baseline residency risk (sharks present year-round in the estuary) and post-rainfall surge risk (sharks flushing out with the plume). The dominant estuary-beach systems for SharkSense's pilot beaches are: Hunter River mouth → Nobbys Beach (within 500 m); Manly Lagoon/Middle Harbour → Manly/Dee Why (Manly Lagoon drains to Manly beach directly; Middle Harbour Creek runs through Castlecrag, 4 km from Manly Cove); Parramatta River → Nielsen Park and Sydney Harbour (entire harbour is effectively an estuarine funnel); Cooks River → Botany Bay, 10+ km from Bondi; Georges River → Cronulla, not a direct pilot beach.
- **Species specificity:** Bull shark only. White shark occurrence does not correlate positively with estuary proximity; white sharks avoid turbid estuarine water.
- **Measurable proxy:** Straight-line distance (km) from beach centre to nearest classified estuary mouth, sourced from NSW SEED Estuaries Dataset. Can be pre-computed as a static weight in the algorithm with no real-time update required.
- **Data source:** NSW SEED Estuaries Dataset (`https://datasets.seed.nsw.gov.au/dataset/estuaries12439`); NSW SEED Estuary Drainage Catchments (`https://datasets.seed.nsw.gov.au/dataset/estuary-drainage-catchmentseafb7`).
- **Threshold values:**
  - **<1 km** from river/estuary mouth: maximum risk zone. NSW SharkSmart official advice: "take extra care within 1km of rivers, river mouths or harbours, especially after rain or flooding" (NSW DPI Fact Sheet; NSW Government 2026 advisory).
  - **1–3 km**: elevated risk, especially during post-rainfall pulse (3–5 days post-event).
  - **>5 km**: background risk only (static distance component; risk still possible via open-coast migration).
  - In the Smoothey et al. (2023) acoustic study, the highest bull shark detection density was recorded at beaches **within 800 m** of the nearest river mouth (minimum 480 m, mean 640 m, maximum 770 m for peak-detection beach groups).
- **Lag time:** Static factor (no lag — proximity does not change). Combine with rainfall factor for time-sensitive risk multiplication.
- **Confidence level:** **High** — SharkSmart official threshold is 1 km; Smoothey et al. (2023) confirms 640–800 m mean distance for peak detection; Dictionary of Sydney records fatal attacks >20 km upstream in Georges River, confirming bull shark penetration far inland.
- **Weight recommendation:** 0.15
- **Sources:**
  - Smoothey, A.F. et al. (2023). *Biology*, 12(9), 1189. https://pmc.ncbi.nlm.nih.gov/articles/PMC10526001/ (accessed 2026-03-29)
  - NSW SharkSmart. "Bull Shark Fact Sheet." https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0008/1447730/Bull-Shark-fact-sheet.pdf (accessed 2026-03-29)
  - NSW Government Advisory (2026). https://www.nsw.gov.au/ministerial-releases/increased-bull-shark-activity-expected-around-beaches-and-waterways-following-heavy-rainfall (accessed 2026-03-29)
  - NSW SEED Estuaries Dataset. https://datasets.seed.nsw.gov.au/dataset/estuaries12439 (accessed 2026-03-29)
  - Dictionary of Sydney. "Living with sharks on the Georges River." https://dictionaryofsydney.org/entry/living_with_sharks_on_the_georges_river (accessed 2026-03-29)

---

## Factor 4: Sea Surface Temperature (SST)

- **Risk mechanism:** Bull shark is a warm-water species with a well-defined thermal window for NSW coastal presence. Below 19°C, bull sharks depart Sydney waters entirely; detections are "extremely rare" below this threshold (Lubitz et al. 2025). Presence probability increases sharply above 20°C and peaks around 23–24°C. SST governs both (a) whether sharks are present in coastal NSW waters at all (seasonal gateway) and (b) activity intensity once present. Ocean warming is extending the seasonal window: bull sharks off Sydney now stay an average of 15 days longer per summer compared to 2009 (approximately 1 extra day per year over 15 years), driven by a 0.57°C mean SST rise (Bondi, October–May, 2006–2024) and 0.67°C broader summer SST rise (1982–2024 remotely sensed).
- **Species specificity:** Bull shark. White shark is the inverse — cooler water preference, retreating northward as SST rises above ~20°C in summer.
- **Measurable proxy:** Real-time SST from Open-Meteo Marine API (`https://marine-api.open-meteo.com/`) at each beach coordinate; or NSW DPI tagged shark listening stations SST co-recorded data.
- **Data source:** Open-Meteo Marine API (free, hourly SST); IMOS SOOP SST (`https://portal.aodn.org.au/`).
- **Threshold values:**
  - **Below 19°C**: sharks departing/absent. Negligible risk from bull sharks.
  - **19–20°C**: transition zone; presence possible but low probability. Corresponds to 5th percentile of observed thermal range for adult east-coast bulls.
  - **20–22°C**: moderate activity. Presence confirmed; occurrence probability rising.
  - **22–24°C**: active range. Sydney Harbour study (Werry et al. 2019) found probability of bull shark presence peaked at **~22°C**, explaining 52.5% of variability.
  - **>24°C**: very active / peak presence. Smoothey et al. (2023): "occurrence peaking at 23°C"; Werry & Sumpton (2018) QSCP data: "present when SST is 20–26°C, with peak abundance at 24°C."
  - **>26°C**: still occupied but with possible slight decline at extreme upper end of preferred range.
- **Lag time:** Near-zero — SST is an instantaneous state variable. Seasonal change operates over weeks.
- **Confidence level:** **High** — Lubitz et al. (2025) is 15-year, 92-shark acoustic telemetry study specific to Sydney; Werry & Sumpton (2018) QSCP is 11-year multi-location dataset; Werry et al. (2019) Sydney Harbour specific.
- **Weight recommendation:** 0.10 (within bull shark model — SST primarily acts as a seasonal gate; once above 20°C, rainfall/estuary factors dominate incident risk)
- **Sources:**
  - Lubitz, N. et al. (2025). "Ocean warming increases residency at summering grounds for migrating bull sharks (*Carcharhinus leucas*)." *Science of the Total Environment*. https://www.sciencedirect.com/science/article/pii/S0048969725016067 (accessed 2026-03-29)
  - JCU Media Release (2025). "Climate shifts extending Sydney's bull shark season." https://www.jcu.edu.au/news/releases/2025/july/climate-shifts-extending-sydneys-bull-shark-season (accessed 2026-03-29)
  - Phys.org (2025). "Bull sharks linger in warming Sydney waters." https://phys.org/news/2025-07-bull-sharks-linger-sydney.html (accessed 2026-03-29)
  - Werry, J.M. et al. (2019). "Long-term patterns of abundance, residency and movements of bull sharks (*Carcharhinus leucas*) in Sydney Harbour, Australia." *Scientific Reports*, 9, 19894. https://www.nature.com/articles/s41598-019-54365-x (accessed 2026-03-29)
  - Werry, J.M. & Sumpton, W. (2018). *Global Ecology and Conservation*. https://www.sciencedirect.com/science/article/pii/S2351989418302476 (accessed 2026-03-29)
  - Matich, P. et al. (2024). *Journal of Animal Ecology*, 93, 1445–1461. https://besjournals.onlinelibrary.wiley.com/doi/10.1111/1365-2656.14140 (accessed 2026-03-29)

---

## Factor 5: Turbidity and Water Visibility

- **Risk mechanism:** Low-visibility water has a dual effect on bull shark incident risk. First, bull sharks are *adapted* to hunt in turbid estuarine environments — their sensory systems (electroreception via ampullae of Lorenzini, lateral line pressure detection, and olfaction) remain fully operational when vision is reduced to near-zero. In turbid estuaries and river mouths, bull sharks rely on electroreception as their primary hunting sense, capable of detecting bioelectric fields at 5 nV/cm with near-centimetre accuracy at <0.5 m range. Second, human surfers and swimmers create electromagnetic and pressure signatures indistinguishable from prey in turbid water: "In the conditions where bull sharks do encounter people, it's in those really brackish, murky waters, so they're not relying on their eyesight" (Raoult, Griffith University, January 2026). Third, turbidity co-occurs with the same rainfall events that drive bull shark onshore movement, making it a compound risk indicator rather than an independent causal factor. A study of shark bite incidents found 26.9% occurred in high turbidity water, 65.4% in medium turbidity, and only 7.7% in low turbidity (26 cases with estimated turbidity values).
- **Species specificity:** Bull shark. White sharks are visual hunters in clear oceanic water and are not associated with turbid inshore conditions.
- **Measurable proxy:** (1) Real-time water visibility/turbidity from NSW Beachwatch programme (EPA, at selected sites); (2) Qualitative proxy using rainfall as a turbidity surrogate — after any rainfall event ≥45 mm, assume elevated turbidity for 3–7 days; (3) Open-Meteo wave/current data as a swell-driven turbidity proxy.
- **Data source:** NSW EPA Beachwatch REST API (6-hour update); Open-Meteo Marine API for swell height (turbidity proxy).
- **Threshold values:**
  - No published NTU threshold specifically correlating bull shark attacks to turbidity in peer-reviewed NSW literature as of 2026-03-29.
  - **Practical threshold**: any post-rainfall conditions where horizontal water visibility is estimated <2 m (corresponding roughly to turbidity >50 NTU in coastal waters) should be treated as elevated risk.
  - **Swell height proxy**: Smoothey et al. (2023) found bull shark occurrence elevated when swell heights were 1.8–2.8 m — this swell range creates surf-zone turbidity from sand suspension.
- **Lag time:** Turbidity peaks within hours of peak rainfall/discharge; clears over 3–7 days depending on swell and river flow cessation.
- **Confidence level:** **Medium** — mechanism (electroreception, sensory substitution) is well-established biology; quantitative NTU-to-attack-rate relationship is not formally established in NSW peer-reviewed literature; expert consensus (Raoult 2026, NSW DPI advisories) is strong.
- **Weight recommendation:** 0.10
- **Sources:**
  - Raoult, V. (Griffith University) quoted in CNN (2026-01-20). https://edition.cnn.com/2026/01/20/australia/australia-shark-attacks-sydney-intl-hnk (accessed 2026-03-29)
  - Raoult, V. quoted in Nottingham Trent University Expert Blog (2026-01). "How our changing environment can influence shark activity." https://www.ntu.ac.uk/about-us/news/news-articles/2026/01/expert-blog-how-our-changing-environment-can-influence-shark-activity (accessed 2026-03-29)
  - Smoothey, A.F. et al. (2023). *Biology*, 12(9), 1189. https://pmc.ncbi.nlm.nih.gov/articles/PMC10526001/ (accessed 2026-03-29)
  - Sharks and Co. "How Sharks Use Electroreception in Murky Waters." https://sharksandco.com/how-sharks-use-electroreception-in-murky-waters-1-8790/ (accessed 2026-03-29)
  - Meynecke, O. (Griffith University) expert commentary via Scimex (2026). "Expert Reaction: Four shark attacks off NSW beaches." https://www.scimex.org/newsfeed/expert-reaction-four-shark-attacks-off-nsw-beaches (accessed 2026-03-29)

---

## Factor 6: Time of Day

- **Risk mechanism:** There is a documented contradiction between bull shark biological behaviour and statistical incident patterns. *Biologically*, bull sharks are crepuscular/nocturnal hunters: the Smoothey et al. (2023) acoustic telemetry study found large bull shark occurrence peaked from **midday through to 04:00, with a specific peak around midnight**. Juvenile bulls showed "higher nearshore presence between 20:00 and 03:00." The Sydney Harbour study (Werry et al. 2019) found a "diel pattern in depth use, with sharks utilising deeper water during daytime and moving shallower at night." SharkSmart NSW official advice warns to "avoid swimming and surfing at **dawn, dusk and night** — sharks can see you but you can't see them." *Statistically*, the Australian Shark Incident Database (ASID) shows over 80% of incidents occur during full daylight — this overwhelmingly reflects human exposure time (most beach users are present 08:00–18:00, not at midnight). Bull sharks show a slightly higher proportion of dusk incidents versus white sharks (approximately double the dusk-rate of white sharks), but the absolute numbers remain daylight-dominated. The contradiction is an **exposure-adjusted** artifact: per-shark-hour risk is highest at dawn/dusk/night, but raw incident counts peak at midday because human presence peaks then.
- **Species specificity:** Partial — white sharks are also recorded across daylight hours; the crepuscular/nocturnal preference is more pronounced in bull sharks.
- **Measurable proxy:** Local solar time (calculated from GPS coordinates and date using SunCalc library, already in SharkSense stack); time-of-day risk multiplier applied as a continuous or step function.
- **Data source:** SunCalc (client-side, no API needed); Taronga ASID temporal distribution data.
- **Threshold values:**
  - **Dawn (30 min before/after sunrise)**: biologically elevated; use 1.5× base multiplier.
  - **Day (sunrise+30min to sunset-30min)**: population-weighted incident peak; use 1.0× (baseline, already encoded in daylight crowd factor).
  - **Dusk (30 min before/after sunset)**: biologically elevated, strongest bull shark crepuscular signal; use 1.5× multiplier.
  - **Night (sunset+30min to sunrise-30min)**: very few users but biologically peak activity; 1.3× multiplier (lower than dusk because near-zero human exposure).
- **Lag time:** Zero — instantaneous state variable.
- **Confidence level:** **Medium** — temporal patterns from ASID are well-established; diel acoustic telemetry confirms nearshore movement timing; but the contradiction (biological vs statistical) means applying a dawn/dusk multiplier to a risk score calibrated on incident statistics requires careful normalisation.
- **Weight recommendation:** 0.10
- **Sources:**
  - Smoothey, A.F. et al. (2023). *Biology*, 12(9), 1189. https://pmc.ncbi.nlm.nih.gov/articles/PMC10526001/ (accessed 2026-03-29)
  - Werry, J.M. et al. (2019). *Scientific Reports*, 9, 19894. https://www.nature.com/articles/s41598-019-54365-x (accessed 2026-03-29)
  - Bradshaw, C.J.A. et al. (2022). "The Australian Shark-Incident Database for quantifying temporal and spatial patterns of shark-human conflict." *Scientific Data*, 9, 378. https://pmc.ncbi.nlm.nih.gov/articles/PMC9259633/ (accessed 2026-03-29)
  - NSW SharkSmart. "Staying Safe." https://www.sharksmart.nsw.gov.au/staying-safe (accessed 2026-03-29)
  - Science of Surfing. "When do shark attacks occur?" https://www.scienceofsurfing.com/p/shark-attack-timing (accessed 2026-03-29)

---

## Factor 7: Food Chain Cascade (Baitfish → Mackerel Tuna → Dolphins → Bull Sharks)

- **Risk mechanism:** Bull shark nearshore presence is preceded by a trophic cascade that is visible and observable from shore or via drone: post-rainfall nutrient/organic matter runoff → phytoplankton/zooplankton bloom → whitebait and small baitfish aggregation → mackerel tuna (school tuna, longtail tuna) feeding on baitfish → bottlenose/common dolphins herding the tuna/baitfish schools → bull sharks following the dolphin/tuna activity. This cascade was documented in real-time during the January 2026 NSW attack cluster. Joel Nancarrow (Hunter Shark Jaw Restoration, Newcastle — known to maintain a high-reach public education presence on Facebook) posted videos "of the food chain in action, with white bait being eaten by mackerel tuna and the mackerel tuna being herded up by dolphins," and noted that a dolphin at a Sydney beach was subsequently attacked by a bull shark. The NSW Government advisory explicitly confirmed the mechanism: "nutrient rich run-off... attracts baitfish. Heavy rain can flush nutrients, fish and bull sharks out of rivers and estuaries."

  The scientific literature supports dolphin/shark co-occurrence as a **leading indicator**: Heithaus (2001, *Journal of Zoology*) reviewed predator-prey interactions showing dolphins and sharks use shared prey resources and habitats simultaneously. Contrary to folk belief, dolphin presence does **not** indicate shark absence — both species co-occur at baitfish concentrations. The NSW SharkSmart programme explicitly states: "Dolphins and sharks often feed together on the same food, so you should not rely on sightings of dolphins to indicate the absence of sharks." Diving seabirds (gannets, terns) attacking baitfish from above are an additional observable leading indicator.

- **Species specificity:** Bull shark primarily. The inshore baitfish-tuna-dolphin cascade is estuarine/nearshore; white sharks are not typically part of this cascade (they target marine mammals in open water). Tiger sharks may be present at the same prey concentrations but are less estuary-linked.
- **Measurable proxy:** (1) Visual/drone observation of baitfish schools, surface-feeding tuna, or dolphins within 500 m of shore (qualitative input from SharkSmart sighting reports); (2) Lagged rainfall as a baitfish aggregation proxy (rainfall → nutrient flush → baitfish bloom; lag ~3–5 days); (3) SharkSmart API sighting reports filtered for "baitfish activity" and "dolphin" keywords near pilot beaches.
- **Data source:** SharkSmart NSW sighting report API; social media monitoring (Twitter/X @NSWSharkSmart); Joel Nancarrow / Hunter Shark Jaw Restoration Facebook posts as informal real-time indicator (not automated). Formal scientific backing: ASID sighting co-occurrence data; Heithaus (2001).
- **Threshold values:** Binary/qualitative — confirmed baitfish school or dolphin feeding activity within 500 m of shore elevates risk assessment by one tier (e.g., GREEN → AMBER, or AMBER → RED when combined with other factors).
- **Lag time:** Zero (real-time observation) to 3–5 days (rainfall-driven baitfish bloom leading to cascade).
- **Confidence level:** **Medium** — cascade mechanism is scientifically documented (Heithaus 2001; NSW Government advisory); specific quantitative relationship between dolphin sightings and bull shark attack probability has not been formally modelled for NSW; Nancarrow observations are expert-anecdotal (high credibility, not peer-reviewed).
- **Weight recommendation:** Not a standalone scored factor. Recommend implementation as a **risk-tier multiplier** (presence of baitfish/dolphin cascade activity = 1.2× modifier on the composite bull shark score) rather than an additive component with its own 0–1 weight.
- **Sources:**
  - Joel Nancarrow, Hunter Shark Jaw Restoration (Newcastle NSW). Facebook: https://www.facebook.com/Hunterjawrestore/ (accessed 2026-03-29); activities reported in The Nightly (2026-01): https://thenightly.com.au/australia/nsw/will-bite-and-run-fishermans-dire-warning-after-massive-200kg-bull-shark-pulled-from-popular-sydney-beach--c-21375909 (accessed 2026-03-29)
  - NSW Government Advisory (2026). https://www.nsw.gov.au/ministerial-releases/increased-bull-shark-activity-expected-around-beaches-and-waterways-following-heavy-rainfall (accessed 2026-03-29)
  - Heithaus, M.R. (2001). "Predator-prey and competitive interactions between sharks (Order Selachii) and dolphins (Suborder Odontoceti): A review." *Journal of Zoology*, 253, 53–68. https://zslpublications.onlinelibrary.wiley.com/doi/10.1017/S0952836901000061 (accessed 2026-03-29)
  - NSW SharkSmart. "About Sharks." https://www.sharksmart.nsw.gov.au/about-sharks (accessed 2026-03-29)
  - Meynecke, O., Scimex Expert Reaction (2026). https://www.scimex.org/newsfeed/expert-reaction-four-shark-attacks-off-nsw-beaches (accessed 2026-03-29)

---

## Factor 8: Sewage and Stormwater Overflow (Compound Rainfall Effect)

- **Risk mechanism:** Sydney's sewer system is partially combined — during heavy rain, stormwater infiltrates wastewater pipes, causing overflow of partially treated or raw sewage into creeks and rivers (e.g., Parramatta River, Cooks River, Throsby Creek in Newcastle) and ultimately into the surf zone. These overflows compound the ecological effect of rainfall-driven nutrient runoff: (1) they add a concentrated organic nutrient pulse (BOD, nitrogen, phosphorus) that accelerates phytoplankton and baitfish blooms; (2) they create persistent plumes of turbid, organic-rich water that persist longer than clean stormwater alone. Sydney Water has paid EPA penalties of $865,000+ for a single large sewage overflow event (2023). The Parramatta River Catchment overflow reduction plan (ourlivingriver.com.au) documents 37 overflow points discharging to the Parramatta River system alone. A 2025 study in *Discover Water* (Springer) confirmed combined sewer overflows substantially elevate organic nutrient loading and alter zooplankton communities in receiving urban waters.
- **Species specificity:** Bull shark (via prey aggregation mechanism). Not a direct attractant to sharks; rather it amplifies the prey-aggregation effect of rainfall events.
- **Measurable proxy:** (1) Sydney Water overflow event notifications (reported to NSW EPA, posted online but no real-time public API as of 2026-03-29); (2) Lagged rainfall >45 mm as a proxy for likely overflow trigger (Sydney Water states system overloads during heavy rain); (3) NSW EPA Beachwatch enterococci (bacterial contamination) readings as a downstream overflow indicator.
- **Data source:** Sydney Water overflow announcements: https://www.sydneywater.com.au/water-the-environment/what-you-can-do/avoid-wastewater-overflows.html; NSW EPA Beachwatch (enterococci monitoring, proxies overflow events); Parramatta River overflows map: https://www.ourlivingriver.com.au/our-plan/masterplan-dashboard/6-improve-overflows/
- **Threshold values:** No formal shark-risk threshold tied to sewage overflow in the literature. Treat as a **binary flag**: known overflow event at an upstream point (Parramatta River, Cooks River, Hunter River) within the prior 48 hours = elevated risk modifier (+0.05–0.10 on composite score).
- **Lag time:** Overflow plumes reach surf zones within 6–24 hours of a heavy rain event (storm surge and river flow dependent). Biological effects (baitfish bloom driven by nutrient pulse) lag 2–5 days.
- **Confidence level:** **Low** — mechanism is plausible and physically consistent with the rainfall-discharge-bull shark chain, but no peer-reviewed study directly links sewage overflow events to bull shark detections or bite incidents in NSW. Expert consensus attributes the effect to the compound nutrient-turbidity pulse rather than sewage per se.
- **Weight recommendation:** Not a standalone scored factor in the primary algorithm. Recommend as a **bonus flag** (equivalent to +10% on composite score when an overflow event is confirmed in the beach's upstream catchment within 72 hours).
- **Sources:**
  - NSW EPA (2023). "Sydney Water to pay over $865k after huge sewage overflow." https://www.epa.nsw.gov.au/News/Media-Releases/2023/EPAMedia230711-Sydney-Water-to-pay-over-$865k-after-huge-sewage-overflow (accessed 2026-03-29)
  - Parramatta River Masterplan: "Improve Overflows." https://www.ourlivingriver.com.au/our-plan/masterplan-dashboard/6-improve-overflows/ (accessed 2026-03-29)
  - Sydney Water. "Stormwater systems." https://www.sydneywater.com.au/water-the-environment/how-we-manage-sydneys-water/stormwater-network.html (accessed 2026-03-29)
  - Springer *Discover Water* (2025). "Ecological impacts of combined sewer overflows on receiving waters." https://link.springer.com/article/10.1007/s43832-025-00212-2 (accessed 2026-03-29)
  - NSW EPA Beachwatch. https://www.environment.nsw.gov.au/topics/water/beaches (accessed 2026-03-29)

---

## Algorithm Weight Summary

| Factor | Recommended Weight | Confidence | Real-time data available |
|---|---|---|---|
| 1. Rainfall (7-day cumulative) | 0.30 | High | Yes (BOM API) |
| 2. River discharge rate | 0.25 | Medium | Yes (WaterNSW API) |
| 3. Estuary proximity | 0.15 | High | Static (pre-computed) |
| 4. Sea surface temperature | 0.10 | High | Yes (Open-Meteo) |
| 5. Turbidity/visibility | 0.10 | Medium | Partial (Beachwatch; proxy via rainfall) |
| 6. Time of day | 0.10 | Medium | Yes (SunCalc) |
| 7. Food chain cascade | Multiplier (×1.2) | Medium | Partial (SharkSmart sightings) |
| 8. Sewage/stormwater overflow | Bonus flag (+0.05–0.10) | Low | Partial (Sydney Water announcements) |

**Note on weights:** Factors 1–6 sum to 1.00 and constitute the core bull shark sub-model score (0–1 range). Factors 7 and 8 are applied as post-scoring multipliers/bonuses, capping the final score at RED (1.0) and ensuring it cannot exceed the maximum tier by more than one step without at least two elevated primary factors.

---

## NSW Pilot Beach Estuary Mapping

| Beach | Nearest estuary/river | Approx. distance to mouth | Primary upstream catchment |
|---|---|---|---|
| Nobbys (Newcastle) | Hunter River mouth | ~500 m (Nobbys directly at Hunter River mouth) | Hunter Valley (Singleton gauge) |
| Manly | Manly Lagoon (direct drain to beach) | ~50 m (lagoon drains directly to Manly Beach) | Manly Lagoon/Warringah local catchment |
| Dee Why | Dee Why Lagoon (direct drain) | ~100 m | Dee Why/Narrabeen catchment |
| Nielsen Park | Sydney Harbour (Parramatta River system) | N/A — located within the harbour estuary itself | Parramatta River (Windsor/Penrith gauges) |
| Bondi | Cooks River (via Botany Bay) | ~10 km to Cooks River mouth; Bondi sits outside direct estuarine influence | No direct estuary; Bondi Ck is a minor creek only |

**Implication for risk scoring:** Nielsen Park and Nobbys carry the highest baseline estuary-proximity component. Manly and Dee Why carry elevated proximity scores due to direct lagoon drainage. Bondi carries the lowest proximity score among pilot beaches and should have a dampened bull shark estuary component, with rainfall/discharge factors dominating its risk curve.

---

## Key References (Full List)

1. Werry, J.M. & Sumpton, W. (2018). "Rainfall and sea surface temperature: key drivers for occurrence of bull shark, *Carcharhinus leucas*, in beach areas." *Global Ecology and Conservation*, 16, e00531. https://www.sciencedirect.com/science/article/pii/S2351989418302476

2. Smoothey, A.F. et al. (2023). "Bull Shark (*Carcharhinus leucas*) Occurrence along Beaches of South-Eastern Australia: Understanding Where, When and Why." *Biology*, 12(9), 1189. https://pmc.ncbi.nlm.nih.gov/articles/PMC10526001/

3. Werry, J.M. et al. (2019). "Long-term patterns of abundance, residency and movements of bull sharks (*Carcharhinus leucas*) in Sydney Harbour, Australia." *Scientific Reports*, 9, 19894. https://www.nature.com/articles/s41598-019-54365-x

4. Lubitz, N. et al. (2025). "Ocean warming increases residency at summering grounds for migrating bull sharks (*Carcharhinus leucas*)." *Science of the Total Environment*. https://www.sciencedirect.com/science/article/pii/S0048969725016067

5. Matich, P. et al. (2024). "Long-term effects of climate change on juvenile bull shark migratory patterns." *Journal of Animal Ecology*, 93, 1445–1461. https://besjournals.onlinelibrary.wiley.com/doi/10.1111/1365-2656.14140

6. Bradshaw, C.J.A. et al. (2022). "The Australian Shark-Incident Database for quantifying temporal and spatial patterns of shark-human conflict." *Scientific Data*, 9, 378. https://pmc.ncbi.nlm.nih.gov/articles/PMC9259633/

7. Heithaus, M.R. (2001). "Predator-prey and competitive interactions between sharks (Order Selachii) and dolphins (Suborder Odontoceti): A review." *Journal of Zoology*, 253, 53–68. https://zslpublications.onlinelibrary.wiley.com/doi/10.1017/S0952836901000061

8. NSW Government (2026). "Increased bull shark activity expected around beaches and waterways following heavy rainfall." https://www.nsw.gov.au/ministerial-releases/increased-bull-shark-activity-expected-around-beaches-and-waterways-following-heavy-rainfall

9. NSW SharkSmart. "Bull Shark Fact Sheet." https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0008/1447730/Bull-Shark-fact-sheet.pdf

10. NSW SEED Estuaries Dataset. https://datasets.seed.nsw.gov.au/dataset/estuaries12439

11. NSW SEED Estuary Drainage Catchments. https://datasets.seed.nsw.gov.au/dataset/estuary-drainage-catchmentseafb7
