import React from 'react';
import { Wrench, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="flex flex-col space-y-3">
                            <Wrench className="w-8 h-8 text-white" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Ajuste de Precisión</h3>
                            <p className="text-xs text-gray-400">Calibración exacta de transmisiones y frenos.</p>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <ShieldCheck className="w-8 h-8 text-white" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Garantía Oficial</h3>
                            <p className="text-xs text-gray-400">Repuestos originales y respaldo de marca.</p>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Zap className="w-8 h-8 text-white" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Suspensión Pro</h3>
                            <p className="text-xs text-gray-400">Mantenimiento completo de horquillas y shocks.</p>
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
