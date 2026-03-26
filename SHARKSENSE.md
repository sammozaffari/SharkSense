# SharkSense — Predictive Shark Risk Platform for NSW Ocean Users

## Claude Code Project Prompt

---

## Project Overview

SharkSense is a predictive shark risk intelligence platform that tells surfers, swimmers, and ocean users "how sharky is it?" before they enter the water. It combines environmental science data, shark detection information, historical incident patterns, and (eventually) community intelligence into an actionable, glanceable risk assessment.

This is NOT an alert app (SharkSmart does that), NOT a sighting aggregator (Dorsal does that), NOT a research tracker (OCEARCH does that). It is a **risk intelligence layer** that synthesises all available data into a single assessment that a surfer can check at 5:30am before a dawn session.

---

## Why This Exists

On January 18–20, 2026, four people were attacked by sharks in NSW within 48 hours. A 12-year-old boy (Nico Antic) died from a bull shark bite at Nielsen Park in Sydney Harbour. A surfer at Manly lost his leg. An 11-year-old's board was bitten at Dee Why. A surfer at Point Plomer was bitten 450km north.

Every expert said the same thing: **the attacks were predictable based on environmental conditions.** Heavy rainfall flushed nutrients, baitfish, and bull sharks from rivers and estuaries onto Sydney's beaches. Water temperatures hit 27°C offshore. Visibility dropped to near zero. Dawn, dusk, murky water, river mouths — every known risk factor was present simultaneously.

The $24M NSW Shark Management Program has drones, drumlines, listening stations, and tagging — but its SharkSmart app only shows **reactive alerts** (sharks already detected), not **predictive risk** (conditions that attract sharks). No existing tool synthesises environmental signals into a clear, actionable risk assessment.

---

## The Science — What Drives Shark Risk

### Bull Shark Risk Factors (Rainfall-Driven)

Bull sharks are the primary threat in the Sydney/NSW coastal region during summer. Their behaviour is tightly linked to freshwater inflows.

**Critical research finding:** A peer-reviewed study using Queensland Shark Control Program data (1996–2007, published in Global Ecology and Conservation) demonstrated that bull shark presence in beach areas is driven by rainfall. ≥100mm total rainfall in the catchment associated with each beach is significantly correlated with increased bull shark catch 1–8 days after the rainfall. This was confirmed by acoustic tagged shark movements between estuarine and beach areas.

**Key environmental triggers for bull sharks:**
- **Rainfall in the last 24–72 hours**: Freshwater runoff flushes nutrients, baitfish, and bull sharks from rivers and estuaries into coastal waters. This is THE single strongest predictive signal.
- **River discharge rates**: When rivers are flowing above baseline after rain, bull sharks leave rivers in large numbers simultaneously (not gradually over months). The Hunter River, Parramatta River, and Middle Harbour Creek are key for NSW.
- **Proximity to river mouths/estuaries**: Within 1km of a river mouth after rain = dramatically elevated risk.
- **Water temperature**: Bull sharks are more active above 19°C, significantly more active above 22°C, and very active above 24°C. They are most active in warmer months (November–April).
- **Water visibility/turbidity**: Murky water after rain = higher risk. Bull sharks feed by bite in low visibility — they rely on electroreception rather than sight.
- **Time of day**: Dawn and dusk are biologically higher risk periods due to shark feeding patterns and low-light hunting advantages. However, statistical attack data shows most incidents at midday when more people are in the water. Weight this factor moderately.
- **Sewage/stormwater overflows**: After heavy rain, combined sewer overflows push nutrient-rich water into harbour and nearshore areas. Sydney Water publishes overflow event data.

**The food chain cascade — a critical leading indicator:**
Joel Nancarrow (Hunter Shark Jaw Restoration, 195K Facebook followers, based in Newcastle) documents this consistently: whitebait schools → mac tuna feeding on whitebait → dolphins herding the tuna → bull sharks following the dolphins and tuna. The visible presence of baitfish schools and dolphins IS the leading indicator that sharks are already present.

**Time to clear after rain:** Marine ecologist Vincent Raoult stated it can take up to a week after heavy rain for the water to clear and for the threat of bull sharks to ease.

### White Shark Risk Factors (Upwelling-Driven)

White shark risk is driven by different environmental factors than bull shark risk. The model must branch by species.

**Key environmental triggers for white sharks:**
- **Upwelling events**: Cold, nutrient-rich water rising from depth to the surface triggers plankton blooms → baitfish aggregation → sharks. Detectable as a sudden SST drop of 3°C+ in nearshore waters compared to offshore.
- **Sea surface temperature**: White sharks are most active in 15–22°C water.
- **Seal populations and proximity**: White sharks follow seal colonies.
- **Migration patterns**: White sharks move along the NSW coast seasonally (peak May–November).
- **Historical incident patterns**: The Australian Shark-Incident Database shows species-specific hotspots.

### Additional Risk Factors (Both Species)

- **Moon phase**: Affects tidal range and feeding patterns.
- **Tide state**: Certain tide states concentrate bait near shore.
- **Wind direction**: Onshore wind pushes turbid water onto beaches.
- **Swell size and period**: Large swells can stir up sediment and reduce visibility.
- **Season**: 71% of Australian shark attacks over the past 20 years occurred between November and April.

---

## Data Sources and APIs

### Tier 1: Critical (Must Have for MVP)

1. **WaterNSW Real-Time River Discharge API** — `https://realtimedata.waternsw.com.au/cgi/webservice.pl`
2. **Open-Meteo Weather API** — `https://api.open-meteo.com/v1/forecast`
3. **Open-Meteo Marine API** — `https://marine-api.open-meteo.com/v1/marine`
4. **NSW SEED Estuaries Dataset** — GIS data for NSW estuaries
5. **Australian Shark-Incident Database (ASID)** — Historical incidents

### Tier 2: Important

6. **BOM Rainfall Observations**
7. **SunCalc.js** (client-side)
8. **Tide Predictions**

---

## Technical Architecture

- **Frontend:** Next.js 14+ (App Router) + React + Tailwind CSS
- **Map:** Mapbox GL JS
- **Data fetching:** Client-side with localStorage caching (30-min TTL)
- **WaterNSW proxy:** Vercel Edge Function
- **Deployment:** Vercel (free tier)
- **No backend database for MVP**

---

## Risk Scoring Algorithm

Three levels: GREEN (<0.35) / AMBER (0.35-0.65) / RED (>=0.65)

**Bull shark weights:** rainfall 0.30, discharge 0.25, estuary proximity 0.15, temp 0.10, visibility 0.10, time-of-day 0.10

**White shark weights:** upwelling 0.30, detection 0.20, temp 0.20, historical 0.15, season 0.15

---

## Pilot Beaches

| Beach | Nearest Estuary | Key Risk Profile |
|-------|-----------------|------------------|
| Manly / North Steyne | Middle Harbour Creek | Bull shark after rain |
| Dee Why | Dee Why Lagoon outlet | Both bull and white |
| Nielsen Park / Shark Beach | Sydney Harbour (Parramatta River) | Bull shark, harbour |
| Bondi | Minor stormwater only | Baseline comparison |
| Newcastle / Nobbys | Hunter River | Bull shark, major estuary |

---

## Key Research References

- **Lubitz et al. (2025)**: Bull sharks increasing residency time off Sydney
- **Riley et al. (2022)**: Australian Shark-Incident Database (Nature Scientific Data)
- **Huveneers et al. (2023)**: Shifts in shark bite incidence in NSW
- **Queensland Shark Control Program study (2018)**: ≥100mm rainfall = bull shark presence
- **Raoult (Griffith University)**: Up to a week after heavy rain for water to clear

---

*Compiled from research across 80+ sources. Last updated March 2026.*
