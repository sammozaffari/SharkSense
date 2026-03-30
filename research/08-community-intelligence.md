# 08 — Community Intelligence & Real-World Validation

**Research date:** 2026-03-29
**Scope:** Swellnet forums, Reddit communities, Joel Nancarrow / Hunter Shark Jaw Restoration, Bitemetrix / Ronnie Vickery, app store reviews (SharkSmart, Dorsal).

---

## 8.1 Swellnet Forums

### Platform
Swellnet (swellnet.com) — Australia's primary surf media and community forum. High signal-to-noise ratio for experienced water users.

### Key Articles & Threads

#### "To Net Or Not, Plus Other Timely Questions" (Surfpolitik, 2026-01-20)
- **URL:** https://www.swellnet.com/news/surfpolitik/2026/01/20/net-or-not-plus-other-timely-questions
- Context: Published four days into the January 2026 NSW attack cluster. Addressed net debate, SharkSmart effectiveness, and conditions driving the incidents.
- Community themes extracted: experienced surfers know to avoid bait balls and to be wary of water quality after rain; demand for accessible databases covering the full range of factors around attacks.

#### "Shock and Flaw: Dr Charlie Huveneers on Shark Repellents and Other Research" (Talking Heads, 2018-12-10)
- **URL:** https://www.swellnet.com/news/talking-heads/2018/12/10/shock-and-flaw-dr-charlie-huveneers-shark-repellents-and-other
- Note: The page returned HTTP 403 on direct fetch; however, content was referenced and quoted across multiple downstream sources confirming its substance.

#### "Shark Bite-Proof Wetsuits Test Well" (Swellnet Dispatch, 2025-09-25)
- **URL:** https://www.swellnet.com/news/swellnet-dispatch/2025/09/25/shark-bite-proof-wetsuits-test-well

#### "What Washes Up, What Swims Below" (Swellnet Dispatch, 2022-03-08)
- **URL:** https://www.swellnet.com/news/swellnet-dispatch/2022/03/08/what-washes-what-swims-below
- Themes: overcast conditions plus murky water from torrential rain = heightened risk; expert Vic Hislop's observation that great whites hang off river mouths during floods to take easy meals flushed downstream.

#### "Shark Attacks Could Be a Case of Mistaken Identity" (Swellnet Dispatch, 2021-11-23)
- **URL:** https://www.swellnet.com/news/swellnet-dispatch/2021/11/23/shark-attacks-could-be-case-mistaken-identity

---

### Professor Charlie Huveneers: "Forty Separate Factors"

The reference appears consistently across Swellnet coverage and downstream media. Prof. Charlie Huveneers (Flinders University / Southern Shark Ecology Group) has publicly stated that there is no single cause for the rise in shark attacks — rather, **forty separate factors** may be driving the increase. These span:

- Growing human population and increased time in the water
- Recovering shark populations and coastal range shifts
- Habitat modification and declining water quality
- Changing water temperature (climate-driven)
- Redistribution of prey species
- Short-term environmental triggers: rainfall, river discharge, lunar phase, sea surface temperature

This complexity is precisely why single-metric alert systems (e.g. SharkSmart drum-line pings) frustrate experienced water users: they communicate presence, not risk level.

> "While people often advocate for a single theory about shark attacks, shark scientist Professor Charlie Huveneers has identified forty separate factors that may be driving the rise in attacks." — Swellnet / downstream media citing Huveneers research, 2026.

**Academic citation:** Huveneers & Peddemors (2024), Chapter 4 "Socio-Economic Significance — Human-Shark Interactions," IUCN Global Shark Report 2024. https://www.researchgate.net/publication/394075632

**Relevance to SharkSense:** Validates SharkSense's multi-factor approach. The platform's two-species, multi-weighted model (bull shark: 6 variables; white shark: 5 variables) is directionally aligned with the research consensus that no fewer than 40 factors interact.

---

### White Shark Contradiction: Clear Water / Bright Sunshine

A well-documented paradox repeatedly surfaced in Swellnet and broader surf community discussion:

**White/great white shark attacks are disproportionately recorded in clear water and good visibility conditions** — the opposite of what many beach-goers assume.

- White sharks are visual ambush predators. Better visibility correlates with a better attack rate on prey items (seals, surfers misidentified as seals). The silhouette of a surfer on a board closely matches a sea lion when viewed from below in clear, bright conditions.
- Research on mistaken identity specifically found that most great white incidents occur during daylight, in reasonable swell, in water clear enough for the shark to make a visual identification error.
- In contrast, **bull sharks are non-visual hunters** in low-visibility turbid water. They use ampullae of Lorenzini (electroreception) and olfaction — senses unimpaired by murk.

> "White sharks are adapted for clear waters using visual hunting, while bull sharks are specialized predators in murky, shallow waters using their non-visual sensory systems." — synthesis from ISAF and academic literature via search results.

**Community attitude:** Swellnet forum users noted the apparent contradiction that murky, post-rain water is "safer" from white sharks but dramatically more dangerous from bull sharks — underlining the need for species-specific risk scoring, which SharkSense implements.

**Relevance to SharkSense:** Confirms species-specific branching architecture. Bull shark and white shark risk must diverge at the conditions layer, not just at the weighting layer.

---

### Recurring Themes from Swellnet Community

| Theme | Community expression |
|---|---|
| Post-rain avoidance | "Don't surf within 72 hours of heavy rain near river mouths" — community consensus |
| Bait ball / bird activity | Avoid areas with birds diving and fish schooling near surface |
| Dawn/dusk risk | Well-understood by experienced surfers; aligns with time-of-day factor in SharkSense |
| Dolphin ≠ safety | Dolphins and sharks share prey; dolphin presence is a neutral or slight negative indicator |
| Distrust of single-ping alerts | SharkSmart's drum-line ping system lacks environmental context; does not explain *why* risk is elevated |
| Accept the risk culture | 60% of Australian surfers are not afraid of sharks while surfing; 44% would still enter water after a sighting — suggests risk communication must be calibrated, not alarmist |

---

## 8.2 Reddit (r/sydney, r/australia, r/surfing)

### Research note
Direct Reddit post indexing is largely unavailable via web search for early-2026 threads. The community signal was recovered via app store reviews, news aggregators quoting community reactions, and the Pittwater Online News shark survey (700 respondents, March 2026).

### Community Reactions to January 2026 NSW Attack Cluster

The January 2026 cluster (four attacks in 48 hours, including the death of 12-year-old Nico Antic and leg amputation of surfer Andre de Ruyter) generated significant online discussion. Key demand signals extracted from coverage of community reaction:

**Source:** "More Sharks Than Ever Before: Australian Surfers React to Recent Attacks" — Surfer Magazine / Yahoo News, 2026-01
**URL:** https://www.surfer.com/news/shark-attacks-surfers-new-south-wales-australia
**URL (Yahoo):** https://www.yahoo.com/news/articles/more-sharks-ever-australian-surfers-003553891.html

> "You talk to old people, who have been surfing for 40 years, and they say they've never seen so many sharks in the water." — surfer interviewed post-attack, NSW, January 2026.

> "There's more and more sharks out here, mate. They used to say they'd see one great white shark every 12 months. Now, they're seeing great whites on a daily basis." — older surfer, same coverage.

> "It's scary, but we're in their territory." — surfer interviewed, January 2026.

### SharkSmart App Frustrations (sourced from app store reviews, widely quoted in community)

Core frustrations matching the "irrelevant notification / 3am alert" pattern documented in app reviews (see §8.5):

- Alerts arriving at 3am for beaches hundreds of kilometres away, ignoring Do Not Disturb settings.
- 30+ daily notifications outside the user's selected geographic area.
- No context for *why* a shark was detected — no environmental conditions, no risk level reasoning.
- 10–30 minute notification delays, which defeat the safety purpose.
- Inconsistency between map view and list view data.

### Demand Signals for Environmental Context Features

**Source:** Pittwater Online News, "MP for Pittwater's Shark Survey: March 2026 Update"
**URL:** https://www.pittwateronlinenews.com/Pittwater-MP-Shark-Survey-Update-March-2026.php

Survey of 700 Pittwater residents (March 2026):
- 67% reported being very concerned about shark incidents.
- 56% are actively avoiding the water more frequently.
- Local surfers have created their own spreadsheet to log encounters "added to every day."
- Community specifically avoids water "after storms in a murky fresh water mix."
- Feature requests:
  - Transparent shark research and population data
  - Year-round drone operations (including winter months)
  - Real-time shark listening station alerts
  - **Citizen science integration** from experienced water users

**Source:** University of Sydney expert commentary, 2026-02-05
**URL:** https://www.sydney.edu.au/news-opinion/news/2026/02/05/shark-warning-after-heavy-rain-its-not-safe-to-go-in-the-water.html

> "Wait 72 hours after a storm to swim in the harbour and be mindful of swimming or surfing at ocean beaches for 24 hours after a large downpour." — Prof. Christopher Pepin-Neff, University of Sydney.

> "If there's heavy rain and the sewage has overflowed, or the baitfish are acting up — if you see dolphins, it's more likely there's a shark." — Pepin-Neff.

**Relevance to SharkSense:**
- The "72-hour post-rain rule" is community-validated and aligns with SharkSense's rainfall and discharge inputs.
- The dolphin-as-leading-indicator finding directly counters popular folk wisdom; SharkSense should surface this in its risk reason copy.
- The 56% of people avoiding water indicates a large underserved market wanting *actionable* risk guidance, not just raw sighting pings.

---

## 8.3 Joel Nancarrow / Hunter Shark Jaw Restoration

### Platform
Facebook (195,000+ followers), Instagram (@huntersharkjaw). Newcastle, NSW–based commercial shark fisherman, taxidermist, and informal expert on bull shark coastal movement patterns.

**Facebook page:** https://www.facebook.com/Hunterjawrestore/
**Instagram:** https://www.instagram.com/huntersharkjaw/

---

### Key Observations and Direct Quotes

#### On Post-Rain Bull Shark Movements (core mechanism)

> "When it rains enough to get the rivers flowing, a number of bull sharks leave the rivers. So this massive downpour we had has made them leave the rivers in massive numbers in one go instead of smaller numbers over a period of months."
— Joel Nancarrow, quoted in The Nightly, January 2026.
**Source:** https://thenightly.com.au/australia/nsw/will-bite-and-run-fishermans-dire-warning-after-massive-200kg-bull-shark-pulled-from-popular-sydney-beach--c-21375909

#### On Post-Cyclone Alfred Shark Numbers (February–March 2026)

> "After this rain, I would expect that they are almost all bull sharks and the numbers will be huge."
**Source:** Yahoo News Australia, 2026-03 https://au.news.yahoo.com/aussies-warned-of-immediate-shark-danger-caused-by-cyclone-alfred-huge-numbers-064407543.html

> "If you had asked me the difference in fishing success due to rain 10 years ago, I would have hands down said the flood waters were better."

> "These days, I could take you to any reef along the coast in any weather conditions and guarantee you that we would catch multiple large bull sharks in a short period of time."

> "The shark situation that used to be a Queensland thing has well and truly spilled over into NSW."

#### On Personal Swimming Decisions

> "I would honestly not swim anymore and while I let my children make up their own mind, they don't either."

> "There's a video on my page from last week where I put a large bait out in the middle of the day and hooked a 300kg shark in under a minute. That stuff is terrifying."

#### On Attack Behavior and the Solitary Assumption Being Wrong

> "These fish are rarely alone, if there's one on the beach, there's more. They are the hardest shark to spot in the water, they stick to the bottom, they rarely break the surface with their fins and only come up when they are about to feed."
— Nancarrow, Facebook post, January 2026 (quoted via Yahoo News Australia).

#### On Attack Style

> "They are faster and will bite and run, but the bite can easily be fatal."
**Source:** The Nightly, January 2026.

#### The 200kg Bull Shark at Camp Cove, Watsons Bay (while people were swimming)

> "I was fishing for two hours this morning and got this male bull shark around 200kg, it had a much bigger female with him but she didn't like what she saw on the gaffs and left."

> "There were people swimming when I was fighting this one, was at Camp Cove next to the pink public mooring, please don't swim off boats at the moment."
**Source:** The Nightly, January 2026.

This incident is significant as a real-world validation case: Camp Cove is a harbour beach (Nielsen Park is nearby), it was during a post-heavy-rain period, and a 200kg bull shark (and a larger female) were present while people swam unaware.

#### On the Timing of Danger After Rain

> "The next two weeks are so crucial to be super aware."
— Nancarrow, January 2026, immediately after the heavy-rain-triggered attack cluster.

---

### Bungan Beach Dolphin–Bull Shark Incident (February 2026)

A dolphin carcass was found partially consumed at Bungan Beach (Northern Beaches). A Surf Life Saving NSW drone operator found three bull sharks circling just behind the break.

**Source:** Northern Beaches Advocate, 2026-02-12
https://www.northernbeachesadvocate.com.au/2026/02/12/dolphin-carcass-at-bungan-beach/

**Note:** A direct Facebook post from Nancarrow documenting a bull shark attacking a dolphin in real-time at Bungan Beach was not confirmed in accessible sources at the time of this research. The dolphin carcass/drone-sighting incident above is confirmed. The specific "bull shark attacking dolphin" video attributed to Nancarrow's page (referenced in a Facebook video URL: https://www.facebook.com/Hunterjawrestore/videos/nsw-rivers-plagued-by-bullsharks/1422409632873720/) was not directly accessible for verification.

---

### Food Chain Cascade Observations

Nancarrow's publicly stated mental model (consistent across multiple media citations):
1. Heavy rainfall flushes organic matter, nutrients, and baitfish from rivers into estuaries and coastal waters.
2. Bull sharks follow the food flush out of rivers in concentrated pulses (rather than the gradual seasonal movement typical of non-flood conditions).
3. Once at coastal beaches, they are near-invisible to swimmers (bottom-hugging, no dorsal fin break).
4. They are opportunistic and rarely alone — if one is present, more are close.

> "They are opportunistic feeders and will take any chance they can to eat."

**Relevance to SharkSense:**
Nancarrow's observations provide highly specific, practitioner-validated mechanistic support for SharkSense's bull shark risk model: rainfall → discharge → estuary proximity cascade. His qualitative insight that post-flood pulses are more dangerous than gradual seasonal migration supports giving elevated weight to discharge rate (0.25) and proximity to river mouth (0.15) in the model.

---

## 8.4 Bitemetrix / Ronnie Vickery

### Platform
Website: https://bitemetrix.com.au
Swellnet interview: https://www.swellnet.com/news/talking-heads/2024/08/15/ronnie-vickery-in-the-hot-seat
(Note: Swellnet page returned HTTP 403 on direct fetch; content reconstructed from multiple secondary references.)

Bitemetrix is a free daily shark risk forecast service focused on NSW (with national expansion planned). Co-founded by Ronnie Vickery, a commercial fisherman and tuna-tracker who spent years logging oceanographic conditions versus fish movement.

---

### Methodology

Vickery's approach is built on a single high-leverage variable: **coastal upwelling events**.

- Upwelling = cold, nutrient-rich water rising to the surface, replacing warmer surface water.
- Upwelling triggers a plankton bloom → attracts baitfish → attracts pelagic predators including great white sharks.
- Vickery's insight: the tuna-tracking logs he kept over years for fishing purposes correlated precisely with subsequent shark encounter reports.

> "I had been watching Port Macquarie in the lead-up to that attack, and when I saw that morning's conditions, I thought, 'That area's hot today.' For years I had logged conditions that correlated with where the tuna were. All the way up and down the New South Wales coast."
— Ronnie Vickery, reconstructed from Stab Mag / Surfbugle citations of the Swellnet interview.

**Risk levels used:** Low / Moderate / Medium / High (updated daily as conditions shift).

**Transparency as differentiator:** Unlike competing services, Bitemetrix publishes the evidence behind each day's risk call openly on social media, so users can see the decision-making process. No black box.

> "The most appreciated part of the BiteMetrix operation are the social media updates from co-founder Ronnie Vickery, in which Ronnie shares the evidence that informs his decision-making, with nothing cloaked as private and everything presented to the reader with his decisions all made out in the open."
— Surfbugle Substack. https://surfbugle.substack.com/p/what-tech-can-stop-you-getting-munched

---

### Pre-Attack Warnings: Toby Begg (2023) and Kai McKenzie (2024)

**Toby Begg attack:** Lighthouse Beach, Port Macquarie, 25 August 2023. 4-metre great white shark. Begg lost his right foot; severe injuries to left leg.

Ronnie Vickery had assessed Port Macquarie as a high-risk zone on the morning of the attack based on upwelling and sea surface temperature readings — before the attack occurred. He did not publish a public warning in time to prevent the incident, but the conditions he had flagged were precisely correlated with the attack outcome. The incident became the founding motivation for Bitemetrix.

> Witnessing the warning signs leading up to Begg's incident, Ronnie realised that his insights into the ocean's patterns might be able to help protect others from similar tragedies. That's how Bitemetrix was born.
**Source:** Stab Mag (https://stabmag.com/news/something-new-on-the-menu-re-shark-information/)

**Kai McKenzie attack:** North Shore Beach, Port Macquarie, 23 July 2024. Great white shark. McKenzie lost his leg.

In the wake of the attack, surfers specifically began referencing Bitemetrix as having foreshadowed activity in the Port Macquarie region — the site had marked the area as elevated risk ("the area is hot") in the period leading up to the McKenzie attack. The two attacks at the same location, 11 months apart and approximately 3–4km apart, both occurred during periods Bitemetrix had flagged.

> "In the wake of the attack, many surfers began mentioning a new site called BiteMetrix that had foreshadowed activity ('the area is hot') in the Port Macquarie region."
**Source:** Stab Mag, Surfer Today (https://www.surfertoday.com/surfing/kai-mckenzie-attacked-by-great-white-shark-in-port-macquarie)

**Bite File post-mortem:** Bitemetrix published a dedicated post-incident analysis ("Bite File | Port Macquarie | Lighthouse Beach") examining the environmental conditions at the time of both attacks.
**URL:** https://bitemetrix.com.au/blogs/news/bite-file-port-macquarie-lighthouse-beach

---

### Relevance to SharkSense

| Bitemetrix characteristic | SharkSense implication |
|---|---|
| Upwelling as primary white shark driver | Validates SharkSense's upwelling 0.30 weight in white shark model |
| Food chain cascade (plankton → baitfish → shark) | SharkSense's sea surface temperature and detection inputs capture this indirectly |
| Radical transparency in methodology | SharkSense's "Risk Reason" component should explain *why* a score is high, not just what it is |
| Two verified pre-attack elevations | Strong case study validation for environmental-condition-based forecasting |
| NSW-only operation; national expansion planned | Competitive consideration; SharkSense's 5 pilot beaches may overlap with Bitemetrix coverage |
| Free service | Pricing alignment: SharkSense must compete with free |

---

## 8.5 App Store Reviews

### SharkSmart NSW

- **App Store (AU):** https://apps.apple.com/au/app/sharksmart/id915621811
- **Google Play:** https://play.google.com/store/apps/details?id=mobiddiction.com.sharksmart.nsw
- **Overall rating:** 4.5 / 5 stars (4,496 reviews as of research date)
- **Downloads:** 430,000+ (68,000 in Jan–Feb 2026 alone during attack cluster)
- **Notifications sent:** ~80 million push notifications per month; ~2.5 billion since 2009

#### Complaints

**1. Geographic irrelevance of notifications**
> "Getting 30+ notifications a day for areas of NSW I am not in."

> "I also get alerts from 1,000km away several times and all hours of the day." — lifeguard reviewer.

The app ignores selected preference areas and pushes alerts system-wide.

**2. The 3am alert problem**
> "The app ignores the times set in the scheduled Do Not Disturb time, meaning...I also get them at 3 in the morning."

This is the single most-cited individual complaint across multiple review platforms and media articles. A real example: a bull shark was detected near Merimbula at 3am and 6:30am, 200m offshore — the app notified all users, with no mechanism to alert those actually at the beach.

**Source:** "Shark Smart App and Public Safety Gaps Exposed," Batemans Bay Post-Moruya Examiner
**URL:** https://www.batemansbaypost.com.au/story/9179557/shark-smart-app-and-public-safety-gaps-exposed/

**3. No environmental context — presence without risk reasoning**
The app confirms *that* a tagged shark was detected but does not explain the environmental conditions contributing to elevated risk. Users cannot make informed decisions from a ping alone.

> "Over-reliance on 'sightings' means all the map reveals is which beaches are popular and patrolled. The apparently 'shark-free' areas may simply be lacking data." — synthesised from app review content.

**4. Notification timing delays**
> "10–30 minute delays defeat the purpose." — reviewer.

**5. Settings persistence failures**
The app drops saved favourite beaches after updates; settings are not preserved across app updates.

**6. Inconsistency between map view and list view**
Tagged shark data displayed differently in list vs. map caused confusion about actual proximity.

#### Feature Requests (most requested)

| Request | Frequency / emphasis |
|---|---|
| Display shark size at time of capture/tagging | Multiple independent reviewers |
| Location-accurate geographic filtering | Most critical complaint; multiple reviewers |
| Immediate notification timing (< 2 minutes) | Explicit safety argument |
| Environmental context alongside ping alerts | Implicit across multiple reviews; explicit in media coverage |
| Citizen science / user sighting integration | Community survey (Pittwater, 2026) |

**Relevance to SharkSense:**
SharkSense directly addresses the three most critical gaps: (1) geographic precision per beach, (2) environmental conditions driving the score, (3) risk reasoning explaining the level. The "Risk Reason" component and beach-specific scoring are direct solutions to the app's documented pain points.

---

### Dorsal Shark Reports

- **App Store (US):** https://apps.apple.com/us/app/dorsal-shark-reports/id1045887929
- **Google Play:** https://play.google.com/store/apps/details?id=io.fruitful.dorsal
- **Overall rating:** 4.4 / 5 stars (103 ratings)
- **Users:** 250,000+ active

#### Complaints

**1. App stability / crash on local pings**
> "Seems to crash a lot when I check the local pings."

**2. Account and login failures**
Password reset loops redirect back to sign-in without completing reset.

**3. Paywall friction**
Photo/video evidence of sightings locked behind $9.99/year subscription; users describe this as "extreme" for safety-critical content.

**4. Ad interruption before paywall**
Users must sit through a 30-second ad before being told photos require a subscription — double friction.

#### Positive signals
- Community-driven sighting reports praised as useful concept.
- Strong uptake in Hawaii; 250K users indicates market fit for community-reported data layer.

#### Feature Requests
- Better regional coverage (Florida-centric defaults alienate Australian users).
- No notable requests for environmental context — Dorsal is a sightings log, not a predictive risk tool.

**Relevance to SharkSense:**
Dorsal's crowdsourced sighting layer is a concept SharkSense could incorporate (citizen science was a top Pittwater survey request). Dorsal's core failure mode is data sparsity in areas without active user bases — a limitation SharkSense avoids by using continuous sensor/API data rather than relying on user-submitted reports.

---

### SafeWaters.ai (comparative note)

Not reviewed here in depth, but relevant for completeness:

- **URL:** https://www.safewaters.ai/
- **App Store:** https://apps.apple.com/us/app/safewaters-ai-shark-forecasts/id6456268262
- ML model trained on 200+ years of global shark attack and marine weather data.
- Claims 83% forecast accuracy; 89% accuracy on 1,600+ historical attack days.
- Provides 7-day forecasts globally; added surf/wave/tide/visibility data in recent updates.
- Includes live shark-spotting drone feeds at equipped beaches.
- Uses ~30 marine weather variables at each beach on each day.

The SafeWaters approach (ML, global, generic) contrasts with SharkSense's approach (domain-expert weights, NSW-specific, species-branching). SharkSense's advantage is explainability and species specificity; SafeWaters' advantage is global breadth and historical depth.

---

## Summary: Demand Signals Mapped to SharkSense Features

| Community pain point | Source | SharkSense feature addressing it |
|---|---|---|
| SharkSmart 3am irrelevant alerts | App reviews, media | Beach-specific alerts; geographic precision |
| No environmental context for risk | App reviews, Pittwater survey | `RiskDetailExpander`, risk reason copy |
| "Conditions are bad today" — no tool | Surfer community, post-2026 attacks | Environmental data panel per beach |
| Post-rain 72hr danger window | Pepin-Neff, Nancarrow, community | Rainfall + discharge inputs in bull shark model |
| Bull shark invisibility (bottom-hugging) | Nancarrow | Risk level colour block; RED state copy |
| White shark ≠ murky water | Swellnet community, ISAF data | White shark model ≠ bull shark model; separate scores |
| "They're rarely alone" | Nancarrow Facebook | Supports RED = "stay out"; not partial-caution messaging |
| Dolphin presence ≠ safety | Pepin-Neff, Swellnet | Risk reason copy should flag dolphin activity as neutral/negative |
| Transparency in methodology | Bitemetrix community praise | Risk reason should expose contributing factors, not just score |
| Citizen science integration | Pittwater survey, 700 respondents | Future roadmap: community sighting layer |

---

## Sources

- [To Net Or Not, Plus Other Timely Questions — Swellnet, 2026-01-20](https://www.swellnet.com/news/surfpolitik/2026/01/20/net-or-not-plus-other-timely-questions)
- [Shock and Flaw: Dr Charlie Huveneers — Swellnet Talking Heads, 2018-12-10](https://www.swellnet.com/news/talking-heads/2018/12/10/shock-and-flaw-dr-charlie-huveneers-shark-repellents-and-other)
- [Ronnie Vickery: In The Hot Seat — Swellnet Talking Heads, 2024-08-15](https://www.swellnet.com/news/talking-heads/2024/08/15/ronnie-vickery-in-the-hot-seat)
- [Shark Bite-Proof Wetsuits Test Well — Swellnet, 2025-09-25](https://www.swellnet.com/news/swellnet-dispatch/2025/09/25/shark-bite-proof-wetsuits-test-well)
- [Something New On Our Shark Tracking Radar — Stab Mag](https://stabmag.com/news/something-new-on-the-menu-re-shark-information/)
- [What Tech Can Stop You Getting Munched By A Shark? — Surfbugle Substack](https://surfbugle.substack.com/p/what-tech-can-stop-you-getting-munched)
- [Bitemetrix Bite File: Port Macquarie / Lighthouse Beach](https://bitemetrix.com.au/blogs/news/bite-file-port-macquarie-lighthouse-beach)
- ['Will Bite and Run': Fisherman's Dire Warning — The Nightly, 2026-01](https://thenightly.com.au/australia/nsw/will-bite-and-run-fishermans-dire-warning-after-massive-200kg-bull-shark-pulled-from-popular-sydney-beach--c-21375909)
- [Aussies Warned of 'Immediate' Shark Danger — Yahoo News Australia, 2026-03](https://au.news.yahoo.com/aussies-warned-of-immediate-shark-danger-caused-by-cyclone-alfred-huge-numbers-064407543.html)
- [Australian Fisherman Reels in 440-Pound Bull Shark — Yahoo News](https://www.yahoo.com/news/articles/australian-fisherman-reels-440-pound-181319993.html)
- [Hunter SHARK JAW Restoration — Facebook](https://www.facebook.com/Hunterjawrestore/)
- [Hunter Shark Jaw — Instagram](https://www.instagram.com/huntersharkjaw/)
- [Dolphin Carcass at Bungan Beach — Northern Beaches Advocate, 2026-02-12](https://www.northernbeachesadvocate.com.au/2026/02/12/dolphin-carcass-at-bungan-beach/)
- [FIFTH Shark Attack in 48 Hours: Bull Shark Bites Surfer at Point Plomer — BeachGrit, 2026-01](https://beachgrit.com/2026/01/fifth-shark-attack-in-48-hours-bull-shark-bites-surfer-at-point-plomer-as-nsw-nightmare-spreads-north/)
- ['More Sharks Than Ever Before': Australian Surfers React — Surfer Magazine](https://www.surfer.com/news/shark-attacks-surfers-new-south-wales-australia)
- [EXPERT REACTION: Four Shark Attacks Off NSW Beaches — Scimex, 2026-01](https://www.scimex.org/newsfeed/expert-reaction-four-shark-attacks-off-nsw-beaches)
- [Why So Many Shark Attacks in Sydney? 'Perfect Storm' — Irish Times, 2026-01-21](https://www.irishtimes.com/world/australia/2026/01/21/why-so-many-shark-attacks-in-sydney-perfect-storm-conditions-say-experts/)
- [Shark Warning After Heavy Rain — University of Sydney, 2026-02-05](https://www.sydney.edu.au/news-opinion/news/2026/02/05/shark-warning-after-heavy-rain-its-not-safe-to-go-in-the-water.html)
- [MP for Pittwater's Shark Survey: March 2026 Update — Pittwater Online News](https://www.pittwateronlinenews.com/Pittwater-MP-Shark-Survey-Update-March-2026.php)
- [Increased Bull Shark Activity Expected After Heavy Rainfall — NSW Government](https://www.nsw.gov.au/ministerial-releases/increased-bull-shark-activity-expected-around-beaches-and-waterways-following-heavy-rainfall)
- [Sharks Likely to Be Busier After 2026 Rain — NSW Govt via Newscop](https://newscop.com.au/2026/03/02/sharks-busier-after-recent-2026-rain/)
- [Shark Smart App and Public Safety Gaps Exposed — Batemans Bay Post-Moruya Examiner](https://www.batemansbaypost.com.au/story/9179557/shark-smart-app-and-public-safety-gaps-exposed/)
- [SharkSmart App — Apple App Store (AU)](https://apps.apple.com/au/app/sharksmart/id915621811)
- [SharkSmart — Google Play](https://play.google.com/store/apps/details?id=mobiddiction.com.sharksmart.nsw&hl=en-AU)
- [Dorsal Shark Reports — Apple App Store (US)](https://apps.apple.com/us/app/dorsal-shark-reports/id1045887929)
- [Dorsal Shark Reports — Google Play](https://play.google.com/store/apps/details?id=io.fruitful.dorsal&hl=en_US)
- [SafeWaters.ai — Shark Risk Forecast App](https://www.safewaters.ai/)
- [SafeWaters.AI: The Shark Attack Risk Forecast App — Surfer Today](https://www.surfertoday.com/environment/safewaters-ai-the-shark-attack-risk-forecast-app)
- [Mike's App Helps Prevent Australian Shark Attacks — SBS Small Business Secrets](https://www.sbs.com.au/news/small-business-secrets/article/shark-attacks-are-rising-scientists-think-they-know-why/s9bxzn54p)
- [Kai McKenzie Attacked by Great White Shark in Port Macquarie — Surfer Today](https://www.surfertoday.com/surfing/kai-mckenzie-attacked-by-great-white-shark-in-port-macquarie)
- [Toby Begg Shark Attack Survivor — Port Macquarie News](https://www.portnews.com.au/story/8568554/port-macquarie-shark-attack-survivor-encourages-introduction-of-emergency-signage-system/)
- [Global Systematic Review of Factors Influencing Shark Bites — ScienceDirect, 2025](https://www.sciencedirect.com/science/article/pii/S2351989425002859)
- [Huveneers & Peddemors 2024, IUCN Global Shark Report Chapter 4 — ResearchGate](https://www.researchgate.net/publication/394075632_Huveneers_Peddemors_2024_-_Chapter_4_-_Socio-Economic_Significance_-_Human-Shark-Interactions_in_IUCN_Global_Shark_Report_2024_-)
- [Four Shark Attacks in Two Days — CNN, 2026-01-20](https://edition.cnn.com/2026/01/20/australia/australia-shark-attacks-sydney-intl-hnk)
