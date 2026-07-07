-- Ejecutar esto en el SQL Editor de Supabase para admitir invitados sin jersey y sin pago
ALTER TABLE public.anniversary_registrations ALTER COLUMN jersey_size DROP NOT NULL;
ALTER TABLE public.anniversary_registrations ALTER COLUMN receipt_url DROP NOT NULL;
