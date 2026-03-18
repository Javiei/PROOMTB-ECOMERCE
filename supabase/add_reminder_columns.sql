-- Ejecutar esto en el SQL Editor de Supabase
ALTER TABLE event_attendance 
ADD COLUMN IF NOT EXISTS reminder_1_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_2_sent BOOLEAN DEFAULT FALSE;
