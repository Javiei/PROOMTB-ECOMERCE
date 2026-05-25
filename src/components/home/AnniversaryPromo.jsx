import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Award, CheckCircle, Ticket } from 'lucide-react';
import flyerImage from '../../assets/flyer-proomtb-1920x1080.jpg.jpeg';

const AnniversaryPromo = () => {
    return (
        <section className="relative w-full bg-black py-24 md:py-32 overflow-hidden group">
            {/* Background Neon Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#00e5ff]/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column - Styled Flyer Preview with animations */}
                    <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group/flyer w-full max-w-lg aspect-[16/9] lg:aspect-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-sm bg-neutral-900/50 p-2"
                        >
                            {/* Inner border element */}
                            <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl pointer-events-none group-hover/flyer:border-cyan-500/50 transition-colors duration-500"></div>
                            
                            <img 
                                src={flyerImage} 
                                alt="Flyer Oficial del 6to Aniversario ProoMTB" 
                                className="w-full h-full object-cover rounded-2xl transform group-hover/flyer:scale-102 transition-transform duration-700 ease-out"
                            />
                            
                            {/* Corner Accents */}
                            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Evento Oficial</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Text content & CTA */}
                    <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 35 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-4 py-2 rounded-full">
                                <Award size={14} className="text-[#00e5ff]" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#00e5ff]">
                                    ¡Inscripciones Abiertas!
                                </span>
                            </div>

                            {/* Headline */}
                            <div className="space-y-2">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white italic">
                                    6to Aniversario <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-cyan-400 font-extrabold not-italic drop-shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                                        PROO MTB & ROAD
                                    </span>
                                </h2>
                            </div>

                            {/* Paragraph */}
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
                                Únete al evento más esperado de la temporada. Celebramos seis años rodando juntos con una ruta espectacular, kits oficiales premium, rifas exclusivas y la mejor vibra de la comunidad ciclista.
                            </p>

                            {/* Event Kit Includes */}
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-md max-w-xl">
                                <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-white/5 pb-2">
                                    ¿Qué incluye tu inscripción?
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                                        <CheckCircle size={16} className="text-[#00e5ff] shrink-0" />
                                        <span>Jersey Oficial del Evento</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                                        <CheckCircle size={16} className="text-[#00e5ff] shrink-0" />
                                        <span>Kit del Evento & Regalos</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                                        <CheckCircle size={16} className="text-[#00e5ff] shrink-0" />
                                        <span>Boleto para Rifa de Bicicleta</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                                        <CheckCircle size={16} className="text-[#00e5ff] shrink-0" />
                                        <span>Soporte, Hidratación & Fotos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price and CTA Grid */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Costo de Entrada</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-black text-white">RD$ 2,950</span>
                                        <span className="text-xs text-[#00e5ff] font-bold uppercase tracking-widest bg-[#00e5ff]/10 px-2 py-0.5 rounded">¡PRECIO ESPECIAL!</span>
                                    </div>
                                </div>

                                <div className="flex-1 max-w-xs">
                                    <Link 
                                        to="/registro-aniversario" 
                                        className="group w-full inline-flex items-center justify-center gap-3 bg-[#00e5ff] text-black px-8 py-4.5 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-[#00cce6] hover:shadow-[0_15px_40px_rgba(0,229,255,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        Inscribirme Ahora
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Separator line at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>
    );
};

export default AnniversaryPromo;
