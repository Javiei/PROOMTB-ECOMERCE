import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import cyclingImage from '../assets/Screenshot 2025-07-24 132548.webp';
import { navigateToProduct, navigateToShop } from '../utils/navigation';

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('section', 'mas_vendidos')
        .order('created_at', { ascending: false });
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    fetchBestSellers();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className=" mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            MÁS VENDIDOS
          </h2>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500 py-12">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-12">No hay productos en 'Más Vendidos'.</div>
          ) : (
            // Si hay 2 o más productos, inserta cycling card en el medio
            (() => {
              if (products.length < 2) {
                return products.map((product) => (
                  <div 
                    onClick={() => navigateToProduct(navigate, product.id)}
                    key={product.id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-64 object-contain" />
                      ) : (
                        <div className="text-6xl group-hover:scale-110 transition-transform">🚲</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${parseFloat(product.price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Agregar al Carrito</button>
                    </div>
                  </div>
                ));
              }
              // Si hay 2 o más, renderiza: producto[0], cycling card, producto[1], producto[2]...
              const cards = [];
              // Primer producto
              cards.push(
                <div 
                  onClick={() => navigateToProduct(navigate, products[0].id)}
                  key={products[0].id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center">
                    {products[0].image_url ? (
                        <img src={products[0].image_url} alt={products[0].name} className="h-64 object-contain" />
                      ) : (
                      <div className="text-6xl group-hover:scale-110 transition-transform">🚲</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{products[0].name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${parseFloat(products[0].price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Agregar al Carrito</button>
                  </div>
                </div>
              );
              // Cycling card decorativo fijo
              cards.push(
                <div key="cycling-card" className="relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group block transform hover:scale-[1.02] cursor-pointer">
                  <div className="relative h-96 md:h-[500px] w-full flex flex-col justify-end">
                    <img 
                      src={cyclingImage} 
                      alt="Cycling - Ir a la tienda" 
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12">
                      <div className="flex items-center gap-2 mb-4">
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 py-4 overflow-hidden">
                      <div className="whitespace-nowrap animate-scroll">
                        <span className="text-white font-bold text-xl mx-8">LOS MÁS VENDIDOS</span>
                        <span className="text-white font-bold text-xl mx-8">→</span>
                        <span className="text-white font-bold text-xl mx-8">LOS MÁS VENDIDOS</span>
                        <span className="text-white font-bold text-xl mx-8">→</span>
                        <span className="text-white font-bold text-xl mx-8">LOS MÁS VENDIDOS</span>
                        <span className="text-white font-bold text-xl mx-8">→</span>
                        <span className="text-white font-bold text-xl mx-8">LOS MÁS VENDIDOS</span>
                        <span className="text-white font-bold text-xl mx-8">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              // Segundo producto (si existe)
              if (products[1]) {
                cards.push(
                  <div 
                    onClick={() => navigateToProduct(navigate, products[1].id)}
                    key={products[1].id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center">
                      {products[1].image_url ? (
                        <img src={products[1].image_url} alt={products[1].name} className="h-64 object-contain" />
                      ) : (
                        <div className="text-6xl group-hover:scale-110 transition-transform">🚲</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{products[1].name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${parseFloat(products[1].price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Agregar al Carrito</button>
                    </div>
                  </div>
                );
              }
              // Resto de productos (si hay más de 2)
              for (let i = 2; i < products.length; i++) {
                cards.push(
                  <div 
                    onClick={() => navigateToProduct(navigate, products[i].id)}
                    key={products[i].id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center">
                      {products[i].image_url ? (
                        <img src={products[i].image_url} alt={products[i].name} className="h-64 object-contain" />
                      ) : (
                        <div className="text-6xl group-hover:scale-110 transition-transform">🚲</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{products[i].name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${parseFloat(products[i].price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Agregar al Carrito</button>
                    </div>
                  </div>
                );
              }
              return cards;
            })()
          )}
        </div>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigateToShop(navigate, {})}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Ver Todos los Productos
          </button>
        </div>
    </section>
  );
};

export default BestSellers;
