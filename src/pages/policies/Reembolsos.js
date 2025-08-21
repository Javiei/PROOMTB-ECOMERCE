import React from 'react';

const Reembolsos = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Reembolsos</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Proceso de Reembolso</h2>
          <p className="text-gray-700 mb-4">
            En PROO MTB & ROAD, procesamos los reembolsos una que el producto ha sido recibido e inspeccionado. 
            El tiempo de procesamiento puede variar según el método de pago original.
          </p>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Tiempos de Procesamiento</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Tarjetas de crédito: 5-10 días hábiles</li>
            <li>Transferencias bancarias: 3-5 días hábiles</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Condiciones para el Reembolso</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>El producto debe cumplir con los requisitos de nuestra política de devoluciones</li>
            <li>El monto del reembolso será por el valor del producto, excluyendo los gastos de envío iniciales</li>
            <li>No se realizarán reembolsos por productos dañados por mal uso</li>
          </ul>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-700">
              <span className="font-semibold">Nota:</span> Si recibiste un producto defectuoso o incorrecto, por favor contáctanos 
              dentro de las 48 horas posteriores a la recepción para agilizar el proceso de reembolso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reembolsos;
