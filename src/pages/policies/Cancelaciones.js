import React from 'react';

const Cancelaciones = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Cancelaciones</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancelación de Pedidos</h2>
          <p className="text-gray-700 mb-4">
            Si necesitas cancelar tu pedido, por favor contáctanos lo antes posible. 
            Podremos procesar la cancelación siempre y cuando el pedido no haya sido enviado.
          </p>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Tiempos para Cancelación</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Pedidos estándar: Hasta 24 horas después de realizada la compra</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Proceso de Cancelación</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Envía un correo a servicioalcliente@proomtb.com con tu número de pedido</li>
            <li>Espera nuestra confirmación de cancelación</li>
            <li>Recibirás un reembolso completo si el pedido no ha sido enviado</li>
          </ol>
          
          <div className="mt-8 p-4 bg-purple-50 rounded-md">
            <p className="text-purple-700">
              <span className="font-semibold">Importante:</span> Una vez que un pedido ha sido enviado, 
              no puede ser cancelado. En este caso, puedes optar por rechazar el paquete 
              al momento de la entrega o procesar una devolución una vez recibido el producto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancelaciones;
