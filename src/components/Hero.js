import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import proomtbImage from '../assets/PROOMTB (1).png';
import { navigateToShop } from '../utils/navigation';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Nuevas Bicicletas de Montaña",
      subtitle: "Conquista cualquier terreno",
      description: "Descubre nuestra nueva colección de bicicletas de montaña diseñadas para los aventureros más exigentes.",
      buttonText: "Explorar Colección",
      backgroundImage: proomtbImage,
      image: "🚵‍♂️"
    },
    {
      id: 2,
      title: "Bicicletas Urbanas Premium",
      subtitle: "Movilidad inteligente",
      description: "Perfectas para la ciudad. Estilo, comodidad y eficiencia en cada pedalada.",
      buttonText: "Ver Modelos",
      background: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
      image: "🚲"
    },
    {
      id: 3,
      title: "Equipamiento Profesional",
      subtitle: "Máximo rendimiento",
      description: "Accesorios y equipos de la más alta calidad para ciclistas profesionales.",
      buttonText: "Descubrir Más",
      background: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600",
      image: "🏆"
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
    <section className="relative h-screen overflow-hidden">
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
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Content */}
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center h-full">
                  {/* Text Content */}
                  <div className="lg:w-1/2 text-white text-center lg:text-left mb-8 lg:mb-0">
                    <h2 className="text-sm uppercase tracking-wider mb-4 opacity-90">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
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
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.buttonText}
                    </button>
                  </div>

                  {/* Image/Icon */}
                  <div className="lg:w-1/2 flex justify-center lg:justify-end">
                    <div className="text-8xl md:text-9xl lg:text-[12rem] opacity-80">
                      {slide.image}
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
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 text-white z-20">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-sm mb-2 opacity-75">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
