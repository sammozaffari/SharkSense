# SharkSense — Predictive Shark Risk for NSW Ocean Users

## What Is SharkSense

SharkSense is a predictive shark risk intelligence platform that tells surfers, swimmers, and ocean users "how sharky is it?" before they enter the water. It combines environmental science data, shark detection information, and historical incident patterns into an actionable, glanceable risk assessment.

This is NOT an alert app (SharkSmart does that), NOT a sighting aggregator (Dorsal does that), NOT a research tracker (OCEARCH does that). It is a **risk intelligence layer** that synthesises all available data into a single assessment that a surfer can check at 5:30am before a dawn session.

---

## Why This Exists

On January 18-20, 2026, four people were attacked by sharks in NSW within 48 hours. A 12-year-old boy (Nico Antic) died from a bull shark bite at Nielsen Park in Sydney Harbour. A surfer at Manly lost his leg. An 11-year-old's board was bitten at Dee Why. A surfer at Point Plomer was bitten 450km north.

Every expert said the same thing: **the attacks were predictable based on environmental conditions.** Heavy rainfall flushed nutrients, baitfish, and bull sharks from rivers and estuaries onto Sydney's beaches. Water temperatures hit 27C offshore. Visibility dropped to near zero. Dawn, dusk, murky water, river mouths — every known risk factor was present simultaneously.

The $21.4M/year NSW Shark Management Program has drones, drumlines, listening stations, and tagging — but its SharkSmart app only shows **reactive alerts** (sharks already detected), not **predictive risk** (conditions that attract sharks). No existing tool synthesises environmental signals into a clear, actionable risk assessment.

---

## The Science — What Drives Shark Risk

### Bull Shark Risk Factors (Rainfall-Driven)

Bull sharks are the primary threat in the Sydney/NSW coastal region during summer. Their behaviour is tightly linked to freshwater inflows.

**Key environmental triggers:**
- **Rainfall**: Freshwater runoff flushes nutrients, baitfish, and bull sharks from rivers and estuaries into coastal waters. This is THE single strongest predictive signal. Risk peaks 3-5 days after heavy rain.
- **River discharge**: When rivers flow above baseline after rain, bull sharks leave rivers in large numbers simultaneously. The Hunter River, Parramatta River, and Middle Harbour Creek are key for NSW.
- **Estuary proximity**: Within 1km of a river mouth after rain = dramatically elevated risk.
- **Water temperature**: Bull sharks are more active above 19C, significantly more above 22C, peak at 23-24C. Active season is October-May (extended from the traditional Nov-Apr due to warming SST).
- **Turbidity**: Murky water after rain = higher risk. Bull sharks rely on electroreception rather than sight. It can take up to a week after heavy rain for water to clear.
- **Time of day**: Dawn and dusk are biologically higher risk periods. Statistical attack data shows most incidents at midday due to more people in the water.
- **Sewage/stormwater overflows**: After heavy rain, combined sewer overflows push nutrient-rich water into nearshore areas.

**The food chain cascade — a critical leading indicator:**
Whitebait schools -> mac tuna feeding on whitebait -> dolphins herding the tuna -> bull sharks following the dolphins and tuna. The visible presence of baitfish schools and dolphins IS the leading indicator that sharks are already present. Dolphin presence is a co-occurrence indicator, not an absence indicator for sharks.

### White Shark Risk Factors (Upwelling-Driven)

White shark risk is driven by fundamentally different environmental factors than bull shark risk. The model branches by species.

**Key environmental triggers:**
- **Upwelling events**: Cold, nutrient-rich water rising from depth triggers plankton blooms -> baitfish aggregation -> sharks. Detectable as a sudden SST drop of 3C+ in nearshore waters compared to offshore. Risk peaks 7-14 days after the event.
- **Sea surface temperature**: White sharks are most active in 14-22C water, foraging optimum 14-18C.
- **Seal colonies**: White sharks follow seal populations. Montague Island (NSW south coast) peaks at 700+ animals in winter breeding season.
- **Migration patterns**: White sharks move along the NSW coast seasonally, peak May-November (highest Sep-Nov).
- **Historical incident patterns**: The Australian Shark-Incident Database shows species-specific hotspots, particularly the Ballina/Byron Bay corridor.

### Additional Risk Factors (Both Species)

- **Tidal state**: High tide allows sharks closer to shore. Tidal state is the #1 environmental predictor for white shark predation events.
- **Moon phase**: Lunar illumination >50% correlates with above-expected attacks.
- **Wind direction**: Onshore wind pushes turbid water onto beaches.
- **Swell size and period**: Large swells stir up sediment and reduce visibility.
- **Season**: 71% of Australian shark attacks over the past 20 years occurred between November and April.

---

## Risk Levels

- **GREEN**: Low risk. Environmental conditions don't favour shark presence. No recent rainfall, clear water, no detections nearby.
- **AMBER**: Elevated risk. One or more factors present. Moderate rainfall in the past week, warm water near an estuary, or a detection within range.
- **RED**: High risk. Multiple strong factors aligned. Heavy recent rainfall + warm turbid water + near estuary + active detections. The January 2026 cluster would score RED.

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

## Target Users

- Surfers checking conditions before dawn sessions
- Swimmers at harbour and ocean beaches
- Parents deciding on beach trips with kids
- Lifeguards and surf clubs augmenting existing intel

---

## Research References

- **Lubitz et al. (2025)**: Bull sharks increasing residency time off Sydney (+1 day/year over 15 years)
- **Riley et al. (2022)**: Australian Shark-Incident Database (Nature Scientific Data)
- **Huveneers et al. (2024)**: Shifts in shark bite incidence in NSW; nets show no detectable effect post-2000
- **Werry & Sumpton (2018)**: >=100mm catchment rainfall = bull shark presence 1-8 days later
- **Smoothey et al. (2023)**: >=45mm rain + >20C SST thresholds for SE Australian beaches
- **Hammerschlag et al. (2006)**: Tidal state as #1 white shark predation predictor
- **French et al. (2021)**: Lunar illumination >50% correlates with above-expected attacks
- **Raoult (Griffith University)**: Up to a week after heavy rain for water to clear

Full research findings: `research/` directory (10 documents, 322 KB)
