import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedSeriesPromo = () => {
    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 border-b border-zinc-200">
            
            {/* Left Column: TAROK (Dark Theme) */}
            <div className="relative bg-zinc-950 text-white py-24 px-8 md:px-12 flex flex-col justify-between items-center text-center overflow-hidden group min-h-[600px] md:min-h-[700px] border-b md:border-b-0 md:border-r border-zinc-800">
                {/* Background Glows */}
                <div className="absolute inset-0 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none opacity-50 group-hover:opacity-85 transition-opacity duration-1000"></div>
                
                {/* Header */}
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.30em] text-purple-400 font-bold mb-3 select-none">
                        THE NEW
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-widest uppercase mb-4 drop-shadow-[0_0_20px_rgba(166,60,242,0.3)]">
                        TAROK
                    </h2>
                    <p className="text-zinc-400 text-xs md:text-sm font-medium tracking-wide max-w-sm leading-relaxed">
                        Chasis completo de carbono de 20.4 kg, suspensión de alto nivel y el revolucionario motor DJI Avinox.
                    </p>
                </div>

                {/* Bike Image & Giant Watermark */}
                <div className="relative w-full max-w-md my-8 flex justify-center items-center">
                    {/* Giant Watermark Text */}
                    <div className="absolute text-[8rem] sm:text-[10rem] md:text-[12rem] font-black uppercase text-white/[0.02] select-none tracking-[0.1em] leading-none text-center pointer-events-none">
                        TAROK
                    </div>

                    <img 
                        src="https://www.raymon-bicycles.com/images/tarok/raymon-bicycles-2026-tarok.png" 
                        alt="Raymon Tarok" 
                        className="relative z-10 w-full h-auto object-contain max-h-[300px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* CTA Button */}
                <Link 
                    to="/series/tarok" 
                    className="relative z-10 inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-black/40"
                >
                    Descubrir TAROK <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Right Column: DUROK (Light Theme) */}
            <div className="relative bg-zinc-50 text-zinc-900 py-24 px-8 md:px-12 flex flex-col justify-between items-center text-center overflow-hidden group min-h-[600px] md:min-h-[700px]">
                {/* Background Glows */}
                <div className="absolute inset-0 bg-white/60 blur-[120px] rounded-full pointer-events-none"></div>
                
                {/* Header */}
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.30em] text-zinc-500 font-bold mb-3 select-none">
                        THE NEW
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-widest uppercase mb-4">
                        DUROK
                    </h2>
                    <p className="text-zinc-600 text-xs md:text-sm font-medium tracking-wide max-w-sm leading-relaxed">
                        Chasis robusto de aluminio AL61-T6, batería extraíble de 800 Wh y la asistencia inteligente DJI Avinox.
                    </p>
                </div>

                {/* Bike Image & Giant Watermark */}
                <div className="relative w-full max-w-md my-8 flex justify-center items-center">
                    {/* Giant Watermark Text */}
                    <div className="absolute text-[8rem] sm:text-[10rem] md:text-[12rem] font-black uppercase text-zinc-950/[0.02] select-none tracking-[0.15em] leading-none text-center pointer-events-none">
                        DUROK
                    </div>

                    <img 
                        src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a312478dc86ce57f6790e8f_raymon-2027-durok-ultra-anthracite_marble-side.avif" 
                        alt="Raymon Durok" 
                        className="relative z-10 w-full h-auto object-contain max-h-[300px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* CTA Button */}
                <Link 
                    to="/series/durok" 
                    className="relative z-10 inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all transform active:scale-95 shadow-md"
                >
                    Descubrir DUROK <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

        </section>
    );
};

export default FeaturedSeriesPromo;
