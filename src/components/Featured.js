import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToShop } from '../utils/navigation';
import ChristmasPromo from './ChristmasPromo';

const Featured = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('right');
  const videoRefs = React.useRef([]);

  const slides = [
    {
      id: 1,
      content: (
        <div className="relative h-[80vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <video 
              ref={el => videoRefs.current[0] = el}
              className="w-full h-full object-cover"
              autoPlay 
              loop
              playsInline
              muted={true}
              preload="auto"
            >
              <source src="/0722.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div>
          <video 
            ref={el => videoRefs.current[1] = el}
            className="w-full h-full object-cover"
            autoPlay 
            loop
            playsInline
            muted={currentSlide !== 1}
            style={{ display: 'none' }}
          >
            <source src="" type="video/mp4" />
          </video>
          <ChristmasPromo navigate={navigate} />
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div className="relative h-[80vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <video 
              ref={el => videoRefs.current[2] = el}
              className="w-full h-full object-cover"
              autoPlay  
              loop
              playsInline
              muted={false}
              preload="auto"
            >
              <source src="/videos/IMG_8072.MP4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Mantenimiento a domicilio
                </h2>
                <p className="text-lg md:text-xl mb-6 opacity-90 leading-relaxed">
                  Contactanos para que nuestro equipo pueda visitarte en tu domicilio y realizar el mantenimiento a tu bicicleta.
                </p>
                <button
  // Se cambia la acción onClick para redirigir directamente a la URL de WhatsApp
  onClick={() => window.location.href = 'https://wa.me/18297163555'}
  className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
>
  Contactanos
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Control de reproducción de videos
  useEffect(() => {
    let isMounted = true;
    
    const handleVideoPlayback = () => {
      videoRefs.current.forEach((video, index) => {
        if (!video) return;
        
        if (index === currentSlide) {
          // Para el video activo (solo el tercer slide con sonido)
          if (index === 2) {
            video.muted = false; // Tercer slide con sonido
          } else {
            video.muted = true; // Otros slides sin sonido
          }
          
          // Reproducir el video actual
          setTimeout(() => {
            if (!isMounted) return;
            video.play().catch(() => {
              // Si falla, forzar muted y volver a intentar
              video.muted = true;
              video.play().catch(() => {});
            });
          }, 100);
        } else {
          // Para videos inactivos
          video.muted = true;
          video.pause();
        }
      });
    };

    const timer = setTimeout(handleVideoPlayback, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentSlide]);

  // Control del tiempo de cada slide
  useEffect(() => {
    // Duración base de cada slide (8 segundos)
    let slideDuration = 8000;
    
    // Si es el último slide (índice 2), duplicar el tiempo
    if (currentSlide === 2) {
      slideDuration = 15000; // 15 segundos para el último slide
    }
    
    const timer = setTimeout(() => {
      goToNext();
    }, slideDuration);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const goToNext = () => {
    setDirection('right');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setDirection('left');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Slides Container */}
      <div className="h-full flex">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {slide.content}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-110"
        aria-label="Diapositiva anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-110"
        aria-label="Siguiente diapositiva"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};

export default Featured;