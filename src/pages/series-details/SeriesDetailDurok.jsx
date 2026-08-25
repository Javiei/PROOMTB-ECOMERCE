import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { slugify, formatPrice } from '../../utils';
import { ArrowRight } from 'lucide-react';

const SeriesDetailDurok = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const avinoxTabs = [
        {
            title: "Frecuencia Cardíaca",
            description: "Tan pronto como se conecta un monitor de frecuencia cardíaca y se activa el Control Inteligente de Frecuencia Cardíaca, puedes establecer tu rango de frecuencia cardíaca objetivo. El sistema ajusta automáticamente los niveles de asistencia para mantener tu ritmo cardíaco en el rango óptimo, garantizando un viaje eficiente y seguro.",
            video: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af732fadb0fdecabba2e9_Avinox-Herzfrequenz_mp4.mp4",
            poster: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af732fadb0fdecabba2e9_Avinox-Herzfrequenz_poster.0000000.jpg"
        },
        {
            title: "Asistencia de Empuje",
            description: "El alto par motor y la gran capacidad de respuesta de la unidad de accionamiento Avinox reducen la dificultad de empujar la bicicleta cuesta arriba, disminuyendo significativamente las sacudidas.",
            video: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af7acf9966932ded6365b_Avinox-Schiebehilfe_mp4.mp4",
            poster: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af7acf9966932ded6365b_Avinox-Schiebehilfe_poster.0000000.jpg"
        },
        {
            title: "Asistencia de Arranque",
            description: "Al arrancar en una pendiente, la unidad de accionamiento Avinox proporciona un par motor adicional para contrarrestar la gravedad, lo que permite un arranque fácil y sin esfuerzo.",
            video: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af7ff8b49cb8eaff36e05_Avinox-Berganfahrt_mp4.mp4",
            poster: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af7ff8b49cb8eaff36e05_Avinox-Berganfahrt_poster.0000000.jpg"
        },
        {
            title: "Cambio Estático",
            description: "Avinox te permite cambiar de marcha incluso cuando tu bicicleta está parada. Solo tienes que levantar la rueda trasera y pulsar los botones del controlador inalámbrico, sin necesidad de pedalear.",
            video: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af81f4d84da115bf80e87_Avinox-Gangwechsel_mp4.mp4",
            poster: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb%2F6a0af81f4d84da115bf80e87_Avinox-Gangwechsel_poster.0000000.jpg"
        }
    ];

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const { data, error } = await supabase
                    .from('bicicletas')
                    .select('*')
                    .eq('serie_id', 24); // Durok ID

                if (error) throw error;
                // Sort by price desc
                setBikes((data || []).sort((a, b) => (b.precio_eur?.[0] || 0) - (a.precio_eur?.[0] || 0)));
            } catch (error) {
                console.error('Error fetching Durok bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [activeModal]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="h-screen bg-zinc-50 flex items-center justify-center font-black uppercase tracking-tighter text-2xl text-zinc-900">
                Cargando Durok...
            </div>
        );
    }

    // Details Modal content for each feature
    const modalContent = {
        battery: {
            title: "Cargar donde sea conveniente",
            description: "Con la Durok no tienes que preocuparte por dónde dejas la bicicleta para cargarla. La batería Avinox RS800 de 800 Wh se extrae de manera sencilla del cuadro y la puedes cargar cómodamente en tu casa, apartamento o garaje. Más flexibilidad para tu vida diaria y menos preocupaciones antes de salir a la ruta.",
            highlights: [
                "Batería RS800 extraíble de 800 Wh",
                "Carga fácil en cualquier toma de corriente estándar",
                "Máxima flexibilidad y autonomía para rutas de larga duración"
            ],
            image: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33c9848ec6446dfdba120b_durok-raymon-2026-0075.avif"
        },
        frame: {
            title: "Aluminio Optimizado AL61-T6",
            description: "El cuadro de la Durok está diseñado para soportar las exigencias más duras. Construido con aluminio de alta calidad AL61-T6, con espesores de pared optimizados y soldaduras suavizadas (seamless welding). Esto garantiza no solo una estética fluida y premium, sino también una óptima distribución de la carga y una durabilidad superior ante los terrenos más técnicos.",
            highlights: [
                "Cuadro de aluminio de alta resistencia AL61-T6",
                "Soldaduras pulidas para mayor resistencia estructural",
                "Guiado de cables interno optimizado para menor mantenimiento"
            ],
            image: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33ce5b106a5e64d079e55b_durok-raymon-2026-0006.avif"
        },
        avinox: {
            title: "DJI Avinox System: Poder Absoluto",
            description: "El sistema de asistencia eléctrica Avinox es el corazón inteligente de la Durok. El motor entrega hasta 150 Nm de par motor en los modelos Ultra y Pro, con una potencia máxima de 1500W en modo Boost. El engranaje planetario patentado ofrece hasta un 800% de asistencia de forma natural, adaptándose a tu pedaleo instantáneamente mientras mantiene un funcionamiento extremadamente silencioso.",
            highlights: [
                "Hasta 150 Nm de torque (125 Nm en Durok Comp)",
                "Engranaje planetario ultra silencioso y ligero (2.6 kg)",
                "Conectividad con la App Avinox Ride, modos inteligentes de asistencia y control de frecuencia cardíaca"
            ],
            image: "https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33c8f0db13a8fec7a94bc5_durok-raymon-2026-0061.avif"
        }
    };

    return (
        <div className="font-sans text-zinc-900 bg-white min-h-screen">
            
            {/* HERO SECTION (Light Gray/Silver Wave Gradient) */}
            <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#e8e8ea] via-[#f3f3f5] to-[#eaeaea] pt-32 pb-16 px-6 md:px-16 flex flex-col items-center">
                {/* Soft glow background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-white/40 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                    {/* Breadcrumbs */}
                    <div className="text-[10px] md:text-xs tracking-widest text-zinc-500 uppercase mb-8 flex gap-2 font-bold select-none">
                        <span>Bikes</span>
                        <span>/</span>
                        <span>Fully</span>
                        <span>/</span>
                        <span>Modelle</span>
                        <span className="text-zinc-900">/ DUROK</span>
                    </div>

                    {/* Centered Big Title */}
                    <h1 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-[0.2em] mb-6 uppercase select-none leading-none">
                        DUROK
                    </h1>

                    {/* Centered Upper Description */}
                    <p className="text-zinc-600 text-xs md:text-sm font-medium tracking-wide max-w-xl md:max-w-2xl leading-relaxed mb-12">
                        Toda la potencia de una e-MTB, un cuadro de aluminio robusto y una batería que te llevas contigo de forma sencilla. La DUROK está hecha para ascensos largos, senderos difíciles y días reales de bicicleta.
                    </p>

                    {/* Centered Bike with Watermark */}
                    <div className="relative w-full max-w-5xl mx-auto flex justify-center items-center">
                        {/* Giant Watermark Text behind the bike */}
                        <div className="absolute inset-x-0 bottom-0 text-[10rem] sm:text-[14rem] md:text-[20rem] lg:text-[25rem] font-black uppercase text-zinc-950/[0.03] select-none tracking-[0.15em] leading-none text-center pointer-events-none translate-y-1/10">
                            DUROK
                        </div>

                        {/* Centered high-res Bike Image */}
                        <img 
                            src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a312478dc86ce57f6790e8f_raymon-2027-durok-ultra-anthracite_marble-side.avif" 
                            alt="Raymon Durok" 
                            className="relative z-10 w-full h-auto object-contain max-h-[450px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-102 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* DESCRIPTION IN SHORT (Cream Strip) */}
            <section className="relative z-10 py-20 px-6 md:px-16 bg-[#f6f6f4] border-t border-zinc-200/40 text-center">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[#888886] font-medium text-xs md:text-sm leading-relaxed">
                        No solo quieres recorrer los senderos, sino experimentarlos. Con potencia, control y la sensación de poder ir más allá en cualquier momento. La DUROK lleva toda la potencia de Avinox a la ruta y se mantiene deliberadamente sencilla. El robusto cuadro de aluminio está construido para un uso exigente; la batería RS800 extraíble te aporta más flexibilidad en tu día a día. Menos complejidad, más fiabilidad y más tiempo sobre la bicicleta.
                    </p>
                </div>
            </section>

            {/* MODELS SHOWCASE */}
            <section id="discover" className="relative z-10 py-32 px-6 md:px-16 bg-zinc-50 border-t border-zinc-200">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Modelos</h2>
                    <h3 className="text-4xl md:text-5xl font-black mb-20 text-zinc-900 italic tracking-tight">Elige tu DUROK.</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-zinc-900 max-w-6xl mx-auto">
                        {bikes.map(bike => (
                            <Link 
                                to={`/product/${slugify(bike.modelo)}`} 
                                key={bike.id} 
                                className="group flex flex-col items-center transition-all duration-500 bg-white p-8 rounded-[2rem] border border-zinc-200 hover:border-zinc-800 hover:bg-zinc-50/50 shadow-sm" 
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <div className="aspect-[16/10] w-full flex items-center justify-center relative mb-8">
                                    <img 
                                        src={bike.imagenes_urls?.[0]} 
                                        alt={bike.modelo} 
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]" 
                                    />
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <h4 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight group-hover:text-zinc-700 transition-colors duration-500">
                                        {bike.modelo}
                                    </h4>
                                    <p className="text-sm font-semibold text-zinc-500 mb-4">
                                        {bike.colores?.[0]}
                                    </p>
                                    <p className="text-lg font-black text-zinc-950 tracking-wider">
                                        {formatPrice(bike.precio_eur, 'bikes', 24)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20">
                        <Link to="/catalogo" className="inline-flex items-center gap-2 border border-zinc-900 text-zinc-900 px-8 py-3 rounded-full font-bold hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                            Explorar catálogo completo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SPECS AND HIGHLIGHTS (Bento) */}
            <section className="relative z-10 py-32 px-6 md:px-16 bg-white text-zinc-900 border-t border-zinc-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Aspectos Clave</h2>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tight">DUROK FACTORS.</h3>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Box 1: Battery */}
                        <div 
                            onClick={() => setActiveModal('battery')}
                            className="group relative md:col-span-2 overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-200 hover:border-zinc-400 cursor-pointer transition-all duration-500 min-h-[400px] flex flex-col justify-end p-8 md:p-12 shadow-sm"
                        >
                            <div className="absolute inset-0 z-0 opacity-80 group-hover:scale-102 transition-transform duration-700">
                                <img 
                                    src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33c9848ec6446dfdba120b_durok-raymon-2026-0075.avif" 
                                    alt="Extraer bateria" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-1"></div>
                            
                            <div className="relative z-10">
                                <div className="bg-zinc-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-4">Innovación</div>
                                <h4 className="text-3xl font-black uppercase tracking-tight mb-2 text-zinc-900">Batería RS800 Extraíble</h4>
                                <p className="text-zinc-600 text-sm md:text-base max-w-xl">
                                    Extrae la batería de 800 Wh y llévala para cargar en casa o en tu apartamento sin complicaciones.
                                </p>
                            </div>
                        </div>

                        {/* Box 2: Avinox Power */}
                        <div 
                            onClick={() => setActiveModal('avinox')}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-200 hover:border-zinc-400 cursor-pointer transition-all duration-500 min-h-[400px] flex flex-col justify-end p-8 shadow-sm"
                        >
                            <div className="absolute inset-0 z-0 opacity-80 group-hover:scale-102 transition-transform duration-700">
                                <img 
                                    src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33c8f0db13a8fec7a94bc5_durok-raymon-2026-0061.avif" 
                                    alt="Avinox motor" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent z-1"></div>

                            <div className="relative z-10">
                                <div className="bg-zinc-200 border border-zinc-300 text-zinc-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-4">Motor</div>
                                <h4 className="text-2xl font-black uppercase tracking-tight mb-2 text-zinc-900">Asistencia Avinox</h4>
                                <p className="text-zinc-600 text-xs md:text-sm">
                                    Hasta 150 Nm de torque y múltiples modos de potencia inteligente DJI Avinox.
                                </p>
                            </div>
                        </div>

                        {/* Box 3: Geometry & Frame */}
                        <div 
                            onClick={() => setActiveModal('frame')}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-200 hover:border-zinc-400 cursor-pointer transition-all duration-500 min-h-[400px] flex flex-col justify-end p-8 shadow-sm"
                        >
                            <div className="absolute inset-0 z-0 opacity-80 group-hover:scale-102 transition-transform duration-700">
                                <img 
                                    src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a33ce5b106a5e64d079e55b_durok-raymon-2026-0006.avif" 
                                    alt="Frame" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent z-1"></div>

                            <div className="relative z-10">
                                <div className="bg-zinc-200 border border-zinc-300 text-zinc-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-4">Estructura</div>
                                <h4 className="text-2xl font-black uppercase tracking-tight mb-2 text-zinc-900">Aluminio AL61-T6</h4>
                                <p className="text-zinc-600 text-xs md:text-sm">
                                    Un chasis robusto de aluminio con guiado interno y soldaduras seamless de 150mm.
                                </p>
                            </div>
                        </div>

                        {/* Box 4: Specifications Highlight */}
                        <div className="relative md:col-span-2 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 p-8 md:p-12 flex flex-col justify-between shadow-sm">
                            <h4 className="text-xl font-bold uppercase tracking-widest text-zinc-900 mb-6">Especificaciones de la Serie</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 text-center shadow-sm">
                                    <span className="text-xs text-zinc-500 block mb-1">Recorrido</span>
                                    <span className="text-2xl font-black text-zinc-900 italic">150 mm</span>
                                </div>
                                <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 text-center shadow-sm">
                                    <span className="text-xs text-zinc-500 block mb-1">Batería RS800</span>
                                    <span className="text-2xl font-black text-zinc-900 italic">800 Wh</span>
                                </div>
                                <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 text-center shadow-sm">
                                    <span className="text-xs text-zinc-500 block mb-1">Diámetro Rueda</span>
                                    <span className="text-2xl font-black text-zinc-900 italic">29" (M-XL)</span>
                                </div>
                                <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 text-center shadow-sm">
                                    <span className="text-xs text-zinc-500 block mb-1">Par Motor Máx</span>
                                    <span className="text-2xl font-black text-zinc-900 italic">150 Nm</span>
                                </div>
                            </div>
                            <div className="mt-8 text-zinc-500 text-xs font-light">
                                * Nota: El cuadro de tallas de la Durok incluye tamaño S con ruedas de 27.5" y M, L, XL con configuraciones completas de 29".
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AVINOX SMART FEATURES TABS */}
            <section className="py-32 px-6 md:px-16 bg-[#f8f8f9] border-t border-zinc-200 text-zinc-900 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Tecnología Inteligente</h2>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tight text-zinc-900">AVINOX SMART FEATURES.</h3>
                    </div>

                    {/* Tab Navigation Menu */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-zinc-200 pb-6 max-w-3xl mx-auto">
                        {avinoxTabs.map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                                    activeTab === idx 
                                        ? 'bg-zinc-900 text-white shadow-md' 
                                        : 'bg-white text-zinc-500 border border-zinc-200 hover:text-zinc-900 hover:border-zinc-400'
                                }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Video Display (Left column or 7 cols) */}
                        <div className="lg:col-span-7 bg-zinc-100 p-4 md:p-6 rounded-[2.5rem] border border-zinc-200 shadow-md relative overflow-hidden aspect-[16/10] w-full flex items-center justify-center">
                            {/* Inner Video Container */}
                            <video
                                key={activeTab} // Force re-render to load correct video source
                                src={avinoxTabs[activeTab].video}
                                poster={avinoxTabs[activeTab].poster}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-[1.5rem]"
                            />
                        </div>

                        {/* Description Display (Right column or 5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-2">Función {activeTab + 1}</span>
                            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 text-zinc-900">
                                {avinoxTabs[activeTab].title}
                            </h4>
                            <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
                                {avinoxTabs[activeTab].description}
                            </p>
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center">
                                    <span className="text-zinc-900 font-bold text-xs">DJI</span>
                                </div>
                                <span className="text-xs text-zinc-500 font-medium">Asistencia Inteligente de Conectividad</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCORDION DESCRIPTION / TRAIL PERFORMANCE */}
            <section className="py-32 px-6 md:px-16 bg-white text-zinc-900 relative border-t border-zinc-200 overflow-hidden">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <span className="text-xs font-bold text-zinc-500 tracking-[0.25em] uppercase block mb-4">Rendimiento en Sendero</span>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">
                            Rápida, estable y lista para más.
                        </h3>
                        <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                            La DUROK se siente igual de cómoda en senderos rápidos locales que en descensos exigentes en terreno alpino. Se ha configurado para que puedas rodar activamente cuesta arriba y obtener la estabilidad exacta que necesitas cuesta abajo cuando la ruta se vuelve más rápida, empinada o técnica.
                        </p>
                        <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
                            Su geometría apuesta por una marcha suave y estable, sin restar agilidad a la DUROK. Así consigues una bicicleta que no te frena, sino que te anima a seguir adelante y disfrutar del flujo en la montaña.
                        </p>
                    </div>

                    <div className="flex-1 w-full flex justify-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-zinc-200/50 blur-[100px] rounded-full"></div>
                        <img 
                            src="https://cdn.prod.website-files.com/69fc76a7d3cb32c8cd17bfbb/6a3274997da959bdd8ba4334_raymon-durok-art.avif" 
                            alt="DUROK Action" 
                            className="relative z-10 w-full h-auto object-cover rounded-[2rem] border border-zinc-200 shadow-lg scale-105"
                        />
                    </div>
                </div>
            </section>

            {/* DETAILS MODAL */}
            {activeModal && modalContent[activeModal] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative bg-white border border-zinc-200 text-zinc-900 rounded-[2.5rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[90vh]">
                        {/* Close button */}
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="absolute top-6 right-6 z-50 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 rounded-full p-3 transition-colors active:scale-95 animate-in fade-in duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Image Left */}
                        <div className="md:w-1/2 h-[250px] md:h-auto overflow-hidden relative bg-zinc-50 flex items-center justify-center">
                            <img 
                                src={modalContent[activeModal].image} 
                                alt={modalContent[activeModal].title} 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Right */}
                        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center bg-white">
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-zinc-900">
                                {modalContent[activeModal].title}
                            </h3>
                            <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-8">
                                {modalContent[activeModal].description}
                            </p>

                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                                Aspectos clave
                            </h4>
                            <ul className="space-y-3">
                                {modalContent[activeModal].highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-3 text-zinc-700 text-xs md:text-sm">
                                        <div className="w-2 h-2 rounded-full bg-zinc-900 mt-1.5 flex-shrink-0" />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesDetailDurok;
