-- Script para crear la tabla de inscripciones del Águinaldo Navideño (Martes 1 de Diciembre)
-- PRO MTB & ROAD x RAYMON

-- 1. Crear secuencia para los códigos de boletos (AGU-001, AGU-002, ...)
CREATE SEQUENCE IF NOT EXISTS public.aguinaldo_ticket_seq START WITH 1;

-- 2. Crear la tabla
CREATE TABLE IF NOT EXISTS public.aguinaldo_registrations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    cedula text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    ticket_code text NOT NULL,
    status text DEFAULT 'registered'::text NOT NULL,
    checked_in boolean DEFAULT false NOT NULL,
    checked_in_at timestamp with time zone,
    chocolate_claimed boolean DEFAULT false NOT NULL,
    chocolate_claimed_at timestamp with time zone,
    waiver_accepted boolean DEFAULT true NOT NULL,
    notes text
);

-- 3. Función y Trigger para asignar automáticamente código secuencial si no se envía
CREATE OR REPLACE FUNCTION public.set_aguinaldo_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_code IS NULL OR NEW.ticket_code = '' THEN
        NEW.ticket_code := 'AGU-' || LPAD(nextval('public.aguinaldo_ticket_seq')::text, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_aguinaldo_ticket_code ON public.aguinaldo_registrations;
CREATE TRIGGER trg_set_aguinaldo_ticket_code
BEFORE INSERT ON public.aguinaldo_registrations
FOR EACH ROW
EXECUTE FUNCTION public.set_aguinaldo_ticket_code();

-- 4. Crear índices para optimizar búsquedas por Cédula y Código de Ticket
CREATE INDEX IF NOT EXISTS idx_aguinaldo_cedula ON public.aguinaldo_registrations (cedula);
CREATE INDEX IF NOT EXISTS idx_aguinaldo_ticket_code ON public.aguinaldo_registrations (ticket_code);

-- 5. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.aguinaldo_registrations ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de acceso
DROP POLICY IF EXISTS "Permitir insertar registro anónimo aguinaldo" ON public.aguinaldo_registrations;
CREATE POLICY "Permitir insertar registro anónimo aguinaldo"
    ON public.aguinaldo_registrations
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura general aguinaldo" ON public.aguinaldo_registrations;
CREATE POLICY "Permitir lectura general aguinaldo"
    ON public.aguinaldo_registrations
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir actualización aguinaldo" ON public.aguinaldo_registrations;
CREATE POLICY "Permitir actualización aguinaldo"
    ON public.aguinaldo_registrations
    FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Permitir eliminar a autenticados aguinaldo" ON public.aguinaldo_registrations;
CREATE POLICY "Permitir eliminar a autenticados aguinaldo"
    ON public.aguinaldo_registrations
    FOR DELETE
    USING (auth.role() = 'authenticated');
