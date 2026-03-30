# Research: Archival and Historical Data Sources for SharkSense

**Research date:** 2026-03-29
**Purpose:** Identify archival and historical data sources for back-testing the SharkSense risk model and validating predictions against known shark interaction events.

---

## 10.1 Historical SharkSmart Data

### NSW SharkSmart Website — Wayback Machine / Australian Web Archive

- **Archive URL:** https://web.archive.org/web/*/sharksmart.nsw.gov.au (direct Wayback Machine fetch blocked; use browser)
- **Alternative archive:** https://trove.nla.gov.au (National Library of Australia Australian Web Archive — search for sharksmart.nsw.gov.au)
- **Original URL:** https://www.sharksmart.nsw.gov.au/shark-activity
- **Date range available:** The SharkSmart website has been active since approximately 2015. The Australian Web Archive (AWA) captures Australian government websites periodically, typically once per year. Specific snapshot availability requires direct querying via Trove or archive.org.
- **Data format:** HTML pages with interactive maps (JavaScript/AJAX-rendered); earlier versions may have had simpler table formats. The live site uses dynamic rendering that does not preserve well in static archives.
- **Relevance:** Historical shark detection and sighting data prior to the current SMART drumline era (pre-2017) may have been presented differently. Earlier versions of the site may have shown more granular detection locations or species data that has since been aggregated or removed.
- **Access notes:** The Wayback Machine returns a 403/blocked error for automated fetches of web.archive.org. Manual browser access required. The Australian Web Archive at NLA (accessible via Trove at https://trove.nla.gov.au) is an alternative for NSW Government sites. Direct Wayback CDX API (`http://web.archive.org/cdx/search/cdx?url=sharksmart.nsw.gov.au&output=json`) can enumerate available snapshots programmatically without browser restrictions.
- **Last checked:** 2026-03-29

### NSW SMART Drumline Program Historical Data (Live — Not Archived)

- **Archive URL:** N/A (data remains live on current site)
- **Original URL:** https://www.sharksmart.nsw.gov.au/technology-trials-and-research/smart-drumlines/nsw-current-program-smart-drumline-data
- **Regional pages:**
  - Sydney Region: https://www.sharksmart.nsw.gov.au/technology-trials-and-research/smart-drumlines/nsw-sydney-region-smart-drumline-data
  - Newcastle Region: https://www.sharksmart.nsw.gov.au/technology-trials-and-research/smart-drumlines/nsw-newcastle-region-smart-drumline-data
  - North Coast: https://www.sharksmart.nsw.gov.au/technology-trials-and-research/smart-drumlines/nsw-north-coast-smart-drumline-data
  - Bega Valley/South Coast: https://www.sharksmart.nsw.gov.au/technology-trials-and-research/smart-drumlines/nsw-south-coast-smart-drumline-data
- **Date range available:** December 2, 2015 through present. Annual catch reports exist for July 2020–June 2021, July 2021–June 2022, July 2022–June 2023, and the current season.
- **Data format:** HTML tables on the SharkSmart website; annual reports published as PDFs. No bulk CSV download available. Trial data (2015–2018) showed 370 sharks caught: 300 White Sharks, 43 Tiger Sharks, 27 Bull Sharks.
- **Relevance:** Core validation dataset. Bull shark and white shark catch rates by beach and season can be used to back-test the SharkSense risk model against known detection events. Seasonal patterns and location data directly support the algorithm's species-specific risk scoring.
- **Access notes:** Data is presented in HTML tables and PDFs, not as downloadable structured data. Web scraping or manual extraction is required. For the 5 pilot beaches: Manly, Dee Why, Bondi are in the Sydney Region; Newcastle/Nobbys is in the Newcastle Region. No API endpoint or JSON feed has been identified.
- **Last checked:** 2026-03-29

### NSW Shark Meshing Program Historical Catch Data (1937–present)

- **Archive URL:** https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0003/1634394/Shark-Meshing-Program-2024-25-Annual-Performance-Report.pdf (and prior years)
- **Original URL:** https://www.sharksmart.nsw.gov.au (annual reports section)
- **Prior annual reports:**
  - 2023-24: https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0010/1570987/Shark-Meshing-Bather-Protection-Program-2023-24-Annual-Performance-Report.pdf
  - 2022-23: https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0011/1475750/Attachment-A-SMP-2022-23-Annual-Performance-Report.pdf
  - 2016-17: https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0011/856163/Shark-Meshing-2016-2017-annual-report.pdf
  - Historic report (to 2008): https://www.sharksmart.nsw.gov.au/__data/assets/pdf_file/0004/856165/Report-into-the-NSW-Shark-Meshing-Program.pdf
  - DPI factsheet: https://www.dpi.nsw.gov.au/__data/assets/pdf_file/0003/636537/FR24-shark-meshing.pdf
- **Date range available:** 1937 to present (though pre-1950 data is of uncertain accuracy per researchers). Reliable structured data from 1950 onward. NSW DPI maintains a Microsoft Access database with records from 1950.
- **Data format:** PDF annual reports; underlying data in NSW DPI Microsoft Access database (not publicly downloadable). In 2024-25, 24 target sharks and 199 non-target animals were caught across 51 beaches.
- **Relevance:** Provides 75+ years of species-level shark catches by beach and season. Critical for validating seasonal risk patterns for both bull sharks and white sharks at the pilot beach locations. Reid et al. (2011) analysed 1950–2010 data and found white shark catch rates declined to one-third of 1950s levels; bull sharks comprised 5% of the five most abundant whaler species since 1998.
- **Access notes:** The NSW DPI Access database requires a formal data request. Published annual PDFs are freely available. The peer-reviewed analysis of 1950–2010 data is available via Academia.edu (see Section 10.5).
- **Last checked:** 2026-03-29

---

## 10.2 Historical BiteMetrix Posts

### BiteMetrix Shark Risk Assessment Service

- **Archive URL:** Wayback Machine snapshots may exist but were not directly verifiable (archive.org fetch blocked). Check manually at https://web.archive.org/web/*/bitemetrix.com and https://web.archive.org/web/*/bitemetrix.com.au
- **Original URL:** Unknown — no confirmed domain identified. Facebook presence at https://www.facebook.com/p/BiteMetrix-61557983529315/
- **Date range available:** BiteMetrix appears to be a relatively recent service (Facebook page created circa 2024 based on Facebook URL structure). No archived historical daily forecast data was identified through web search.
- **Data format:** Daily risk map updates (Low/Moderate/Medium/High risk levels for NSW coastal zones), based on satellite SST and upwelling analysis. Data does not appear to be archived in any structured database.
- **Relevance:** BiteMetrix uses upwelling-driven risk methodology closely aligned with SharkSense's white shark scoring approach. Historical daily risk assessments would serve as validation data — comparing BiteMetrix's upwelling-triggered risk calls against known attack dates would test the methodology's validity. However, no historical archive of BiteMetrix forecasts was found.
- **Access notes:** BiteMetrix is a free service run by Ronnie Vickery, currently operational in NSW only. Contact through Facebook page may yield access to historical forecast data or methodology details. The service has been covered by Stab Magazine (https://stabmag.com/news/something-new-on-the-menu-re-shark-information/) and Surf Bugle (https://surfbugle.substack.com/p/what-tech-can-stop-you-getting-munched). No public data archive has been identified.
- **Last checked:** 2026-03-29

---

## 10.3 Historical Shark Attack Databases

### Global Shark Attack File (GSAF) — Shark Research Institute

- **Archive URL:** Direct download: https://www.sharkattackfile.net/spreadsheets/GSAF5.xls (current live file, updated daily)
- **Spreadsheet directory:** https://www.sharkattackfile.net/spreadsheets/ (contains individual case PDFs and main dataset)
- **Mirror on Kaggle:** https://www.kaggle.com/datasets/mexwell/global-shark-attack
- **OWID GitHub mirror (2018 snapshot):** https://github.com/owid/owid-datasets/blob/master/datasets/Shark%20attacks%20and%20fatalities%20-%20Global%20Shark%20Attack%20File%20(GSAF)%20(2018)%20/Shark%20attacks%20and%20fatalities%20-%20Global%20Shark%20Attack%20File%20(GSAF)%20(2018)%20.csv
- **Original URL:** https://www.sharkattackfile.net/
- **Date range available:** Early 1500s to present; ~6,800+ individual investigations. Reliable systematic data from the mid-20th century onward.
- **Data format:** Excel (.xls) spreadsheet with color-coded incident categories (Unprovoked, Provoked, Watercraft, Air/Sea Disaster, Questionable). Fields include: date, area, location, activity, sex, age, injury description, time, species, investigator/source. Individual incident PDFs available for each case.
- **Relevance:** Provides global historical attack data filterable by Australia/NSW. Enables back-testing of the SharkSense risk model against known attack dates — specifically cross-referencing attack dates with historical rainfall, SST, and discharge data to validate the risk algorithm's sensitivity. Also useful for identifying seasonal and species-specific patterns.
- **Access notes:** The main GSAF5.xls file is freely downloadable without registration. Individual case reports are in PDF format. Detailed individual case data beyond the public spreadsheet requires membership in the GSAF research community. The 2018 snapshot on GitHub/OWID provides a frozen reference version.
- **Last checked:** 2026-03-29

### International Shark Attack File (ISAF) — Florida Museum of Natural History

- **Archive URL:** Annual PDF reports accessible, e.g. 2023 report: https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/23/2024/02/The-ISAF-2023-shark-attack-report.pdf
- **Yearly summaries page:** https://www.floridamuseum.ufl.edu/shark-attacks/yearly-worldwide-summary/
- **Maps and data:** https://www.floridamuseum.ufl.edu/shark-attacks/maps/
- **Trends by decade:** https://www.floridamuseum.ufl.edu/shark-attacks/trends/decade/
- **Original URL:** https://www.floridamuseum.ufl.edu/shark-attacks/
- **Date range available:** Early 1500s to present; 6,800+ individual investigations. Australia-specific data accessible via the Australia + Oceania section.
- **Data format:** Publicly available as annual PDF reports, interactive web maps, and aggregate statistics tables. Individual case records are restricted — "only made available to qualified research biologists and physicians for reasons of medical confidentiality." No bulk download of the full database is publicly available.
- **Relevance:** Australia-specific bite statistics by year, enabling trend analysis. The Huveneers et al. (2024) paper (Section 10.5) used ISAF/ASID data for 196 NSW unprovoked interactions since 1900 — the underlying dataset can be requested from Florida Museum for qualified researchers.
- **Access notes:** Public access limited to aggregate statistics and PDF reports. For research-grade individual records, submit a data request to the Florida Museum. The Yearly Worldwide Summary page provides Australia-specific annual totals dating back to the 1950s.
- **Last checked:** 2026-03-29

### Australian Shark Incident Database (ASID) — Taronga / Flinders University

- **Archive URL / Download:** https://zenodo.org/records/11334212 (Zenodo v7, published May 27, 2024; DOI: 10.5281/zenodo.11334212)
- **GitHub repository:** https://github.com/cjabradshaw/AustralianSharkIncidentDatabase (living file, regularly updated)
- **Original URL:** https://taronga.org.au/conservation-and-science/australian-shark-incident-database
- **Global Ecology Flinders page:** https://globalecologyflinders.com/resources/asid/
- **2024 Annual Summary PDF:** https://taronga.org.au/sites/default/files/2025-06/ASID%202024%20summary.pdf
- **Date range available:** 1791 to present; 1,196+ individual investigations (as of 2022 dataset). Maintained continuously since 1984 by Taronga Conservation Society.
- **Data format:** Excel spreadsheet (.xlsx) — "Australian Shark-Incident Database_Public Version.xlsx" (391.6 KB). Fields include: date, location, state, species, activity, injury severity, fatality, victim demographics. Some privacy-sensitive fields are redacted in the public version. Licensed CC BY 4.0.
- **Relevance:** The most comprehensive Australia-specific database. Provides NSW bite events by location, species, and date — directly enabling back-testing of the SharkSense risk model. The Zenodo archive preserves versioned snapshots. The GitHub repo has the latest living file.
- **Access notes:** Fully open access via Zenodo and GitHub without registration. Earlier version also available at https://explore.openaire.eu/search/dataset?pid=10.5281/zenodo.6672829 (v1). The GitHub file is the most current. NSW DPI contributes data from detailed questionnaires sent to Taronga since 2008.
- **Last checked:** 2026-03-29

### NSW DPI Historical Shark Meshing Catch Database — Reid et al. (2011)

- **Archive URL:** https://www.academia.edu/12935919/Reid_et_al_2011_Decadal_trends_in_shark_catches_and_effort_from_the_New_South_Wales_Australia_Shark_Meshing_Program_1950_2010
- **Publisher URL:** https://www.publish.csiro.au/mf/fulltext/MF10162
- **DOI:** 10.1071/MF10162
- **Original URL:** CSIRO Marine and Freshwater Research journal
- **Date range available:** 1950–51 to 2009–10 (six decades); 51 NSW beaches
- **Data format:** Published tables in journal PDF. Underlying data in NSW DPI Microsoft Access database (not publicly available — formal data request required via DPI). Academic paper freely accessible via Academia.edu.
- **Relevance:** Provides decadal baseline catch rates for white sharks and bull sharks by region and season for all 51 meshed NSW beaches, including Manly, Bondi, Dee Why, and Newcastle-area beaches. Critical for understanding pre-SMART drumline baseline risk levels.
- **Access notes:** Academia.edu version offers free PDF download. The full underlying NSW DPI database requires formal request to NSW DPIRD Shark Team (sharkmanagement@dpird.nsw.gov.au).
- **Last checked:** 2026-03-29

---

## 10.4 Historical Weather and Ocean Data

### BOM Historical Daily Rainfall — Climate Data Online

- **Archive URL / Portal:** https://www.bom.gov.au/climate/data/
- **FTP access:** ftp://ftp.bom.gov.au/anon/gen/clim_data/IDCKWCDEA0/tables/
- **Rainfall maps (1900–present):** https://www.bom.gov.au/climate/maps/rainfall/
- **SEED Portal (water regulations rainfall):** https://datasets.seed.nsw.gov.au/dataset/water-regulations-data-bom-rainfall
- **Date range available:** Daily rainfall data from approximately mid-1800s for some stations; nearly 18,000 Australian locations. Sydney area stations have records from the 1850s–1870s onward.
- **Data format:** CSV/text files via Climate Data Online (CDO) web portal; anonymous FTP access at ftp.bom.gov.au (username: anonymous, password: email address). Navigate to `/anon/gen/clim_data/IDCKWCDEA0/tables/` for NSW data. Gridded rainfall analysis available in NetCDF and TIFF formats.
- **Relevance:** Essential for back-testing the SharkSense bull shark risk model. Historical daily rainfall at Sydney catchment gauges (particularly the Manly/Dee Why/Bondi coastal stations and upstream gauges) can be correlated against known bull shark attack dates in the ASID database. BOM rainfall explains 30% of the bull shark risk score weight in the SharkSense algorithm.
- **Key NSW coastal stations for pilot beaches:**
  - Sydney (Observatory Hill): Station 066062 — records from 1858
  - Manly (Sydney): Station 066108
  - Newcastle RAAF: Station 061055
  - Use the CDO map search to identify the closest station to each pilot beach.
- **Access notes:** Climate Data Online portal is free to use; no API key required. Historical observation data is downloadable as CSV via the web interface. For bulk automated access, use the anonymous FTP service. Python library `weather-au` (https://github.com/tonyallan/weather-au) wraps BOM data access.
- **Last checked:** 2026-03-29

### BOM / IMOS Historical Sea Surface Temperature — NSW Coast

- **BOM SST maps:** https://www.bom.gov.au/marine/sst.shtml
- **BOM SST timeseries (1900–present):** https://www.bom.gov.au/climate/change/about/sst_timeseries.shtml
- **BOM SST archive (Research Data Australia):** https://researchdata.edu.au/sea-surface-temperature-bureau-meteorology/680367
- **IMOS SRS-SST data portal:** https://imos.org.au/srs-sst-data
- **IMOS THREDDS server (CSIRO):** Via the AODN Portal at https://portal.aodn.org.au/search
- **NOAA ERSST v5 (global, 1854–present):** https://psl.noaa.gov/data/gridded/data.noaa.ersst.v5.html
- **NOAA ERSST v5 (PO.DAAC):** https://podaac.jpl.nasa.gov/dataset/REYNOLDS_NCDC_L4_MONTHLY_V5
- **Date range available:** IMOS satellite SST data from approximately 1982 onward (NOAA AVHRR satellite era). NOAA ERSST v5 covers 1854–present at monthly resolution. IMOS high-resolution daily L3S products from approximately 2005 onward.
- **Data format:**
  - IMOS SST: GHRSST-format NetCDF files (L2P, L3U, L3C, L3S). Australian domain 70°E–190°E at 0.02° resolution (~2 km). Available via HTTP, THREDDS, and AODN Portal.
  - NOAA ERSST v5: NetCDF and ASCII, 2°×2° global grid, monthly.
  - BOM SST timeseries: CSV raw datasets downloadable from each graph's "Raw dataset" link.
- **Relevance:** Historical SST is required to identify upwelling events along the NSW coast for back-testing the white shark risk component (upwelling = 30% of white shark score). Upwelling in NSW typically occurs between 30–33°S (Manly to Newcastle corridor) during summer, identifiable as SST drops of 2–5°C within days. A 34-year IMOS SST record (1982–2016) enables robust correlation with the ASID bite database.
- **Access notes:** AODN Portal (https://portal.aodn.org.au/search) is the primary access point — allows spatial subsetting by drawing a bounding box over NSW coast and downloading filtered NetCDF files. No registration required for download. IMOS multi-satellite L3S composites are the recommended product for upwelling detection due to cloud-gap-filling.
- **Last checked:** 2026-03-29

### IMOS Animal Tracking — Historical Acoustic Telemetry (AATAMS / ATF)

- **AWS Open Data Registry:** https://registry.opendata.aws/aodn_animal_acoustic_tracking_delayed_qc/
- **S3 bucket (no-auth access):** `s3://aodn-cloud-optimised/animal_acoustic_tracking_delayed_qc.parquet/` (region: ap-southeast-2)
- **Central database portal:** https://animaltracking.aodn.org.au/
- **AODN Portal:** https://portal.aodn.org.au/search
- **Research Data Australia entry:** https://researchdata.edu.au/imos-animal-tracking-ongoing-collection/992131
- **Date range available:** 2007 to present (quality-controlled detections). Nation-wide permanent acoustic receiver array with ~37 receiver stations along NSW coast. Updates every six months.
- **Data format:** Apache Parquet files on AWS S3 (cloud-optimised, queryable with pandas/DuckDB without full download). Also available as CSV and NetCDF via AODN Portal. Contains: tag ID, species, detection time, receiver location, depth. Shark detections include white sharks, bull sharks, tiger sharks, and others tagged under the IMOS program.
- **Relevance:** The primary source for historical tagged shark detections along the NSW coast — directly feeds the SharkSense IMOS scraper (`lib/data/fetchSharkDetections.ts`). Historical detection data (2007–present) enables: (1) validation of seasonal presence models, (2) identification of detection hotspots near pilot beaches, (3) back-testing whether detection rates correlate with attack events in the ASID. The Lubitz et al. (2025) study used 15 years of IMOS data (2009–2024).
- **Access notes:** Fully open access under CC BY 4.0. AWS CLI access: `aws s3 ls --no-sign-request s3://aodn-cloud-optimised/animal_acoustic_tracking_delayed_qc.parquet/`. GitHub tutorial notebooks available from IMOS. Contact: info@aodn.org.au.
- **Last checked:** 2026-03-29

### NSW BeachWatch — Historical Water Quality Data

- **Data feeds page:** https://beachwatch.nsw.gov.au/waterMonitoring/beachwatchDataFeeds
- **SEED Dataset:** https://datasets.seed.nsw.gov.au/dataset/beachwatch
- **Data.NSW:** https://data.nsw.gov.au/data/dataset/beachwatch
- **Water quality portal:** https://www.beachwatch.nsw.gov.au/waterMonitoring/waterQualityData
- **Date range available:** BeachWatch established 1989; historical water quality records available from approximately that date for Sydney ocean beaches including Manly, Bondi, and Dee Why.
- **Data format:** The beach pollution forecast API and RSS feed are openly accessible without registration or subscription keys. Data updated twice daily (6 am and 1:30 pm). Historical downloads available via SEED portal. Licensed CC BY 4.0.
- **Relevance:** BeachWatch data (enterococci counts, pollution forecasts) is already used in the SharkSense `fetchAll.ts` data pipeline. Historical records enable correlation between water quality events (post-storm runoff/sewage overflow) and both bull shark presence and human water activity levels.
- **Access notes:** Live API documented at BeachWatch data feeds page. Historical data available via SEED portal and Data.NSW. The SEED dataset provides the fullest historical archive.
- **Last checked:** 2026-03-29

---

## 10.5 Academic Papers — Open Access Versions

### Lubitz et al. (2025) — Bull Shark Residency and Climate Warming, Sydney

- **Open access PDF:** Available via ResearchGate: https://www.researchgate.net/publication/393021850_Ocean_warming_increases_residency_at_summering_grounds_for_migrating_bull_sharks_Carcharhinus_leucas
- **Publisher page:** https://www.sciencedirect.com/science/article/pii/S0048969725016067
- **PubMed:** https://pubmed.ncbi.nlm.nih.gov/40570393/
- **News coverage:** https://www.jcu.edu.au/news/releases/2025/july/climate-shifts-extending-sydneys-bull-shark-season
- **Journal:** Science of the Total Environment, 2025, vol. 992, article 179966
- **Data availability:** All data used in the manuscript are publicly available (stated by authors).
- **Key findings:** 15 years of passive acoustic telemetry (2009–2024); bull sharks in Sydney delayed departure by average 1 day/year; average SST warming of 0.67°C (1982–2024) at study site; bull sharks now spend longer periods at temperate summering grounds.
- **Relevance to SharkSense:** Directly validates the temperature-dependent seasonal risk model. Confirms that SST is a primary predictor for bull shark presence timing at Sydney estuaries. The departure-delay trend of 1 day/year should be incorporated as a climate adjustment factor in the seasonal risk scoring.
- **Last checked:** 2026-03-29

### Werry et al. (2018) — Rainfall and SST as Key Drivers for Bull Shark Occurrence in Beach Areas (Queensland SCP Study)

- **Open access:** Yes — CC BY-NC-ND 4.0
- **DOI:** 10.1016/j.gecco.2018.e00430
- **Publisher page:** https://www.sciencedirect.com/science/article/pii/S2351989418302476
- **Journal:** Global Ecology and Conservation, 2018
- **Authors:** Jonathan M. Werry, Wayne Sumpton, Nicholas M. Otway, Shing Yip Lee, Jodie A. Haig, David G. Mayer
- **Key findings:** Bull shark catch in Queensland SMART drumlines significantly increased when cumulative rainfall >100mm occurred in preceding 7 days, especially near estuaries. Increased from 1 to 8 days after ≥100mm rainfall. SST also positively correlated with shark presence.
- **Relevance to SharkSense:** This is the primary empirical foundation for the SharkSense bull shark rainfall weighting (0.30). The 7-day cumulative rainfall >100mm threshold provides a validated threshold for RED risk triggering. The paper also supports the discharge weight (0.25) and temperature weight (0.10).
- **Last checked:** 2026-03-29

### Huveneers et al. (2024) — Shifts in Shark Bite Incidence and Beach Mitigation, NSW

- **Open access PDF (Flinders repository):** https://researchnow-admin.flinders.edu.au/ws/portalfiles/portal/100705957/Huveneers_Shifts_P2024.pdf
- **ResearchGate:** https://www.researchgate.net/publication/376170814_Shifts_in_the_incidence_of_shark_bites_and_efficacy_of_beach-focussed_mitigation_in_Australia
- **SCU repository PDF:** https://researchportal.scu.edu.au/view/pdfCoverPage?instCode=61SCU_INST&filePid=13119547840002368&download=true
- **Publisher (ScienceDirect):** https://www.sciencedirect.com/science/article/pii/S0025326X23012900
- **DOI:** 10.1016/j.marpolbul.2023.115855
- **Journal:** Marine Pollution Bulletin, vol. 198, January 2024 (online December 2, 2023)
- **License:** CC BY-NC-ND — open access
- **Key findings:** 196 unprovoked shark-human interactions in NSW since 1900. Bites shifted from predominantly swimmers to 79% on surfers by the 1980s; 2–4-fold increase in bite rate. No detectable difference in interaction rate at netted vs. non-netted beaches since 2000s. Zero interactions recorded while SMART drumlines and/or drones were deployed.
- **Relevance to SharkSense:** Provides NSW-specific bite probability baseline by activity type (surfer vs. swimmer vs. other). The 196-case dataset is drawn from ASID, confirming ASID as the authoritative source. Validates the SMART drumline deterrent effect for risk score reduction.
- **Last checked:** 2026-03-29

### Smoothey et al. (2016) — Patterns of Occurrence of Sharks in Sydney Harbour

- **Open access:** Yes — PLoS ONE (fully open access journal)
- **PLoS ONE full text:** https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0146911
- **PMC full text:** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4732766/
- **PubMed:** https://pubmed.ncbi.nlm.nih.gov/26824349/
- **DOI:** 10.1371/journal.pone.0146911
- **Journal:** PLoS ONE, published January 29, 2016
- **Key findings:** Two-year longline sampling in three Sydney Harbour areas. Bull shark was second most abundant species, captured only in summer and autumn when water temperature was above 23°C. All areas of Sydney Harbour used by bull sharks, but with temporal restriction to warm months.
- **Relevance to SharkSense:** Establishes 23°C as a critical temperature threshold for bull shark presence in Sydney estuaries — directly applicable to Nielsen Park (Port Jackson/Sydney Harbour) beach risk scoring. Validates the temperature weight (0.10) in the bull shark algorithm.
- **Last checked:** 2026-03-29

### Smoothey et al. (2019) — Long-term Patterns of Bull Sharks in Sydney Harbour

- **Open access:** Yes — Scientific Reports (Nature, open access)
- **Full text:** https://www.nature.com/articles/s41598-019-54365-x
- **PDF direct:** https://www.nature.com/articles/s41598-019-54365-x.pdf
- **PMC:** https://pmc.ncbi.nlm.nih.gov/articles/PMC6906466/
- **PubMed:** https://pubmed.ncbi.nlm.nih.gov/31827123/
- **DOI:** 10.1038/s41598-019-54365-x
- **Journal:** Scientific Reports, vol. 9, article 18864, 2019
- **Key findings:** Passive acoustic telemetry of 40 sub-adult and adult bull sharks over 7 years. Peak abundance January–February. Weak diel patterns — further from harbour entrance during day and at low tides, deeper water during day, shallower at night. Water temperature is the key predictor for seasonal movements. Climate change expected to increase abundance and lengthen residence periods.
- **Relevance to SharkSense:** Provides 7-year acoustic telemetry baseline for Sydney Harbour bull shark behaviour — directly relevant to Nielsen Park beach. The January–February peak and temperature threshold findings validate the seasonal weighting in the risk model. Diel patterns inform the time-of-day risk component (0.10 weight).
- **Last checked:** 2026-03-29

### NSW Shark Meshing Program 1950–2010 Catch Analysis — Reid, Robbins, Peddemors (2011)

- **Free PDF (Academia.edu):** https://www.academia.edu/12935919/Reid_et_al_2011_Decadal_trends_in_shark_catches_and_effort_from_the_New_South_Wales_Australia_Shark_Meshing_Program_1950_2010
- **Publisher (CSIRO):** https://www.publish.csiro.au/mf/fulltext/MF10162
- **DOI:** 10.1071/MF10162
- **Journal:** Marine and Freshwater Research (CSIRO Publishing), 2011
- **Key findings:** Six decades of catch and effort data across 51 NSW beaches. White shark catch rates declined to approximately one-third of 1950s levels. Bull sharks comprise 5% of the five most abundant whaler species since 1998. Significant regional variation in species composition.
- **Relevance to SharkSense:** Provides pre-SMART drumline baseline for species-specific risk by region. Newcastle-Wollongong corridor has disproportionately higher white shark catches in spring (September–November) — directly applicable to Newcastle/Nobbys beach white shark risk scoring.
- **Last checked:** 2026-03-29

### Australian Shark-Incident Database — Peer-Reviewed Data Descriptor

- **Open access full text:** https://www.nature.com/articles/s41597-022-01453-9
- **PMC:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9259633/
- **ResearchGate:** https://www.researchgate.net/publication/361405108_The_Australian_Shark-Incident_Database_for_quantifying_temporal_and_spatial_patterns_of_shark-human_conflict
- **DOI:** 10.1038/s41597-022-01453-9
- **Journal:** Scientific Data (Nature), 2022
- **Key findings:** 1,196 shark bites in Australia, 1791–2022. Describes full methodology for ASID data collection and validation. NSW DPI questionnaire process detailed.
- **Relevance to SharkSense:** The methods paper for the ASID dataset — essential reading before using ASID data for back-testing. Describes data quality flags and limitations.
- **Last checked:** 2026-03-29

---

## Summary: Priority Access Order for Back-Testing

For back-testing the SharkSense risk algorithm against historical shark interactions, the recommended data acquisition order is:

1. **ASID (Zenodo v7)** — Download from https://zenodo.org/records/11334212. Provides the ground-truth bite event dates and locations for NSW. Free, immediate download.

2. **GSAF5.xls** — Download from https://www.sharkattackfile.net/spreadsheets/GSAF5.xls. Secondary validation source for any NSW/Australian events not in ASID. Free, immediate download.

3. **BOM Rainfall (CDO)** — Access via https://www.bom.gov.au/climate/data/ for daily rainfall at Sydney stations (066062 Observatory Hill, 066108 Manly). Correlate against bull shark attack dates from ASID.

4. **IMOS SST (AODN Portal)** — Subset NSW coast bounding box (150°E–152°E, 34°S–32°S) from https://portal.aodn.org.au/search. Download L3S daily composites 2007–present for upwelling event detection.

5. **IMOS Acoustic Telemetry (AWS S3)** — Query `s3://aodn-cloud-optimised/animal_acoustic_tracking_delayed_qc.parquet/` for white shark and bull shark detections near pilot beach coordinates.

6. **NSW Shark Meshing Annual Reports (PDFs)** — Download from SharkSmart.nsw.gov.au for species-level validation at Manly, Dee Why, Bondi, and Newcastle beaches (1950–present).
