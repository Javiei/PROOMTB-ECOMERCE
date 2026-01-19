import React from 'react';
import { Wrench, ShieldCheck, Zap, ArrowRight, Truck } from 'lucide-react';

const ServiceMarketing = () => {
    return (
        <section id="mantenimiento" className="relative bg-black py-24 lg:py-32 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-40">
                <img
                    src="https://bikebrothers.es/img/cms/bikebrothers_tienda_taller_bicicletas63.jpg"
                    alt="PROOMTB Professional Workshop"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="lg:w-1/2 text-white">
                    <span className="inline-block py-1 px-3 border border-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                        Servicio Técnico Elite
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-8 tracking-tighter">
                        Taller <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            Profesional
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-xl font-light leading-relaxed">
                        En PROOMTB & ROAD, no solo vendemos bicicletas; garantizamos su rendimiento eterno.
                        Nuestro taller especializado cuenta con mecánicos certificados y herramientas de precisión para mantener tu bicicleta como el primer día.
                    </p>

                    <div className="space-y-8 mb-10">
                        {/* Packages */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                href="https://wa.me/8297163555?text=Hola,%20me%20interesa%20el%20Mantenimiento%20Básico%20para%20mi%20bicicleta."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border border-white/20 p-6 bg-white/5 backdrop-blur-sm rounded-sm hover:border-white/40 transition-colors cursor-pointer group hover:bg-white/10"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold uppercase mb-1 text-white group-hover:text-raymon-blue transition-colors">Mantenimiento Básico</h3>
                                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="text-2xl font-black text-gray-200 mb-4">RD$700</div>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Lavado premium</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Engrase de Cadena</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Ajuste de cambios</li>
                                </ul>
                            </a>
                            <a
                                href="https://wa.me/8297163555?text=Hola,%20me%20interesa%20el%20Mantenimiento%20Full%20para%20mi%20bicicleta."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border border-white/40 p-6 bg-white/10 backdrop-blur-sm rounded-sm relative overflow-hidden group hover:bg-white/15 transition-all cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase">Recomendado</div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold uppercase mb-1 text-white group-hover:text-raymon-blue transition-colors">Mantenimiento Full</h3>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="text-2xl font-black text-white mb-4">RD$1,200</div>
                                <ul className="text-sm text-gray-200 space-y-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Lavado premium</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Desarme completo</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Engrase total</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Ajuste de cambios</li>
                                </ul>
                            </a>
                        </div>

                        {/* Additional Services & Delivery */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm pt-4 border-t border-white/10">
                            <div>
                                <h4 className="font-bold text-white uppercase mb-4 flex items-center gap-2">
                                    <Wrench className="w-4 h-4 text-raymon-blue" /> Servicios Adicionales
                                </h4>
                                <ul className="text-gray-400 space-y-2">
                                    <li>Sangrado de frenos</li>
                                    <li>Mantenimiento de suspensión</li>
                                    <li>Mantenimiento de catre</li>
                                    <li>Nivelado de aros</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase mb-4 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-raymon-blue" /> Servicio a Domicilio
                                </h4>
                                <div className="space-y-3 text-gray-400">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span>Santo Domingo DN</span>
                                        <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">RD$500</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span>Santo Domingo Este</span>
                                        <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">RD$1,000</span>
                                    </div>
                                    <p className="text-[10px] italic text-gray-500 mt-2">*Buscar y llevar</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/8297163555?text=Hola,%20deseo%20agendar%20un%20mantenimiento%20para%20mi%20bicicleta."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-4 bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all group"
                    >
                        <span>Agendar Mantenimiento</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </a>
                </div>

                {/* Optional: Second Visual Element for Desktop */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <div className="relative aspect-square border-2 border-white/10 rounded-3xl p-12 overflow-hidden">
                        <img
                            src="https://bikebrothers.es/img/cms/bikebrothers_tienda_taller_bicicletas63.jpg"
                            alt="Maintenance detail"
                            className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100"
                        />
                        <div className="absolute bottom-16 right-16 bg-white p-8 rounded-2xl shadow-2xl">
                            <div className="text-black font-black text-4xl leading-tight">100%<br />EXPERTOS</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceMarketing;
