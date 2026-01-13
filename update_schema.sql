-- 1. Safely add 'Role' column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'Role') then
    alter table public.profiles add column "Role" text default 'user' check ("Role" in ('user', 'admin'));
  end if;
end $$;

-- 2. Dar permisos de ADMIN a tu usuario
do $$
declare
  admin_uid uuid;
begin
  -- Buscar ID por email
  select id into admin_uid from auth.users where email = 'Albelcorlione@gmail.com';
  
  if admin_uid is not null then
    -- Crear perfil si no existe, o actualizar si ya existe
    insert into public.profiles (id, "Role")
    values (admin_uid, 'admin')
    on conflict (id) do update
    set "Role" = 'admin';
  end if;
end $$;
