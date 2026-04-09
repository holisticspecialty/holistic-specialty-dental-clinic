-- ============================================
-- HOLISTIC SPECIALTY DENTAL — Supabase Setup
-- Run this entire file in your Supabase SQL editor
-- ============================================

-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone (patients) to INSERT a new appointment
CREATE POLICY "Public can book appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (true);

-- 4. Only authenticated staff can read all appointments
CREATE POLICY "Authenticated staff can read appointments"
  ON appointments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 5. Only authenticated staff can update appointment status
CREATE POLICY "Authenticated staff can update appointments"
  ON appointments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 6. Enable real-time for the appointments table
-- Go to: Supabase Dashboard → Database → Replication → Enable for 'appointments'
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- ============================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Go to Authentication → Users → Add User
--    Create a staff email + password (e.g. staff@holisticdental.com)
-- 2. Copy your Project URL and anon key from:
--    Settings → API → Project URL & anon/public key
-- 3. Add them to your .env.local file:
--    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- ============================================
