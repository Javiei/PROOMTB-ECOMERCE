import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            TIENDA
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bicicletas Section */}
          <a 
            href="#bicicletas" 
            className="relative rounded-2xl overflow-hidden group cursor-pointer block transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative h-80 md:h-96">
              {/* Background Image - Replace with actual image when uploaded */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500"></div>
              
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">BICICLETAS</h3>
                <p className="text-white text-lg opacity-90 mb-6 max-w-sm">
                  Descubre nuestra amplia gama de bicicletas para todos los estilos y terrenos
                </p>
                <div className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold text-lg group-hover:bg-gray-100 transition-colors">
                  EXPLORAR
                </div>
              </div>
            </div>
          </a>

          {/* Equipamiento Section */}
          <a 
            href="#equipamiento" 
            className="relative rounded-2xl overflow-hidden group cursor-pointer block transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative h-80 md:h-96">
              {/* Background Image - Replace with actual image when uploaded */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-500"></div>
              
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">EQUIPAMIENTO</h3>
                <p className="text-white text-lg opacity-90 mb-6 max-w-sm">
                  Accesorios y equipos de protección para una experiencia completa
                </p>
                <div className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold text-lg group-hover:bg-gray-100 transition-colors">
                  VER TODO
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-3">🚵‍♀️</div>
            <h4 className="font-semibold text-gray-800">Montaña</h4>
          </div>
          <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-3">🚴‍♂️</div>
            <h4 className="font-semibold text-gray-800">Ruta</h4>
          </div>
          <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-3">🚲</div>
            <h4 className="font-semibold text-gray-800">Urbana</h4>
          </div>
          <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-gray-800">Eléctrica</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
