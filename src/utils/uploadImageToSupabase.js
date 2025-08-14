import { supabase } from '../supabaseClient';

export async function uploadImageToSupabase(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  let { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { publicURL, error: urlError } = supabase.storage.from('products').getPublicUrl(filePath);
  if (urlError) throw urlError;
  return publicURL;
}
