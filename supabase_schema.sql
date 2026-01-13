-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create cart_items table
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  product_id uuid not null, -- Assuming you link to your product ID, might be text or int depending on your table
  quantity int default 1,
  selected_size text,
  price numeric,
  modelo text,
  imagenes_urls text[], -- Array of strings for images
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.cart_items enable row level security;

-- Policies
create policy "Users can view their own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);
