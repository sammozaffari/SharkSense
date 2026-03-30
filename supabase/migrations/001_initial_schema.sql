-- SharkSense Database Schema
-- Run against Supabase Postgres via SQL Editor or CLI

-- Beaches (replaces data/beaches.json)
CREATE TABLE beaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  estuary_distance_km DOUBLE PRECISION,
  estuary_name TEXT,
  water_nsw_gauge_id TEXT,
  baseline_discharge DOUBLE PRECISION,
  historical_incidents JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tagged shark detections (from Twitter, IMOS, SharkSmart)
CREATE TABLE shark_detections (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  species TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  raw_text TEXT,
  station_id TEXT,
  tag_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_detections_time ON shark_detections(detected_at DESC);
CREATE INDEX idx_detections_source ON shark_detections(source);
CREATE INDEX idx_detections_species ON shark_detections(species);

-- Water quality (from Beachwatch API)
CREATE TABLE water_quality (
  id SERIAL PRIMARY KEY,
  beach_id TEXT REFERENCES beaches(id),
  rating TEXT,
  enterococci_cfu INTEGER,
  sampled_at TIMESTAMPTZ,
  forecast TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_wq_beach_time ON water_quality(beach_id, sampled_at DESC);

-- Environmental snapshots (from Open-Meteo, WaterNSW)
CREATE TABLE environmental_snapshots (
  id SERIAL PRIMARY KEY,
  beach_id TEXT REFERENCES beaches(id),
  rainfall_72hr DOUBLE PRECISION,
  current_temp DOUBLE PRECISION,
  wind_speed DOUBLE PRECISION,
  wind_direction DOUBLE PRECISION,
  sst DOUBLE PRECISION,
  wave_height DOUBLE PRECISION,
  swell_height DOUBLE PRECISION,
  swell_period DOUBLE PRECISION,
  current_discharge DOUBLE PRECISION,
  baseline_discharge DOUBLE PRECISION,
  offshore_sst DOUBLE PRECISION,
  precipitation_forecast JSONB,
  fetched_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_env_beach_time ON environmental_snapshots(beach_id, fetched_at DESC);

-- Marine warnings (from BOM)
CREATE TABLE marine_warnings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  region TEXT,
  severity TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_warnings_active ON marine_warnings(expires_at DESC) WHERE expires_at > now();

-- Wave buoy readings (from MHL)
CREATE TABLE wave_buoy_readings (
  id SERIAL PRIMARY KEY,
  station TEXT NOT NULL,
  significant_height DOUBLE PRECISION,
  peak_period DOUBLE PRECISION,
  direction DOUBLE PRECISION,
  sst DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_buoy_station_time ON wave_buoy_readings(station, recorded_at DESC);

-- Historical incidents (from Taronga ASID)
CREATE TABLE historical_incidents (
  id SERIAL PRIMARY KEY,
  incident_date DATE,
  location TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  species TEXT,
  outcome TEXT,
  activity TEXT,
  description TEXT,
  source TEXT,
  nearest_beach_id TEXT REFERENCES beaches(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_incidents_beach ON historical_incidents(nearest_beach_id);

-- Scrape audit log
CREATE TABLE scrape_logs (
  id SERIAL PRIMARY KEY,
  scraper TEXT NOT NULL,
  status TEXT NOT NULL,
  records_upserted INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_scrape_logs_time ON scrape_logs(started_at DESC);
CREATE INDEX idx_scrape_logs_scraper ON scrape_logs(scraper, started_at DESC);

-- Enable Row Level Security (public read, service role write)
ALTER TABLE beaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE shark_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE marine_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wave_buoy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read" ON beaches FOR SELECT USING (true);
CREATE POLICY "Public read" ON shark_detections FOR SELECT USING (true);
CREATE POLICY "Public read" ON water_quality FOR SELECT USING (true);
CREATE POLICY "Public read" ON environmental_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read" ON marine_warnings FOR SELECT USING (true);
CREATE POLICY "Public read" ON wave_buoy_readings FOR SELECT USING (true);
CREATE POLICY "Public read" ON historical_incidents FOR SELECT USING (true);
CREATE POLICY "Public read" ON scrape_logs FOR SELECT USING (true);

-- Service role has full access by default (bypasses RLS)
