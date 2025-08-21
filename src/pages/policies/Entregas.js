import React from 'react';

const Entregas = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Entregas</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tiempos de Entrega</h2>
          <p className="text-gray-700 mb-6">
            En PROO MTB & ROAD nos esforzamos por procesar y enviar los pedidos lo más rápido posible. 
            A continuación, encontrarás nuestra política de entregas detallada.
          </p>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Procesamiento de Pedidos</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Los pedidos se procesan dentro de las 24-48 horas hábiles posteriores a la compra</li>
            <li>Los pedidos realizados los viernes después de las 2:00 PM y los fines de semana se procesarán el siguiente día hábil</li>
            <li>Recibirás un correo de confirmación con el número de seguimiento una vez que tu pedido sea enviado</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Opciones de Envío</h3>
          <div className="space-y-4 mb-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Envío Estándar</h4>
              <p className="text-gray-700">
                Tiempo de entrega: 3-5 días hábiles<br />
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Envío Exprés</h4>
              <p className="text-gray-700">
                Tiempo de entrega: 1-2 días hábiles<br />
              </p>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Áreas de Cobertura</h3>
          <p className="text-gray-700 mb-4">
            Realizamos envíos a toda la República Dominicana. Los tiempos de entrega pueden variar según la ubicación:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Santo Domingo - Distrito Nacional: 1-3 días hábiles</li>
            <li>Interior de la República: 3-4 días hábiles</li>
          </ul>
          
          <div className="mt-8 p-4 bg-green-50 rounded-md">
            <p className="text-green-700">
              <span className="font-semibold">Importante:</span> Los tiempos de entrega son estimados y pueden verse afectados 
              por factores fuera de nuestro control como condiciones climáticas, huelgas o eventos de fuerza mayor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entregas;
