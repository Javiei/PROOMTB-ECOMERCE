import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { createSlug } from '../utils/stringUtils';

const Recommended = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Obtener productos recomendados
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Iniciando búsqueda de productos recomendados...');
        
        // Obtener todos los productos y luego seleccionar 4 aleatorios
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        console.log('Resultado de la consulta:', { 
          dataLength: data?.length, 
          hasError: !!error,
          error: error 
        });
        
        if (error) {
          console.error('Error al obtener productos:', error);
          throw new Error('No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.');
        }
        
        if (!data || data.length === 0) {
          console.log('No se encontraron productos en la base de datos.');
          setError('No hay productos disponibles en este momento.');
          return;
        }
        
        console.log('Productos obtenidos exitosamente:', data);
        
        // Actualizar el estado con los productos obtenidos
        if (data && data.length > 0) {
          // Procesar las imágenes de manera consistente con Shop.js
          const processedData = data.map(product => {
            // Intentar obtener la URL de la imagen de diferentes maneras
            let imageUrl = '';
            
            // 1. Verificar si hay un array de imágenes
            if (Array.isArray(product.images) && product.images.length > 0) {
              imageUrl = product.images[0];
              // Si es un objeto con propiedad url
              if (typeof imageUrl === 'object' && imageUrl.url) {
                imageUrl = imageUrl.url;
              }
            } 
            // 2. Verificar si hay una propiedad image
            else if (product.image) {
              imageUrl = product.image;
            } 
            // 3. Verificar si hay una propiedad image_url
            else if (product.image_url) {
              imageUrl = product.image_url;
            }
            
            // Asegurarse de que la URL sea absoluta
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
              imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
            }
            
            return {
              ...product,
              // Usar la URL procesada en un array para mantener consistencia
              images: imageUrl ? [imageUrl] : []
            };
          });
          console.log('Productos procesados:', processedData);
          // Mezclar aleatoriamente y tomar 4
          const shuffled = processedData.sort(() => 0.5 - Math.random());
          setRecommendations(shuffled.slice(0, 4));
        } else {
          setError('No hay productos disponibles para mostrar.');
        }
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        setError('No se pudieron cargar las recomendaciones. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendedProducts();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
            RECOMENDACIONES PERSONALIZADAS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Basado en tus gustos
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Productos seleccionados especialmente para ti
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
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm p-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
              >
                <Link to={`/producto/${createSlug(product.name)}`} className="block">
                  {/* Product Image */}
                  <div className="relative pt-[100%] bg-gray-50 group">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Error loading image:', product.images[0]);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    {/* Badge de descuento */}
                    {product.old_price && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-1">
                    {product.category || 'Categoría'}
                  </span>
                  
                  <Link to={`/producto/${createSlug(product.name)}`} className="block">
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
                        to={`/producto/${createSlug(product.name)}`}
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
                        // Aquí iría la lógica para añadir al carrito
                        console.log('Añadir al carrito:', product.id);
                      }}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/tienda"
            className="inline-block border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Ver Más Productos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Recommended;
