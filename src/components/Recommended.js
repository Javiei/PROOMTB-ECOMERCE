import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

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
        
        // Consulta simple para obtener los productos más recientes
        console.log('Obteniendo productos más recientes...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
          
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
          setRecommendations(processedData.slice(0, 4));
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            BASADO EN TUS GUSTOS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Productos recomendados especialmente para ti
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl overflow-hidden h-full animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <Link 
                to={`/producto/${product.id}`}
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group block"
              >
              {/* Product Image */}
              <div className="relative pb-[100%] bg-gray-100">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Error loading image:', product.images[0]);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 h-12">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">
                    {formatPrice(product.price)}
                  </span>
                  <Link 
                    to={`/producto/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Ver más
                  </Link>
                </div>
                {product.old_price && (
                  <p className="text-sm text-gray-500 line-through mt-1">
                    {formatPrice(product.old_price)}
                  </p>
                )}
              </div>
              </Link>
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
