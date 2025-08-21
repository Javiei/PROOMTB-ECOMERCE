import React from 'react';

const Devoluciones = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Devoluciones</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Condiciones para Devoluciones</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Los productos deben devolverse en su empaque original y en perfecto estado.</li>
            <li>El plazo para solicitar una devolución es de 30 días naturales a partir de la fecha de compra.</li>
            <li>El producto no debe mostrar señales de uso ni daños.</li>
            <li>Debes presentar el comprobante de compra original.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Proceso de Devolución</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Contacta a nuestro servicio al cliente para iniciar el proceso de devolución.</li>
            <li>Empaqueta el producto de manera segura, preferiblemente en su empaque original.</li>
            <li>Una vez recibido y verificado el producto, procesaremos tu reembolso.</li>
            <li>El reembolso se realizará mediante el mismo método de pago utilizado en la compra.</li>
          </ol>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-md">
            <p className="text-yellow-700">
              <span className="font-semibold">Nota:</span> Los gastos de envío de la devolución corren por cuenta del cliente, a menos que el producto presente fallas de fábrica o el error sea nuestro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devoluciones;
