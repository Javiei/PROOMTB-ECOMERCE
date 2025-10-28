import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToShop } from '../utils/navigation';
import { supabase } from '../supabaseClient';

const ChristmasPromo = ({ navigate }) => {
  const [featuredBikes, setFeaturedBikes] = useState([]);
  console.log('Bicicletas destacadas:', featuredBikes); // Para depuración
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBikes = async () => {
      try {
        setLoading(true);
        // Primero obtenemos los IDs de las bicicletas en oferta
        const { data: offersData, error: offersError } = await supabase
          .from('bikes_navidad_2025')
          .select('bike_id, discount_percentage')
          .order('discount_percentage', { ascending: false })
          .limit(3);

        if (offersError) throw offersError;
        
        if (offersData && offersData.length > 0) {
          // Obtenemos los detalles completos de las bicicletas
          const bikeIds = offersData.map(item => item.bike_id);
          
          const { data: bikesData, error: bikesError } = await supabase
            .from('products')
            .select('*')
            .in('id', bikeIds);
            
          if (bikesError) throw bikesError;
          
          if (bikesData) {
            // Mantenemos el orden original de los IDs
            const orderedBikes = bikeIds.map(id => 
              bikesData.find(bike => bike.id === id)
            ).filter(Boolean);
            
            // Añadimos la información de descuento
            const bikesWithDiscount = orderedBikes.map(bike => {
              const offer = offersData.find(o => o.bike_id === bike.id);
              return {
                ...bike,
                discount_percentage: offer?.discount_percentage || 0,
                original_price: bike.price,
                price: bike.price * (1 - (offer?.discount_percentage || 0) / 100)
              };
            });
            
            setFeaturedBikes(bikesWithDiscount);
          }
        }
      } catch (error) {
        console.error('Error al cargar ofertas destacadas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBikes();
  }, []);
  return (
    <div className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Christmas Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-red-900">
        <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1713184149461-69b0abeb3daa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2ljbGlzbW98ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        {/* Christmas lights */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-green-500 to-yellow-400 animate-pulse"></div>
      </div>

      {/* Snowflakes */}
      <div className="snowflakes" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white text-center mx-auto">
            <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4 animate-bounce">
              🎄 OFERTAS DE NAVIDAD 🎄
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
              ¡Feliz Navidad de Proomtb!
            </h2>
            <p className="text-xl md:text-2xl mb-6 opacity-90 leading-relaxed">
              Descuentos especiales en nuestras bicicletas
            </p>
            
            {/* Productos destacados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 max-w-4xl mx-auto">
              {loading ? (
                // Mostrar placeholders de carga
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-4 animate-pulse">
                    <div className="bg-white/20 h-32 rounded-md mb-3"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                // Mostrar bicicletas destacadas
                featuredBikes.map((bike) => (
                  <div 
                    key={bike.id} 
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => navigate(`/producto/${bike.id}`)}
                  >
                    {bike.image_url ? (
                      <img 
                        src={bike.image_url} 
                        alt={bike.name}
                        className="w-full h-32 object-contain mb-3"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/200x150?text=Imagen+no+disponible';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-white/20 rounded-md mb-3 flex items-center justify-center">
                        <span className="text-white/50">Sin imagen</span>
                      </div>
                    )}
                    <h3 className="text-white font-semibold truncate">{bike.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-yellow-300 font-bold">
                        ${(bike.price * (1 - bike.discount_percentage / 100)).toFixed(2)}
                      </span>
                      <span className="text-white/70 text-sm line-through">
                        ${bike.price?.toFixed(2)}
                      </span>
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        -{bike.discount_percentage}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => navigate('/ofertas-navidad')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Ver Todas las Ofertas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      

      <style jsx global>{`
        @keyframes snow {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .snowflakes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .snowflake {
          position: absolute;
          color: white;
          font-size: 1.5rem;
          animation: snow linear forwards;
          animation-duration: 5s;
          opacity: 0;
        }
        
        ${[...Array(12)].map((_, i) => `
          .snowflake:nth-child(${i + 1}) {
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${5 + Math.random() * 10}s;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default ChristmasPromo;
