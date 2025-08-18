import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import proomtbImage from '../assets/PROOMTB (1).png';
import orcaMyo from '../assets/orca-myo.png';
import { navigateToShop } from '../utils/navigation';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Bicicletas de Montaña PRO",
      subtitle: "Conquista cualquier terreno",
      description: "Diseñadas para los aventureros más exigentes. Tecnología de punta y máximo rendimiento en cada ruta.",
      buttonText: "Explorar Bicicletas",
      background: "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900",
      image: "🚵‍♂️",
      overlay: "bg-gradient-to-r from-blue-900/90 to-blue-800/80"
    },
    {
      id: 2,
      title: "Bicicletas Urbanas",
      subtitle: "Estilo y comodidad",
      description: "Diseñadas para la ciudad, combinan elegancia y funcionalidad en cada detalle.",
      buttonText: "Ver Urbanas",
      background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      image: orcaMyo,
      overlay: "bg-gradient-to-r from-gray-900/80 to-gray-800/70",
      hasImage: true
    },
    {
      id: 3,
      title: "Equipamiento Premium",
      subtitle: "Alto rendimiento",
      description: "Todo el equipamiento que necesitas para llevar tu experiencia al siguiente nivel.",
      buttonText: "Ver Equipamiento",
      background: "bg-gradient-to-br from-cyan-700 via-cyan-600 to-cyan-700",
      image: "🛠️",
      overlay: "bg-gradient-to-r from-cyan-800/90 to-cyan-700/80"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[90vh] md:h-screen overflow-hidden">
      {/* Carousel Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-full flex items-center justify-center relative" style={{
              backgroundImage: slide.background === 'image' ? `url(${slide.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Background for gradient slides */}
              {slide.background !== 'image' && (
                <div className={`absolute inset-0 ${slide.background}`}></div>
              )}
              {/* Dark overlay */}
              <div className={`absolute inset-0 ${slide.overlay}`}></div>
              
              {/* Content */}
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center h-full">
                  {/* Text Content */}
                  <div className="lg:w-1/2 text-white text-center lg:text-left mb-8 lg:mb-0 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-sm uppercase tracking-widest font-semibold text-cyan-400 mb-4">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
                      {slide.description}
                    </p>
                    <button 
                      onClick={() => {
                        const filters = {};
                        if (slide.id === 1) filters.category = 'bicicletas';
                        if (slide.id === 2) filters.category = 'urbanas';
                        if (slide.id === 3) filters.category = 'accesorios';
                        navigateToShop(navigate, filters);
                      }}
                      className="bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
                    >
                      {slide.buttonText}
                    </button>
                  </div>

                  {/* Image/Icon */}
                  <div className="lg:w-1/2 flex justify-center lg:justify-end items-center p-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full transform scale-150 opacity-20"></div>
                      {slide.hasImage ? (
                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="relative text-8xl md:text-9xl lg:text-[10rem] p-8 md:p-12 lg:p-16 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-2xl">
                          {slide.image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-cyan-500/80 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 z-20 border border-white/10"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-cyan-500/80 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 z-20 border border-white/10"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-10 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-cyan-400 scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 text-white z-20 hidden md:block">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-xs font-medium tracking-widest text-cyan-300 mb-1">DESLIZA</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
