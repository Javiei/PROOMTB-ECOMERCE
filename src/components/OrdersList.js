import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Pedidos recientes</h2>
      {loading ? <div>Cargando...</div> : (
        <ul className="divide-y divide-gray-700">
          {orders.map(order => (
            <li key={order.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
              <span><span className="font-semibold">Cliente:</span> {order.nombre_cliente}</span>
              <span><span className="font-semibold">Producto:</span> {order.producto}</span>
              <span><span className="font-semibold">Cantidad:</span> {order.cantidad}</span>
              <span><span className="font-semibold">Estado:</span> <span className={order.estado === 'pagado' ? 'text-green-400' : 'text-yellow-400'}>{order.estado}</span></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
