import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

  // Función para formatear el precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Función para renderizar un producto
  const renderProductCard = (product, index, showBadge = true) => (
    <div
      key={`product-${product.id}`}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 relative w-full max-w-sm mx-auto"
    >
      {showBadge && index < 3 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
            #{index + 1} Más Vendido
          </span>
        </div>
      )}
      
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative pt-[100%] bg-gray-50 group">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-1">
          {product.category || 'Categoría'}
        </span>
        
        <Link to={`/producto/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.old_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.old_price)}
                </span>
              )}
            </div>
            <Link 
              to={`/producto/${product.id}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Ver producto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <button 
            className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Añadir al carrito:', product.id);
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );

  // Tarjeta promocional con imagen y letrero animado
  const PromoCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-full relative group w-full max-w-sm mx-auto">
      {/* Imagen con filtro de oscurecimiento */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
        <img 
          src={require('../assets/Screenshot 2025-07-24 132548.webp')}
          alt="Producto destacado"
          className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
          }}
        />
        
        {/* Letrero animado */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-center py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {Array(5).fill().map((_, i) => (
              <span key={i} className="mx-2 font-bold tracking-wider">
                BEST SELLER • 
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Efecto hover para el botón */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button 
          className="bg-white text-purple-700 font-semibold py-2 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          onClick={() => navigateToShop(navigate, {})}
        >
          Ver Producto
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
            LOS MÁS POPULARES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Productos Destacados
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Los artículos más buscados por nuestros clientes
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden h-full animate-pulse border border-gray-100 shadow-sm">
                <div className="bg-gray-200 h-64 w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm p-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos destacados</h3>
            <p className="text-gray-500 mb-6">Pronto agregaremos nuevos productos a nuestra selección.</p>
            <button 
              onClick={() => navigateToShop(navigate, {})}
              className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Ver Tienda
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {/* Primer producto */}
              {products.length > 0 && (
                <div className="flex justify-center">
                  {renderProductCard(products[0], 0)}
                </div>
              )}
              
              {/* Tarjeta promocional especial */}
              <div className="flex justify-center">
                <PromoCard />
              </div>
              
              {/* Segundo producto */}
              {products.length > 1 && (
                <div className="flex justify-center">
                  {renderProductCard(products[1], 1, false)}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => navigateToShop(navigate, {})}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
