import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToShop } from '../utils/navigation';

const Featured = () => {
  const navigate = useNavigate();
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {/* Placeholder for video - replace with actual video file */}
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src="/0722.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark Overlay Mask */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Deal Exclusivo PROOMTB
            </h2>
            <p className="text-lg md:text-xl mb-6 opacity-90 leading-relaxed">
              Todo lo que buscas para tu bici y más, en un solo lugar.
              Encuentra equipos, accesorios, llantas y todo lo necesario
              para rodar mejor.
            </p>
            <p className="text-base md:text-lg mb-8 opacity-80">
              ¿Listo para tu próxima aventura?
            </p>
            
            {/* Call to Action Button */}
            <button 
              onClick={() => navigateToShop(navigate, {})}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Ir A La Tienda
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
};

export default Featured;
