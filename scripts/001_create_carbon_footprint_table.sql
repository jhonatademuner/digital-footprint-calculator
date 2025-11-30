-- Create carbon_footprints table
CREATE TABLE IF NOT EXISTS carbon_footprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  streaming_hours DECIMAL(10, 2) NOT NULL,
  daily_emails INTEGER NOT NULL,
  social_media_hours DECIMAL(10, 2) NOT NULL,
  cloud_storage_gb DECIMAL(10, 2) NOT NULL,
  annual_co2_kg DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT NOT NULL
);

-- Enable RLS for public read access (for community stats)
ALTER TABLE carbon_footprints ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view all carbon footprints (for community stats)
CREATE POLICY "allow_public_select_carbon_footprints"
  ON carbon_footprints
  FOR SELECT
  USING (true);

-- Policy to allow anyone to insert carbon footprints
CREATE POLICY "allow_public_insert_carbon_footprints"
  ON carbon_footprints
  FOR INSERT
  WITH CHECK (true);
