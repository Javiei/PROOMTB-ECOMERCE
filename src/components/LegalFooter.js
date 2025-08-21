import React from 'react';
import { Link } from 'react-router-dom';

const LegalFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Políticas */}
          <div>
            <h3 className="text-xl font-bold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/politicas/devoluciones" className="hover:text-purple-400 transition-colors">
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/politicas/reembolsos" className="hover:text-purple-400 transition-colors">
                  Política de Reembolsos
                </Link>
              </li>
              <li>
                <Link to="/politicas/cancelaciones" className="hover:text-purple-400 transition-colors">
                  Política de Cancelaciones
                </Link>
              </li>
              <li>
                <Link to="/politicas/entregas" className="hover:text-purple-400 transition-colors">
                  Política de Entregas
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicio al Cliente */}
          <div>
            <h3 className="text-xl font-bold mb-4">Servicio al Cliente</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium">Correo Electrónico:</p>
                  <a href="mailto:servicioalcliente@proomtb.com" className="text-purple-400 hover:underline">
                    servicioalcliente@proomtb.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium">Teléfono:</p>
                  <a href="tel:+18297613555" className="text-purple-400 hover:underline">
                    +1 (829) 761-3555
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Horario de Atención:</p>
                  <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  <p>Sábados: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-xl font-bold mb-4">Información Importante</h3>
            <p className="mb-4">
              En PROO MTB & ROAD nos comprometemos a ofrecerte la mejor experiencia de compra. 
              Antes de realizar tu compra, te recomendamos revisar nuestras políticas para conocer 
              tus derechos y responsabilidades como cliente.
            </p>
            <p>
              Para cualquier duda o aclaración, no dudes en contactar a nuestro equipo de 
              servicio al cliente, quienes estarán encantados de ayudarte.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PROO MTB & ROAD. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;
