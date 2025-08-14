import React from 'react';
// Import sponsor images
import montecciLogo from '../assets/MONTECCI_LOGOS-02.webp';
import orbeaLogo from '../assets/orbea-logo.svg';
import khsLogo from '../assets/khs-logo.webp';
import scottLogo from '../assets/scott.webp';

const BrandsStrip = () => {
  const sponsors = [
    {
      id: 1,
      name: 'Montecci',
      image: montecciLogo,
      placeholder: 'MONTECCI'
    },
    {
      id: 2,
      name: 'Orbea',
      image: orbeaLogo,
      placeholder: 'ORBEA'
    },
    {
      id: 3,
      name: 'KHS',
      image: khsLogo,
      placeholder: 'KHS'
    },
    {
      id: 4,
      name: 'Scott',
      image: scottLogo,
      placeholder: 'SCOTT'
    }
  ];

  return (
    <section className="bg-white py-16 border-b relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
              {sponsor.image ? (
                <img 
                  src={sponsor.image} 
                  alt={sponsor.name}
                  className="h-20 md:h-24 w-auto max-w-[140px] md:max-w-[180px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="h-20 md:h-24 w-36 md:w-44 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400 font-medium text-center">
                    {sponsor.placeholder}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Brand partnership text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-medium">
            Marcas asociadas y patrocinadores oficiales
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandsStrip;
