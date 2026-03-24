-- Table for Tuesday Night Ride registrations
CREATE TABLE IF NOT EXISTS tuesday_registrations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    cedula text NOT NULL,
    email text NOT NULL,
    registration_date date DEFAULT CURRENT_DATE,
    waiver_accepted boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Index for faster attendance counting
CREATE INDEX IF NOT EXISTS idx_tuesday_registrations_cedula ON tuesday_registrations(cedula);

-- RLS Policies (Initial: Allow anonymous inserts)
ALTER TABLE tuesday_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON tuesday_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read-only of counts" ON tuesday_registrations
    FOR SELECT USING (true);
