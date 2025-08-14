import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre_cliente: '', producto: '', cantidad: 1, estado: 'pendiente' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (editId) {
      // Editar pedido existente
      const { error } = await supabase.from('orders').update(form).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Pedido actualizado');
        setEditId(null);
        setForm({ nombre_cliente: '', producto: '', cantidad: 1, estado: 'pendiente' });
        fetchOrders();
      }
    } else {
      // Nuevo pedido
      const { error } = await supabase.from('orders').insert([form]);
      if (error) setError(error.message);
      else {
        setSuccess('Pedido agregado');
        setForm({ nombre_cliente: '', producto: '', cantidad: 1, estado: 'pendiente' });
        fetchOrders();
      }
    }
  }

  function handleEdit(order) {
    setEditId(order.id);
    setForm({ nombre_cliente: order.nombre_cliente, producto: order.producto, cantidad: order.cantidad, estado: order.estado });
    setSuccess(''); setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) {
      setSuccess('Pedido eliminado');
      fetchOrders();
    } else {
      setError(error.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Panel de Pedidos (Crear, Editar, Eliminar)</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} required placeholder="Nombre del cliente" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <input name="producto" value={form.producto} onChange={handleChange} required placeholder="Producto" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <input name="cantidad" type="number" min={1} value={form.cantidad} onChange={handleChange} required placeholder="Cantidad" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
        <select name="estado" value={form.estado} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700">
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
        <button type="submit" className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded font-bold w-full">{editId ? 'Actualizar Pedido' : 'Agregar Pedido'}</button>
        {success && <div className="text-green-400 mt-2">{success}</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
      <h3 className="text-xl font-bold mb-2">Pedidos existentes</h3>
      {loading ? <div>Cargando...</div> : (
        <ul className="divide-y divide-gray-700">
          {orders.map(order => (
            <li key={order.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span><span className="font-semibold">Cliente:</span> {order.nombre_cliente}</span>
              <span><span className="font-semibold">Producto:</span> {order.producto}</span>
              <span><span className="font-semibold">Cantidad:</span> {order.cantidad}</span>
              <span><span className="font-semibold">Estado:</span> <span className={order.estado === 'pagado' ? 'text-green-400' : 'text-yellow-400'}>{order.estado}</span></span>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(order)} className="bg-blue-600 hover:bg-blue-800 px-3 py-1 rounded">Editar</button>
                <button onClick={() => handleDelete(order.id)} className="bg-red-600 hover:bg-red-800 px-3 py-1 rounded">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
