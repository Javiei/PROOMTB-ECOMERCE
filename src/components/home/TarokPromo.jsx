import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TarokPromo = () => {
    return (
        <section className="relative w-full bg-black py-24 overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-600/20 blur-[120px] rounded-full translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-600/10 blur-[100px] rounded-full -translate-x-1/2 opacity-30 group-hover:opacity-70 transition-opacity duration-1000"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center">
                    
                    {/* Center Column Content */}
                    <div className="flex flex-col items-center text-center">
                        {/* THE NEW TAROK "Logo" style */}
                        <div className="flex flex-col items-center mb-12 select-none leading-none">
                            <span 
                                className="text-4xl md:text-6xl font-black italic tracking-widest"
                                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent', marginBottom: '-0.1em' }}
                            >
                                THE NEW
                            </span>
                            <span className="text-6xl md:text-[7rem] font-black italic text-white tracking-[0.2em] drop-shadow-[0_0_30px_rgba(166,60,242,0.5)]">
                                TAROK
                            </span>
                        </div>

                        {/* Large Product Image */}
                        <div className="relative mb-16 max-w-5xl mx-auto">
                            {/* Glow Behind Bike */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-purple-600/20 blur-[100px] rounded-full opacity-60"></div>
                            
                            <img 
                                src="https://www.raymon-bicycles.com/images/tarok/raymon-bicycles-2026-tarok.png" 
                                alt="Raymon Tarok" 
                                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        {/* CTA Button */}
                        <Link 
                            to="/series/tarok" 
                            className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 text-sm font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(166,60,242,0.4)] shadow-2xl relative z-10"
                        >
                            Descubrir TAROK <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator or Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>
    );
};

export default TarokPromo;
