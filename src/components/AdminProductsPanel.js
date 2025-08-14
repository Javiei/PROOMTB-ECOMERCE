import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { uploadImageToSupabase } from '../utils/uploadImageToSupabase';

export default function AdminProductsPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', price: '', rating: 5, description: '', image_url: '', section: '' });
const [imageFiles, setImageFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleImageChange(e) {
    setImageFiles(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    // Validar mínimo 3 imágenes
    if (imageFiles.length < 3 && (!form.images || form.images.length < 3)) {
      setError('Debes subir al menos 3 imágenes.');
      return;
    }
    let images = form.images || [];
    if (imageFiles.length > 0) {
      try {
        images = [];
        for (const file of imageFiles) {
          const url = await uploadImageToSupabase(file);
          images.push(url);
        }
      } catch (err) {
        setError('Error subiendo imágenes: ' + err.message);
        return;
      }
    }
    const productData = { ...form, price: parseFloat(form.price), images };
    if (editId) {
      // Editar producto existente
      const { error } = await supabase.from('products').update(productData).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Producto actualizado');
        setEditId(null);
        setForm({ name: '', category: '', price: '', rating: 5, description: '', images: [], section: '' });
        setImageFiles([]);
        fetchProducts();
      }
    } else {
      // Nuevo producto
      const { error } = await supabase.from('products').insert([productData]);
      if (error) setError(error.message);
      else {
        setSuccess('Producto agregado');
        setForm({ name: '', category: '', price: '', rating: 5, description: '', images: [], section: '' });
        setImageFiles([]);
        fetchProducts();
      }
    }
  }

  function handleEdit(product) {
    setEditId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      description: product.description,
      images: product.images || [],
      section: product.section || ''
    });
    setImageFiles([]);
    setSuccess(''); setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setSuccess('Producto eliminado');
      fetchProducts();
    } else {
      setError(error.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Panel de Productos (Crear, Editar, Eliminar)</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Nombre del producto (ej: Bicicleta MTB Pro)" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <select name="category" value={form.category} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700">
          <option value="">Selecciona categoría...</option>
          <optgroup label="Bicicletas">
            <option value="MTB">MTB</option>
            <option value="Ruta">Ruta</option>
            <option value="Urbana">Urbana</option>
            <option value="Eléctrica">Eléctrica</option>
          </optgroup>
          <optgroup label="Accesorios">
            <option value="Lavado">Lavado</option>
            <option value="Rolos">Rolos</option>
            <option value="Cremas">Cremas</option>
            <option value="Bombas y CO2">Bombas y CO2</option>
            <option value="Herramientas y Aceites">Herramientas y Aceites</option>
            <option value="Cintas de Timón">Cintas de Timón</option>
            <option value="Protectores de Bicicletas">Protectores de Bicicletas</option>
            <option value="Guardalodos">Guardalodos</option>
            <option value="Milleros">Milleros</option>
            <option value="Ciclo Computadoras GPS">Ciclo Computadoras GPS</option>
            <option value="Relojes GPS">Relojes GPS</option>
            <option value="Sensores">Sensores</option>
            <option value="Luces">Luces</option>
            <option value="Cascos">Cascos</option>
            <option value="Guantillas">Guantillas</option>
            <option value="Gafas">Gafas</option>
            <option value="Protecciones">Protecciones</option>
            <option value="Nutrición">Nutrición</option>
            <option value="Bulticos y Mochilas">Bulticos y Mochilas</option>
            <option value="Termeras">Termeras</option>
            <option value="Termos">Termos</option>
            <option value="Puños">Puños</option>
            <option value="Porta Bicicletas y Burros">Porta Bicicletas y Burros</option>
          </optgroup>
        </select>
        <input name="price" type="number" min={0.01} step="0.01" value={form.price} onChange={handleChange} required placeholder="Precio (ej: 999.99)" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} required placeholder="Rating (1-5 estrellas)" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Descripción breve del producto" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <div>
  <label className="block mb-1">Imágenes del producto (sube mínimo 3):</label>
  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full mb-2" />
  {/* Previsualización */}
  <div className="flex flex-wrap gap-2 mt-2">
    {imageFiles.length > 0
      ? imageFiles.map((file, idx) => (
          <div key={idx} className="w-20 h-20 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
            <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="object-cover w-full h-full" />
          </div>
        ))
      : form.images && form.images.length > 0 && form.images.map((url, idx) => (
          <div key={idx} className="w-20 h-20 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
            <img src={url} alt={`preview-${idx}`} className="object-cover w-full h-full" />
          </div>
        ))}
  </div>
</div>
        <select name="section" value={form.section} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700">
  <option value="">Selecciona sección...</option>
  <option value="mas_vendidos">Más Vendidos</option>
  <option value="destacados">Destacados</option>
  <option value="tienda">Tienda</option>
  <option value="recomendados">Recomendados</option>
</select>
<button type="submit" className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded font-bold w-full"
  disabled={
    !form.name || !form.category || !form.price || !form.rating || !form.description || ((imageFiles.length < 3 && (!form.images || form.images.length < 3))) || !form.section ||
    Number(form.price) <= 0 || Number(form.rating) < 1 || Number(form.rating) > 5
  }
>
  {editId ? 'Actualizar Producto' : 'Agregar Producto'}
</button>
        {success && <div className="text-green-400 mt-2">{success}</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {Number(form.price) <= 0 && <div className="text-yellow-400 text-sm">El precio debe ser mayor a 0</div>}
        {(Number(form.rating) < 1 || Number(form.rating) > 5) && <div className="text-yellow-400 text-sm">El rating debe ser entre 1 y 5</div>}
      </form>
      <h3 className="text-xl font-bold mb-2">Productos existentes</h3>
      {loading ? <div>Cargando...</div> : (
        <ul className="divide-y divide-gray-700">
          {products.map(product => (
            <li key={product.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span><span className="font-semibold">Nombre:</span> {product.name}</span>
              <span><span className="font-semibold">Categoría:</span> {product.category}</span>
              <span><span className="font-semibold">Precio:</span> ${product.price}</span>
              <span><span className="font-semibold">Rating:</span> {product.rating}</span>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(product)} className="bg-blue-600 hover:bg-blue-800 px-3 py-1 rounded">Editar</button>
                <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-800 px-3 py-1 rounded">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
