import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DurokPromo = () => {
    return (
        <section className="relative w-full bg-zinc-100 overflow-hidden flex flex-col justify-between">
            
            {/* Top Header Section (Light Gray/Silver Wave Gradient) */}
            <div className="relative w-full py-24 px-6 md:px-12 bg-gradient-to-b from-[#e8e8ea] via-[#f3f3f5] to-[#eaeaea] overflow-hidden flex flex-col items-center text-center">
                
                {/* Soft glow background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-white/40 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-7xl font-bold text-zinc-900 tracking-[0.2em] mb-6 uppercase select-none leading-none">
                        DUROK
                    </h2>
                    <p className="text-zinc-600 text-xs md:text-sm font-medium tracking-wide max-w-xl md:max-w-2xl leading-relaxed">
                        Toda la potencia de una e-MTB, un cuadro de aluminio robusto y una batería que te llevas contigo de forma sencilla. La DUROK está hecha para ascensos largos, senderos difíciles y días reales de bicicleta.
                    </p>
                </div>

                {/* Bike Image & Giant Watermark */}
                <div className="relative w-full max-w-5xl mt-12 mx-auto flex justify-center items-center">
                    {/* Giant Watermark Text behind the bike */}
                    <div className="absolute inset-x-0 bottom-0 text-[10rem] sm:text-[14rem] md:text-[20rem] lg:text-[25rem] font-black uppercase text-zinc-950/[0.03] select-none tracking-[0.1em] leading-none text-center pointer-events-none translate-y-1/10">
                        DUROK
                    </div>

                    {/* High-res Bike Image */}
                    <img 
                        src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a312478dc86ce57f6790e8f_raymon-2027-durok-ultra-anthracite_marble-side.avif" 
                        alt="Raymon Durok" 
                        className="relative z-10 w-full h-auto object-contain max-h-[450px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-102 transition-transform duration-700"
                    />
                </div>
            </div>

            {/* Bottom Cream Strip Section */}
            <div className="w-full bg-[#f6f6f4] py-16 px-6 border-t border-zinc-200/40 flex flex-col items-center text-center">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <p className="text-[#888886] font-medium text-xs md:text-sm leading-relaxed max-w-2xl md:max-w-3xl">
                        No solo quieres recorrer los senderos, sino experimentarlos. Con potencia, control y la sensación de poder ir más allá en cualquier momento. La DUROK lleva toda la potencia de Avinox a la ruta y se mantiene deliberadamente sencilla. El robusto cuadro de aluminio está construido para un uso exigente; la batería RS800 extraíble te aporta más flexibilidad en tu día a día. Menos complejidad, más fiabilidad y más tiempo sobre la bicicleta.
                    </p>

                    {/* CTA Button */}
                    <Link 
                        to="/series/durok" 
                        className="inline-flex items-center gap-3 border border-zinc-900 text-zinc-900 px-8 py-3.5 mt-8 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-900 hover:text-white transition-all transform active:scale-95 shadow-sm"
                    >
                        Descubrir DUROK <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DurokPromo;
