import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminOrders() {
  const [form, setForm] = useState({ nombre_cliente: '', producto: '', cantidad: 1, estado: 'pendiente' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    const { error } = await supabase.from('orders').insert([form]);
    setLoading(false);
    if (error) setError(error.message);
    else {
      setSuccess(true);
      setForm({ nombre_cliente: '', producto: '', cantidad: 1, estado: 'pendiente' });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Agregar Pedido</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} required placeholder="Nombre del cliente" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <input name="producto" value={form.producto} onChange={handleChange} required placeholder="Producto" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <input name="cantidad" type="number" min={1} value={form.cantidad} onChange={handleChange} required placeholder="Cantidad" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <select name="estado" value={form.estado} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700">
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
        <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded font-bold w-full">{loading ? 'Guardando...' : 'Agregar Pedido'}</button>
        {success && <div className="text-green-400 mt-2">¡Pedido agregado!</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
    </div>
  );
}
