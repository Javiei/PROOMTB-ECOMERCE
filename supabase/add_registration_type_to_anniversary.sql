-- Ejecutar esto en el SQL Editor de Supabase
ALTER TABLE public.anniversary_registrations 
ADD COLUMN IF NOT EXISTS registration_type text DEFAULT 'full'::text NOT NULL;
