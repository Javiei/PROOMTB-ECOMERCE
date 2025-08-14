-- Ejecuta esto en el SQL editor de Supabase para agregar el campo images (array de text)
ALTER TABLE products ADD COLUMN images text[];
-- Opcional: elimina image_url si ya no se usará
-- ALTER TABLE products DROP COLUMN image_url;
