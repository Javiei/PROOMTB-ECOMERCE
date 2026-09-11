import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, Bike, Coffee, Music, Gift, MapPin } from 'lucide-react';
import flyerImage from '../../assets/flyer-aguinaldo-navideno.jpg';

const AguinaldoPromo = () => {
    return (
        <section className="relative w-full bg-[#0c0d12] py-20 md:py-28 overflow-hidden group border-t border-b border-white/5">
            {/* Background Festive Lights & Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column - Styled Flyer Preview with animations */}
                    <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group/flyer w-full max-w-sm aspect-[9/16] max-h-[520px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(239,68,68,0.2)] border border-red-500/20 backdrop-blur-sm bg-neutral-900/60 p-2"
                        >
                            <img 
                                src={flyerImage} 
                                alt="Flyer Oficial del Águinaldo Navideño ProoMTB x Raymon" 
                                className="w-full h-full object-cover rounded-2xl transform group-hover/flyer:scale-102 transition-transform duration-700 ease-out"
                            />
                            
                            {/* Corner Accent Badge */}
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Evento Navideño</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Text content & CTA */}
                    <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 35 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 px-4 py-2 rounded-full">
                                <Sparkles size={14} className="text-red-400" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-red-300">
                                    ¡Inscripciones Abiertas • Totalmente Gratis!
                                </span>
                            </div>

                            {/* Headline */}
                            <div className="space-y-2">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white">
                                    ÁGUINALDO <br />
                                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                                        Navideño 2026
                                    </span>
                                </h2>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                    PRO MTB & ROAD <span className="text-red-500">✕</span> RAYMON
                                </p>
                            </div>

                            {/* Paragraph */}
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
                                Ven a celebrar la temporada navideña sobre ruedas este <b className="text-white">Martes 1 de Diciembre</b>. Disfruta de una rodada nocturna especial con asistencia, chocolate caliente gratis para todos los participantes, música en vivo y una gran rifa de fin de año.
                            </p>

                            {/* 4 Feature Badges Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl pt-2">
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5">
                                    <Bike className="text-red-400" size={20} />
                                    <span className="text-[11px] font-black uppercase text-white">Ruta Ciclista</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5">
                                    <Coffee className="text-amber-400" size={20} />
                                    <span className="text-[11px] font-black uppercase text-white">Chocolate Caliente</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5">
                                    <Music className="text-purple-400" size={20} />
                                    <span className="text-[11px] font-black uppercase text-white">Música en Vivo</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5">
                                    <Gift className="text-emerald-400" size={20} />
                                    <span className="text-[11px] font-black uppercase text-white">Gran Rifa</span>
                                </div>
                            </div>

                            {/* Price and CTA Grid */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entrada</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white">GRATIS</span>
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                            Cupos Limitados
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 max-w-xs">
                                    <Link 
                                        to="/registro-aguinaldo" 
                                        className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4.5 rounded-2xl text-sm font-black uppercase tracking-wider hover:brightness-110 shadow-[0_10px_30px_rgba(239,68,68,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        Inscribirme Gratis
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AguinaldoPromo;
