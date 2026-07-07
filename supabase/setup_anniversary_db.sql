-- Script para crear la tabla de inscripciones del 6to Aniversario

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS public.anniversary_registrations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    cedula text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    jersey_size text,
    registration_type text DEFAULT 'full'::text NOT NULL,
    receipt_url text,
    status text DEFAULT 'pending'::text NOT NULL,
    special_code text
);

-- 2. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.anniversary_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas
-- Permitir a cualquier persona (incluso sin autenticar) insertar un nuevo registro
CREATE POLICY "Permitir insertar a cualquier usuario anónimo"
    ON public.anniversary_registrations
    FOR INSERT
    WITH CHECK (true);

-- Opcional: Permitir leer registros solo a usuarios autenticados (administradores)
CREATE POLICY "Permitir lectura a usuarios autenticados"
    ON public.anniversary_registrations
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Opcional: Permitir actualizar registros solo a usuarios autenticados
CREATE POLICY "Permitir actualización a usuarios autenticados"
    ON public.anniversary_registrations
    FOR UPDATE
    USING (auth.role() = 'authenticated');
