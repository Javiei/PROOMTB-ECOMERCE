import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



const Hero = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Background Video - Vimeo */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <iframe
                    src="https://player.vimeo.com/video/1152285858?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&dnt=1"
                    className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-full h-[56.25vw] transform -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Hero Video"
                ></iframe>
            </div>
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-start max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-white max-w-2xl pt-20">
                    <span className="inline-block py-1 px-3 border border-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                        Novedades 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic leading-tight mb-8">
                        Domina <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            El Sendero
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg font-light leading-relaxed">
                        Ingeniería de precisión para quienes buscan superar sus límites. Descubre la nueva generación de e-bikes Raymon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/catalogo" className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all transform hover:-translate-y-1 text-center inline-flex items-center justify-center">
                            Ver Bicicletas
                        </Link>
                        <Link
                            to="/accesorios"
                            className="border border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-center inline-flex items-center justify-center"
                        >
                            Ver Accesorios
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
