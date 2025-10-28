import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ChristmasOffers = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChristmasBikes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .order('discount_percentage', { ascending: false });

        if (error) throw error;
        setBikes(data || []);
      } catch (error) {
        console.error('Error fetching Christmas bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChristmasBikes();
  }, []);

  const handleProductClick = (bikeId) => {
    navigate(`/producto/${bikeId}?from=christmas`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 to-red-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1713184149461-69b0abeb3daa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2ljbGlzbW98ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎄 Ofertas Navideñas 2025</h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            Descuentos especiales en bicicletas para toda la familia esta Navidad
          </p>
          <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block">
            ¡Solo por tiempo limitado!
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-4 py-12">
        {bikes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">No hay ofertas disponibles en este momento</h2>
            <p className="text-gray-500 mt-2">Vuelve pronto para ver nuestras ofertas especiales</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bikes.map((bike) => (
              <div 
                key={bike.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleProductClick(bike.id)}
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  -{bike.discount_percentage}%
                </div>

                {/* Product Image */}
                <div className="h-64 bg-gray-100 relative">
                  {bike.image_url ? (
                    <img
                      src={bike.image_url}
                      alt={bike.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <span>Imagen no disponible</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {bike.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-sm text-gray-500 line-through">
                        ${bike.price?.toLocaleString('es-ES')}
                      </span>
                      <div className="text-xl font-bold text-red-600">
                        ${(bike.price * (1 - bike.discount_percentage / 100)).toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí iría la lógica para añadir al carrito
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
      </div>

      {/* CTA Section */}
      <div className="bg-red-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Buscas algo más?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra tienda completa y descubre más ofertas especiales para esta Navidad.
          </p>
          <button
            onClick={() => navigate('/tienda')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 inline-flex items-center"
          >
            Ver tienda completa
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChristmasOffers;
