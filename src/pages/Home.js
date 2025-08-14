import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explora Nuestras Categorías</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de ciclismo para todas tus necesidades
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Sección de Bicicletas */}
          <Link 
            to="/tienda?category=bicicletas" 
            className="relative rounded-2xl overflow-hidden group h-80 md:h-96 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">BICICLETAS</h2>
              <p className="text-lg md:text-xl opacity-90 mb-6 max-w-md">
                Descubre nuestra colección de bicicletas de alto rendimiento para todos los terrenos
              </p>
              <div className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold text-lg group-hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-105">
                VER COLECCIÓN
              </div>
            </div>
          </Link>

          {/* Sección de Equipamiento */}
          <Link 
            to="/tienda?category=accesorios" 
            className="relative rounded-2xl overflow-hidden group h-80 md:h-96 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536244881128-91b3ca09438e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">EQUIPAMIENTO</h2>
              <p className="text-lg md:text-xl opacity-90 mb-6 max-w-md">
                Todo el equipamiento que necesitas para tu próxima aventura sobre ruedas
              </p>
              <div className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold text-lg group-hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-105">
                VER PRODUCTOS
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
