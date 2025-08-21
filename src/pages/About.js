import React, { useEffect } from 'react';
import LegalFooter from '../components/LegalFooter';

const About = () => {
  useEffect(() => {
    console.log('About page mounted');
    document.title = 'Sobre Nosotros - PROO MTB & ROAD';
    console.log('Title set');
  }, []);

  console.log('About component rendering');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Sobre <span className="text-purple-600">Nosotros</span>
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            En <span className="font-semibold text-purple-600">PROO MTB & ROAD</span>, somos más que una tienda de bicicletas, somos una familia apasionada por el ciclismo. Fundada en 2020 por Albel Luciano, nacimos del amor por las aventuras sobre dos ruedas y el espíritu de explorar nuevos caminos.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Como ciclista por pasión, desde nuestros primeros días hemos trabajado con dedicación para ofrecer a nuestros clientes productos de la más alta calidad, representando marcas reconocidas a nivel mundial.
          </p>
          
          <blockquote className="relative p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600 my-8">
            <p className="text-gray-700 italic">
              "Gracias a nuestro compromiso con la excelencia y el servicio, hemos construido una fuerte comunidad de ciclistas satisfechos que confían en nosotros para equiparse y mejorar su experiencia en el ciclismo."
            </p>
          </blockquote>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            En <span className="font-semibold text-purple-600">PROO MTB & ROAD</span>, nuestro objetivo es acompañarte en cada pedalada, brindándote asesoría especializada y productos que realzan tu rendimiento y disfrute en cada recorrido.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mt-6 font-medium">
            ¡Únete a nuestra familia de ciclistas y descubre el mundo sobre bicicleta con <span className="text-purple-600">PROO MTB & ROAD</span>!
          </p>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
};

export default About;
