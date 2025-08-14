-- Ejecuta esto en el SQL editor de Supabase para crear la tabla de productos
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  price numeric not null,
  rating integer,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);
