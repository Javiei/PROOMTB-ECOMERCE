import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Smartphone, ArrowRight, Battery, Activity, X, LayoutGrid, Home, ArrowUpCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { slugify, formatPrice } from '../../utils';
import raymonLogo from '../../assets/Raymon_logo_black schriftzug.png';
import proomtbLogo from '../../assets/proomtb_logo_white.png';

// Swiper for modal
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const geoData = [
  { name: 'Longitud del tubo de sillín', u: ['400', '420', '440', '460'], t: ['400', '420', '440', '460'] },
  { name: 'Longitud efectiva del tubo superior', u: ['572', '593', '620', '647'], t: ['572', '593', '620', '647'] },
  { name: 'Longitud del tubo de dirección', u: ['115', '115', '125', '135'], t: ['115', '115', '125', '135'] },
  { name: 'Longitud de las vainas', u: ['445', '445', '445', '445'], t: ['445', '445', '445', '445'] },
  { name: 'Distancia entre ejes', u: ['1.223', '1.244', '1.272', '1.302'], t: ['1.223', '1.244', '1.272', '1.302'] },
  { name: 'Alcance (Reach)', u: ['435', '456', '480', '505'], t: ['435', '456', '480', '505'] },
  { name: 'Altura (Stack)', u: ['642', '642', '651', '660'], t: ['642', '642', '651', '660'] },
  { name: 'Caída del pedalier', u: ['19', '19', '19', '19'], t: ['19', '19', '19', '19'] },
  { name: 'Distancia al suelo', u: ['25', '25', '25', '25'], t: ['25', '25', '25', '25'] },
  { name: 'Ángulo de dirección', u: ['64°', '64°', '64°', '64°'], t: ['64°', '64°', '64°', '64°'] },
  { name: 'Ángulo del sillín', u: ['78,3°', '77,9°', '77,5°', '77,3°'], t: ['78,3°', '77,9°', '77,5°', '77,3°'] },
  { name: 'Longitud de la potencia', u: ['35', '35', '35', '35'], t: ['35', '35', '35', '35'] },
  { name: 'Anchura del manillar', u: ['800', '800', '800', '800'], t: ['800', '800', '800', '800'] },
  { name: 'Longitud de las bielas', u: ['160', '160', '160', '165'], t: ['160', '160', '160', '165'] },
  { name: 'Tija telescópica', u: ['120', '150', '180', '210'], t: ['125', '150', '170', '200'] },
  { name: 'Altura de entrepierna (Standover)', u: ['–', '75', '–', '-'], t: ['–', '75', '–', '–'] },
];

const SeriesDetailTarokTotem = () => {
    const navigate = useNavigate();
    const textRef = useRef(null);
    const introTextRef = useRef(null);
    const efficiencyTextRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [introScrollProgress, setIntroScrollProgress] = useState(0);
    const [efficiencyScrollProgress, setEfficiencyScrollProgress] = useState(0);
    const [activeModal, setActiveModal] = useState(null);
    const [bikes, setBikes] = useState([]);
    const [loadingBikes, setLoadingBikes] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [detailSwiperInstance, setDetailSwiperInstance] = useState(null);

    const getOptimizedImageUrl = (url, width = 800) => {
        if (!url) return url;
        if (url.includes('supabase.co/storage/v1/object/public/')) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}width=${width}&quality=80&format=webp`;
        }
        return url;
    };

    // Totem Idle Timer
    useEffect(() => {
        let timeout;
        const resetToTotem = () => {
            navigate('/totem');
        };

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(resetToTotem, 60000); // 1 minute
        };

        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer, true);

        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('touchstart', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer, true);
        };
    }, [navigate]);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const { data, error } = await supabase
                    .from('bicicletas')
                    .select('*')
                    .eq('serie_id', 23); // Tarok ID

                if (error) throw error;
                // sort by price desc
                setBikes((data || []).sort((a,b) => (b.precio_eur || 0) - (a.precio_eur || 0)));
            } catch (error) {
                console.error('Error fetching Tarok bikes:', error);
            } finally {
                setLoadingBikes(false);
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

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;

            if (textRef.current) {
                const rect = textRef.current.getBoundingClientRect();
                const start = windowHeight * 0.70;
                const end = windowHeight * 0.50;
                let progress = (start - rect.top) / (start - end);
                setScrollProgress(Math.max(0, Math.min(1, progress)));
            }
            
            if (introTextRef.current) {
                const rect = introTextRef.current.getBoundingClientRect();
                const start = windowHeight * 0.85;
                const end = windowHeight * 0.65;
                let progress = (start - rect.top) / (start - end);
                setIntroScrollProgress(Math.max(0, Math.min(1, progress)));
            }

            if (efficiencyTextRef.current) {
                const rect = efficiencyTextRef.current.getBoundingClientRect();
                const start = windowHeight * 0.90;
                const end = windowHeight * 0.60;
                let progress = (start - rect.top) / (start - end);
                setEfficiencyScrollProgress(Math.max(0, Math.min(1, progress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const goBack = () => navigate(-1);
    const goHome = () => navigate('/totem');



    return (
        <div className="font-sans text-neutral-900 bg-white relative">
            {/* STICKY TOTEM HEADER */}
            <div className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/5 p-8 flex items-center justify-between pointer-events-auto">
                <button onClick={goHome} className="flex items-center text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 border border-white/10 px-6 py-4 rounded-full backdrop-blur-md">
                    <svg width="40" height="40" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    <span className="text-3xl font-bold uppercase tracking-widest">Atrás</span>
                </button>
                
                <div className="flex items-center gap-10">
                    <img src={raymonLogo} alt="Raymon" className="h-8 w-auto brightness-0 invert" />
                    <div className="w-px h-8 bg-white/20" />
                    <img src={proomtbLogo} alt="ProoMTB" className="h-12 w-auto" />
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate('/totem')} className="bg-white text-black px-8 py-4 rounded-full text-xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                        INICIO
                    </button>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="relative w-full h-[90vh] md:h-screen flex flex-col justify-between overflow-hidden bg-black text-white pt-24 pb-8 px-6 md:px-16">
                {/* Background Video */}
                <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
                    <iframe
                        src="https://player.vimeo.com/video/1181313905?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                        className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-60"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col items-start text-left mt-auto mb-auto w-full max-w-7xl mx-auto">
                    <div className="text-xs md:text-sm tracking-widest text-neutral-400 uppercase mb-4 md:mb-6 flex gap-2">
                        <span>Bicicletas</span>
                        <span>/</span>
                        <span>Doble Suspensión</span>
                        <span>/</span>
                        <span>Modelos</span>
                        <span className="text-white">/ TAROK</span>
                    </div>

                    <div className="flex flex-col items-start justify-start mb-8 w-full select-none leading-none">
                        <span
                            className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-wide"
                            style={{
                                WebkitTextStroke: '2px white',
                                color: 'transparent',
                                marginBottom: '-0.2em',
                                paddingRight: '2.5em'
                            }}
                        >
                            THE NEW
                        </span>
                        <span className="text-7xl md:text-[8rem] lg:text-[10rem] font-black italic text-white tracking-widest drop-shadow-2xl">
                            TAROK
                        </span>
                    </div>

                    <p className="max-w-xl text-md md:text-xl font-medium leading-relaxed mb-8 text-neutral-300 drop-shadow-md">
                        Rendimiento e-MTB de máxima potencia, envuelto en un cuadro de carbono ultra ligero. Impulsada por la revolucionaria Avinox M2S. Lista para cualquier sendero que te atrevas a recorrer.
                    </p>

                    <a href="#discover" className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        Descubre la TAROK
                    </a>
                </div>
            </section>

            {/* CONTINUOUS DYNAMIC NEBULA SECTION SPANNING THE LOWER PAGE */}
            <div className="relative w-full bg-[#08010f] text-white">
                {/* Embedded Keyframes for Highly Dynamic Movement */}
                <style>
                    {`
                    @keyframes starFlow1 { 0% { background-position: 0px 0px; } 100% { background-position: 100px 100px; } }
                    @keyframes starFlow2 { 0% { background-position: 0px 0px; } 100% { background-position: -150px -150px; } }
                    @keyframes plasmaSpin1 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(30vw, 15vw) rotate(120deg) scale(1.3); } 66% { transform: translate(-10vw, 25vw) rotate(240deg) scale(0.8); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
                    @keyframes plasmaSpin2 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(-25vw, -15vw) rotate(-120deg) scale(0.8); } 66% { transform: translate(25vw, -20vw) rotate(-240deg) scale(1.4); } 100% { transform: translate(0, 0) rotate(-360deg) scale(1); } }
                    @keyframes plasmaSpin3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(20vw, -30vw) rotate(180deg) scale(1.5); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
                    `}
                </style>

                {/* Bulletproof Sticky Viewport Background Canvas */}
                <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none">
                    {/* Deep Space Base Gradient - Darkened */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#100320] via-[#090014] to-[#0a0118] opacity-95"></div>

                    {/* Infinite Fast Scrolling Stars */}
                    <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.25, animation: 'starFlow1 12s linear infinite' }}></div>
                    <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px)', backgroundSize: '150px 150px', opacity: 0.15, animation: 'starFlow2 18s linear infinite' }}></div>
                    
                    {/* Huge Lava/Plasma Clouds to cover everything - Lowered Opacities */}
                    <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] md:w-[100vw] md:h-[100vw] rounded-[100%] bg-[#7a1bb5] mix-blend-screen" style={{ filter: 'blur(120px)', opacity: 0.20, animation: 'plasmaSpin1 18s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[130vw] h-[130vw] md:w-[110vw] md:h-[110vw] rounded-[100%] bg-[#420485] mix-blend-screen" style={{ filter: 'blur(150px)', opacity: 0.20, animation: 'plasmaSpin2 22s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}></div>
                    <div className="absolute top-[10%] left-[20%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] rounded-[100%] bg-[#ba1c8f] mix-blend-screen" style={{ filter: 'blur(100px)', opacity: 0.15, animation: 'plasmaSpin3 15s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}></div>
                    <div className="absolute top-[30%] left-[10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-[100%] bg-[#a63cf2] mix-blend-screen" style={{ filter: 'blur(90px)', opacity: 0.10, animation: 'plasmaSpin1 10s ease-in-out infinite reverse' }}></div>
                    
                    {/* Sutil overlay para oscurecer y suavizar todos los colores */}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content Overlay wrapped to sit directly on top of the sticky background */}
                <div className="relative z-10 w-full -mt-[100vh]">
                    {/* SECTION 1: POETIC INTRO */}
                    <section className="relative z-10 pt-16 md:pt-24 pb-32 px-6 md:px-16 w-full flex flex-col items-center">

                {/* POETIC INTRO TEXT */}
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-relaxed tracking-wide mb-8 text-center drop-shadow-lg">
                        El sendero es tu órbita. La montaña queda atrás. Todo se silencia. Solo oyes el zumbido en tus oídos y el suelo bajo tus neumáticos. <span
                            ref={introTextRef}
                            style={{
                                color: `rgba(${80 + introScrollProgress * 112}, ${80 + introScrollProgress * 52}, ${90 + introScrollProgress * 162}, ${0.3 + introScrollProgress * 0.7})`,
                                textShadow: `0 0 ${introScrollProgress * 20}px rgba(192,132,252,${introScrollProgress * 0.8})`,
                                transition: 'color 0.1s ease-out, text-shadow 0.1s ease-out'
                            }}
                        >Con TAROK, no piensas. Sientes.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-neutral-300 font-light text-center max-w-3xl drop-shadow-md">
                        El sistema de transmisión, la suspensión y la geometría trabajan como uno solo. Lee el sendero antes de que lo veas y te lleva donde otros tienen que bajarse.
                    </p>
                </div>

                {/* Featured Bike Image & Specs */}
                <div className="relative z-10 mt-16 md:mt-24 px-4 w-full flex flex-col items-center">
                    <img
                        src="https://www.raymon-bicycles.com/images/tarok/raymon-bicycles-2026-tarok.png"
                        alt="TAROK Bike Feature"
                        className="w-full max-w-5xl md:max-w-6xl object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12 hover:scale-105 transition-transform duration-700"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-3xl text-center border-t border-white/20 pt-10 mt-12 md:mt-24">
                        <div>
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">Configuración Mullet</p>
                            <p className="text-2xl md:text-3xl font-black text-white">160/150mm</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">Peso</p>
                            <p className="text-2xl md:text-3xl font-black text-white">desde 20.4 kg</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">Alta Potencia</p>
                            <p className="text-2xl md:text-3xl font-black text-white">150 Nm / 700 Wh</p>
                        </div>
                    </div>
                </div>
                </section>

                {/* CHOOSE YOUR TAROK (Models) */}
                <section id="discover" className="relative z-10 py-24 px-6 md:px-16">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-[10px] md:text-xs font-black text-purple-400 uppercase tracking-[0.4em] mb-4">Modelos</h2>
                        <h3 className="text-4xl md:text-5xl lg:text-5xl font-black mb-20 text-white italic tracking-tight">Elige tu TAROK.</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-white max-w-6xl mx-auto">
                            {bikes.map(bike => (
                                <div 
                                    key={bike.id} 
                                    className="group flex flex-col items-center transition-all duration-500 cursor-pointer active:scale-95"
                                    onClick={() => {
                                        setSelectedProduct(bike);
                                        setSelectedColorIndex(0);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <div className="aspect-[16/10] w-full flex items-center justify-center relative mb-8">
                                        <div className="absolute inset-0 bg-purple-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <img 
                                            src={getOptimizedImageUrl(bike.imagenes_urls?.[0], 800)} 
                                            alt={bike.modelo} 
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" 
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                        <h4 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight group-hover:text-purple-300 transition-colors duration-500">
                                            {bike.modelo}
                                        </h4>
                                        <p className="text-sm md:text-base font-bold text-purple-400 tracking-wider">
                                            {bike.precio_eur ? `${new Intl.NumberFormat('de-DE').format(Array.isArray(bike.precio_eur) ? bike.precio_eur[0] : bike.precio_eur)} €` : ''}
                                        </p>
                                        <div className="mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                                            Toca para ver detalles <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20">
                            <button onClick={() => navigate('/totem')} className="inline-flex items-center gap-4 border-2 border-purple-500 text-purple-300 px-12 py-5 rounded-full text-xl font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_30px_rgba(166,60,242,0.4)] active:scale-95">
                                <LayoutGrid className="w-8 h-8" /> Volver al Catálogo
                            </button>
                        </div>
                    </div>
                </section>

                {/* LIFESTYLE IMAGE */}
                <div className="relative z-10 w-full mb-12">
                    <img
                        src="https://www.raymon-bicycles.com/images/tarok/bg_after_hero.jpeg"
                        alt="TAROK lifestyle"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* DEEP DIVE SECTIONS: KINEMATICS */}
                <section className="relative z-10 py-24 px-6 md:px-16 w-full flex flex-col items-center">
                    <div className="max-w-5xl mx-auto text-center mb-16 px-4">
                        <h4 className="text-sm md:text-base font-bold text-purple-400 uppercase tracking-[0.2em] mb-6">Cinemática</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white">
                            Máxima confianza en los desniveles
                            <br className="hidden md:block" /> más exigentes.
                        </h2>
                        <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-light">
                            En el corazón de la TAROK se encuentra su cuadro de carbono HSC. <span 
                                ref={textRef} 
                                style={{
                                    color: `rgba(${80 + scrollProgress * 112}, ${80 + scrollProgress * 52}, ${90 + scrollProgress * 162}, ${0.3 + scrollProgress * 0.7})`,
                                    textShadow: `0 0 ${scrollProgress * 20}px rgba(192,132,252,${scrollProgress * 0.8})`,
                                    transition: 'color 0.1s ease-out, text-shadow 0.1s ease-out'
                                }}
                            >Con un peso de sistema
                            <br className="hidden lg:block" /> de solo 20.4 kg, la TAROK supera sin esfuerzo a la competencia en su
                            <br className="hidden lg:block" /> categoría.</span>
                        </p>
                    </div>

                    <div className="w-full max-w-7xl mx-auto flex justify-center mt-12 md:mt-16 px-4">
                        <img 
                            src="https://www.raymon-bicycles.com/images/tarok/kinematik_frame_en.png" 
                            alt="TAROK Kinematics Frame" 
                            className="w-full h-auto object-contain md:scale-105"
                        />
                    </div>

                    <div className="w-full max-w-4xl mx-auto text-center mt-16 md:mt-24 px-6 md:px-0 mb-16 md:mb-24">
                        <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                            Estable a alta velocidad. Juguetona cuando el sendero se vuelve técnico. La cinemática de la suspensión trasera, especialmente desarrollada, ofrece una respuesta sensible al inicio del recorrido y un soporte controlado en el tramo medio. La suspensión permanece activa durante el frenado, proporcionándote la máxima tracción en cualquier terreno en todo momento.
                        </p>
                    </div>

                    <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-6 lg:px-8">
                        {[
                            {
                                subtitle: 'SUSPENSIÓN',
                                title: 'Control total',
                                desc: 'Confianza y control en cada situación.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/total_control.jpeg'
                            },
                            {
                                subtitle: 'TECNOLOGÍA',
                                title: 'Integración perfecta',
                                desc: 'Optimizada hasta el más mínimo detalle.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/seamless_integration.jpeg'
                            },
                            {
                                subtitle: 'GARANTÍA SIN TONTERÍAS',
                                title: 'Simplicidad Pura',
                                desc: 'Sin funciones innecesarias. Puro sentimiento de conducción.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/pure_simplicity.jpeg'
                            },
                            {
                                subtitle: 'GEOMETRÍA',
                                title: 'Geometría Equilibrada',
                                desc: 'Los números detrás de la sensación.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/geometrie.jpeg'
                            }
                        ].map((item, idx) => (
                            <div key={idx} onClick={() => { 
                                if (item.title === 'Control total') setActiveModal('total_control');
                                if (item.title === 'Integración perfecta') setActiveModal('seamless_integration');
                                if (item.title === 'Simplicidad Pura') setActiveModal('pure_simplicity');
                                if (item.title === 'Geometría Equilibrada') setActiveModal('balanced_geometry');
                            }} className="relative group overflow-hidden rounded-lg md:rounded-xl aspect-square md:aspect-[10/9] cursor-pointer">
                                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/50 group-hover:to-black/20 transition-colors duration-700"></div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col justify-end w-full">
                                    <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-purple-400 mb-2">{item.subtitle}</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{item.title}</h3>
                                    <p className="text-sm md:text-base font-medium text-white/80 mb-6">{item.desc}</p>
                                    <span className="text-xs font-bold text-white flex items-center gap-2 group-hover:text-purple-400 transition-colors uppercase tracking-wider">
                                        <ArrowRight className="w-4 h-4" /> Saber más
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- BLACKOUT TRANSITION SECTION --- */}
                <div className="relative w-full bg-black z-20">
                    <div className="absolute top-[-300px] left-0 right-0 h-[300px] bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none z-[-1]"></div>

                    {/* EFFICIENCY SECTION */}
                    <section className="relative z-10 py-24 md:py-32 px-6 md:px-16 w-full text-center">
                    <div className="max-w-5xl mx-auto">
                        <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-purple-400 mb-6 block">Eficiencia</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-12 md:mb-16 leading-tight drop-shadow-md">
                            Máxima potencia con mínima <br className="hidden md:block"/> pérdida de energía.
                        </h2>
                        
                        <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-4xl mx-auto">
                            <span className="text-white">Las ligeras ruedas de carbono reducen la masa rotatoria y mejoran notablemente tu aceleración y manejo. Experimenta la máxima </span>
                            <span 
                                ref={efficiencyTextRef}
                                style={{
                                    color: `rgba(${80 + efficiencyScrollProgress * 112}, ${80 + efficiencyScrollProgress * 52}, ${90 + efficiencyScrollProgress * 162}, ${0.3 + efficiencyScrollProgress * 0.7})`,
                                    textShadow: `0 0 ${efficiencyScrollProgress * 20}px rgba(192,132,252,${efficiencyScrollProgress * 0.8})`,
                                    transition: 'color 0.1s ease-out, text-shadow 0.1s ease-out'
                                }}
                            >
                                eficiencia en subidas largas y ascensos técnicos.
                            </span>
                        </p>
                    </div>

                    <div className="mt-24 -mx-6 md:-mx-16">
                        <img 
                            src="https://www.raymon-bicycles.com/images/tarok/grip_master_bg.jpeg" 
                            alt="Tarok Grip Master Carbon Wheels" 
                            className="w-full h-auto block"
                        />
                    </div>

                    <div className="w-full max-w-4xl mx-auto px-6 mt-24 md:mt-32 mb-12 text-center">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium italic leading-tight text-white mb-10 text-balance">
                            "Desarrollamos la TAROK porque nos entusiasmaba construirla. Al fin y al cabo, las mejores ideas surgen cuando las puertas del taller ya deberían estar cerradas."
                        </h3>
                        <p className="text-xs md:text-sm font-black text-neutral-400 uppercase tracking-[0.2em]">
                            Felix Raymundo Puello <span className="text-purple-500 mx-2">|</span> CEO of RAYMON
                        </p>
                    </div>

                    <div className="mt-24 -mx-6 md:-mx-16">
                        <img 
                            src="https://www.raymon-bicycles.com/images/tarok/bg_after_quote.jpg" 
                            alt="Tarok action after quote" 
                            className="w-full h-auto block"
                        />
                    </div>
                </section>

                {/* AVINOX M2S MOTOR */}
                <section className="relative z-10 py-24 px-6 md:px-16 w-full text-center">
                    <div className="max-w-4xl mx-auto">
                        <h4 className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-[0.2em] mb-6">MOTOR DE MÁXIMA POTENCIA - AVINOX M2S</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white drop-shadow-md">
                            ¿Tu potencia? ¡Multiplicada por 8!
                        </h2>
                        <p className="text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto text-balance">
                            Como si tuvieras piernas de superhéroe: la caja de cambios planetaria patentada del Avinox M2S te ofrece hasta un 800% de apoyo. Cada gramo de presión sobre el pedal se traduce en un impulso puro y constante. Está diseñado para ofrecer la máxima durabilidad y potencia, para que puedas exprimir la TAROK todo el tiempo que quieras.
                        </p>
                        <span onClick={() => setActiveModal('avinox_motor')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block mb-16">
                            &rarr; Saber más
                        </span>
                    </div>
                    
                    <div className="w-full max-w-5xl mx-auto flex justify-center relative">
                        <video 
                            src="https://www.raymon-bicycles.com/images/tarok/Drive%20unit%20exploded%20video_PC.mp4" 
                            className="w-full h-auto object-contain max-h-[600px]"
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                        />
                    </div>
                </section>

                {/* SYSTEM & APP DATA */}
                <section className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4">Sistema</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white drop-shadow-md">
                                Datos que piensan por ti.
                            </h2>
                            <p className="text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed max-w-xl text-balance">
                                El sistema de propulsión Avinox funciona con precisión en segundo plano. Más de 40 puntos de datos capturan todo lo que importa en el sendero: autonomía, tiempo de recorrido, velocidad. Con la aplicación Avinox Ride, puedes adaptar la TAROK a tus necesidades y configurar tu pantalla exactamente como te guste.
                            </p>
                            <span onClick={() => setActiveModal('avinox_app')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block">
                                &rarr; Saber más
                            </span>
                        </div>
                        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                            <img 
                                src="https://www.raymon-bicycles.com/images/tarok/app_tile.png" 
                                alt="Avinox system app tile" 
                                className="w-full max-w-[500px] h-auto object-contain"
                            />
                        </div>
                    </div>
                </section>

                {/* BATTERY SECTION */}
                <section className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex justify-center lg:justify-start">
                            <img 
                                src="https://www.raymon-bicycles.com/images/tarok/raymon-tarok-avinox-akku-en.png" 
                                alt="Batería Avinox FP700" 
                                className="w-full max-w-[600px] h-auto object-contain"
                            />
                        </div>
                        <div>
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4">Batería</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black leading-tight mb-8 text-white drop-shadow-md pr-8">
                                Hasta 157 km de autonomía para el máximo de vueltas.
                            </h2>
                            <p className="text-base md:text-lg font-medium text-white/90 mb-6 leading-relaxed max-w-xl text-balance">
                                Sea cual sea el modelo TAROK que elijas, siempre viene equipado con la nueva batería FP700 con una densidad energética aún mayor. Pero no dejes que el “700” te engañe. La llamamos deliberadamente batería de alta energía. Con una densidad energética excepcionalmente alta de 220 Wh/kg, ofrece un empuje instantáneo con hasta 2.000 W de potencia.
                            </p>
                            <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed max-w-xl text-balance">
                                El secreto está en el sistema: sólo la combinación del motor M2S y la batería FP700 libera este nivel de rendimiento.
                            </p>
                        </div>
                    </div>
                </section>
                {/* APP BG SECTION */}
                <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[600px] lg:min-h-[800px] flex items-center mb-0 mt-24">
                    {/* Background image constrained to full width */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="https://www.raymon-bicycles.com/images/tarok/app_bg.jpeg" 
                            alt="Avinox Ride App Features" 
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/60 md:bg-black/40 lg:bg-gradient-to-r lg:from-black/90 lg:to-transparent"></div>
                    </div>
                    
                    {/* Content on top */}
                    <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto">
                        <div className="max-w-xl">
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4 uppercase">APLICACIÓN</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black leading-tight mb-8 text-white drop-shadow-md pb-2">
                                Aplicación Avinox Ride con protección antirrobo incluida
                            </h2>
                            <p className="text-base md:text-lg font-medium text-white mb-10 leading-relaxed text-shadow-sm text-balance">
                                Segura, conectada y siempre en tu radar: usa la aplicación para ajustar con precisión el par motor y el empuje residual del motor para que se adapten exactamente a tu estilo de conducción. Gracias a la conectividad LTE integrada, puedes vigilar tu TAROK en todo momento. Un bloqueo digital, GPS en tiempo real y una alarma sonora dificultan la vida a los ladrones mientras tú siempre sabes exactamente dónde está tu bicicleta.
                            </p>
                            <span onClick={() => setActiveModal('avinox_app')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block drop-shadow-md">
                                &rarr; Saber más
                            </span>
                        </div>
                    </div>
                </section>


                </div> {/* End blackout wrapper */}
                </div> {/* End content layer */}
            </div> {/* End massive continuous container */}

            {/* MODALS */}
            {/* MODALS */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col animate-in slide-in-from-bottom-12 duration-700">
                    {/* Header Pinned */}
                    <div className="flex items-center justify-between p-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shrink-0 z-30 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-zinc-900 text-white border border-white/20 px-10 py-5 rounded-full text-2xl font-black uppercase tracking-widest flex items-center shadow-2xl active:scale-95 transition-transform"
                        >
                            <svg width="36" height="36" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Cerrar
                        </button>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white flex-1 text-center pr-32 italic">
                            {selectedProduct.modelo}
                        </h2>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-48">
                        <div className="w-full h-[45vh] bg-white/[0.02] flex items-center justify-center relative border-b border-white/5 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
                            {selectedProduct.imagenes_urls?.length > 0 ? (
                                <>
                                    <div className="w-full h-full pb-12 pt-16">
                                        <Swiper
                                            grabCursor={true}
                                            slidesPerView={1}
                                            pagination={{ clickable: true, dynamicBullets: true }}
                                            modules={[Pagination]}
                                            onSwiper={setDetailSwiperInstance}
                                            onSlideChange={(swiper) => {
                                                if (selectedProduct.colores && swiper.activeIndex < selectedProduct.colores.length) {
                                                    setSelectedColorIndex(swiper.activeIndex);
                                                }
                                            }}
                                            className="w-full h-full"
                                        >
                                            {selectedProduct.imagenes_urls.map((url, idx) => (
                                                <SwiperSlide key={idx} className="flex items-center justify-center w-full h-full pb-8">
                                                    <img
                                                        src={getOptimizedImageUrl(url, 1400)}
                                                        alt={`${selectedProduct.modelo} vista ${idx + 1}`}
                                                        className="w-[95%] h-[95%] max-w-[1400px] object-contain drop-shadow-[0_60px_80px_rgba(0,0,0,0.9)] transition-all duration-700"
                                                        loading={idx === 0 ? "eager" : "lazy"}
                                                        decoding="async"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    {selectedProduct.colores && selectedProduct.colores.length > 1 && (
                                        <div className="absolute right-12 bottom-12 z-20 flex flex-col gap-6 bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] shadow-2xl border border-white/10">
                                            {selectedProduct.colores.map((colorStr, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (idx < selectedProduct.imagenes_urls.length) {
                                                            setSelectedColorIndex(idx);
                                                            if (detailSwiperInstance) {
                                                                detailSwiperInstance.slideTo(idx);
                                                            }
                                                        }
                                                    }}
                                                    className={`w-20 h-20 rounded-full border-4 shadow-2xl transition-all ${selectedColorIndex === idx
                                                        ? 'border-white scale-115 shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                                                        : 'border-white/10 opacity-40 active:scale-90 hover:opacity-80'
                                                        }`}
                                                    style={{
                                                        backgroundColor: colorStr,
                                                        background: colorStr.includes(' / ') ? `linear-gradient(135deg, ${colorStr.split(' / ')[0]} 50%, ${colorStr.split(' / ')[1]} 50%)` : colorStr
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-white/10 font-black tracking-widest uppercase text-4xl italic">Sin Imagen</div>
                            )}
                        </div>

                        {/* Specs Grid */}
                        <div className="p-16 lg:p-24 max-w-[1400px] mx-auto">
                            <h3 className="text-4xl font-black uppercase tracking-[0.3em] text-zinc-600 mb-16 border-b border-white/5 pb-8 italic">
                                Especificaciones Técnicas
                            </h3>
                            <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                                {Object.entries({
                                    'Motor': selectedProduct.motor_modelo,
                                    'Torque': selectedProduct.motor_nm ? `${selectedProduct.motor_nm} Nm` : null,
                                    'Batería': selectedProduct.bateria_wh ? `${selectedProduct.bateria_wh}Wh` : null,
                                    'Cuadro': selectedProduct.cuadro_material,
                                    'Horquilla': selectedProduct.horquilla,
                                    'Amortiguador': selectedProduct.amortiguador,
                                    'Transmisión': selectedProduct.transmision_modelo,
                                    'Frenos': selectedProduct.frenos_modelo,
                                    'E-System': selectedProduct.display_modelo
                                }).map(([key, value]) => value && (
                                    <div key={key} className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 flex flex-col group hover:bg-white/[0.04] transition-all">
                                        <div className="text-purple-400 font-black uppercase tracking-widest mb-4 text-xl">{key}</div>
                                        <div className="text-3xl font-black text-white leading-tight break-words italic group-hover:text-purple-100">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {activeModal === 'total_control' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">Suspensión</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Control total</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Todo en armonía.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    La potencia no significa nada si no puedes controlarla. Para que esto ocurra, todos los parámetros deben funcionar en sincronía. La TAROK se ha desarrollado en torno a un principio básico: CONTROL TOTAL. La suspensión, los neumáticos y la cinemática se entrelazan como una sola unidad, convirtiendo cada metro en tracción directa y controlada.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control.jpeg" alt="Total control top" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Altura de entrepierna reducida.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Tú mueves la bicicleta, no al revés. La altura del tubo superior drásticamente reducida y la disposición central compacta del amortiguador liberan mucho más espacio para moverse, lo que te da un control total tanto si recorres líneas empinadas, como si te adentras en curvas cerradas o te mueves en el aire. Más control en cada zona.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control2.png" alt="Reduced standover height" className="w-full max-w-none object-contain mb-16" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Mucha suspensión. Aún más reservas.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Tu suspensión te proporciona confort y, al mismo tiempo, reservas suficientes para apoyarte por muy duro que se ponga el camino. Responde con sensibilidad, absorbe los pequeños impactos y se mantiene estable y controlada incluso en los impactos fuertes.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control3.png" alt="Plenty of suspension" className="w-full max-w-none object-contain mb-16 px-6" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Refinada en fábrica y probada en senderos.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Para que la TAROK rinda nada más sacarla de la caja, el ajuste del amortiguador se ha adaptado con precisión a la cinemática trasera. Una mejor sensación de suspensión significa mejor tracción, más respuesta y total confianza en cada sendero.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control4.png" alt="Factory refined" className="w-full max-w-none object-contain mb-6 px-6" />
                        </div>
                    </div>
                </div>
            )}

            {/* SEAMLESS INTEGRATION MODAL */}
            {activeModal === 'seamless_integration' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">Tecnología</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Integración perfecta</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Integración perfecta, con tu fluidez en el centro.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Nada parece intrusivo, combinando una alta densidad energética con una autonomía máxima con el mínimo peso.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    La silueta de la TAROK revela poco sobre lo que hay en su interior. Su tubo superior excepcionalmente bajo y su esbelto tubo diagonal apenas sugieren que estás montando una e-MTB de máxima potencia.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Esto no es casualidad: es por diseño. El soporte del motor, el guiado de cables y los componentes se han refinado hasta el último milímetro. Sin compromisos visibles. Simplemente una integración radical del sistema.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/technologie1.jpg" alt="Seamless integration top" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Innovadora pantalla táctil OLED de 2 pulgadas.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    La innovadora pantalla táctil OLED de 2 pulgadas es más nítida que la de tu smartphone, con 326 ppi, y igual de fácil de usar, incluso bajo la lluvia y con guantes. Con 800 nits de brillo y un contraste extremo, permite consultar de un vistazo y sin distracciones los datos en tiempo real sobre autonomía, brújula y estado de la batería.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    ¿Pasas de la sombra profunda a la luz solar intensa? No hay problema. El sensor de luz ambiental ajusta el brillo en milisegundos a medida que el sendero cambia entre el bosque denso y la línea de la cresta. Los gestos de deslizamiento intuitivos garantizan un control fluido y sin retardos. Todo a la vista. Punto.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/technologie2.png" alt="Innovative 2-inch OLED touchscreen" className="w-full max-w-none object-contain mb-16" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Sólo desliza, sin necesidad de presionar.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Puedes usar la pantalla igual que tu smartphone y cambiar fácilmente entre los elementos del menú.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Y sí, también funciona con guantes.
                                </p>
                            </div>
                            
                            <div className="w-full mb-16">
                                <video 
                                    src="https://www.raymon-bicycles.com/images/tarok/technologie3.mp4" 
                                    className="w-full h-auto"
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                />
                            </div>

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Controladores inalámbricos con conectividad Bluetooth.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    También cabe destacar: Avinox ha desarrollado unos innovadores controladores inalámbricos duales que admiten una conexión Bluetooth a la pantalla de control.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Esto simplifica notablemente el sistema de cables y facilita el mantenimiento de la bicicleta. En el sendero, los mandos permiten cambiar de modo rápidamente a la vez que dan acceso a otras funciones y comandos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PURE SIMPLICITY MODAL */}
            {activeModal === 'pure_simplicity' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">GARANTÍA SIN TONTERÍAS</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Simplicidad Pura</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Sin funciones innecesarias.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Quieres recorrer senderos y entender tu bicicleta de forma intuitiva. La TAROK no te abruma, se mantiene deliberadamente simplificada. Sin funciones innecesarias. Sin trucos. Sólo lo esencial. Hemos eliminado la complejidad para que puedas pasar más tiempo pedaleando y menos en el taller.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/nobullshit.jpg" alt="No Bullshit Guarantee" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <ul className="space-y-6 mb-12">
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Fácil y rápido:</strong> utilizamos hardware robusto y estandarizado. Si alguna vez necesitas una pieza de repuesto, puedes conseguirla sin esperar semanas para la entrega.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Insertos en el cuadro:</strong> protegemos tu cuadro. Gracias a los insertos reemplazables, nunca tendrás que preocuparte por las roscas en el carbono. ¿Te has equivocado al apretar un tornillo? Cambia el inserto, arréglalo y sigue adelante.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Transmisión a prueba de balas:</strong> con componentes LinkGlide y T-Type, confiamos en una tecnología de transmisión diseñada para ofrecer la máxima durabilidad. Absolutamente. Acumulando kilómetro tras kilómetro.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Función Smooth Shift:</strong> cambia sin pedalear. En la TAROK Ultimate y Ultra, el sistema cambia de marcha electrónicamente, incluso cuando tus piernas están quietas. Eso reduce el desgaste y garantiza que siempre estés en la marcha adecuada para volver a arrancar.
                                    </li>
                                </ul>

                                <h4 className="text-xl md:text-2xl font-bold mb-4">Garantía sin tonterías</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    En otras palabras, cada pieza de la TAROK ha sido elegida para durar y para ser fácil de reparar cuando llegue el momento.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    RAYMON apuesta por hardware robusto y estandarizado en lugar de piezas frágiles de marca propia. Utilizamos insertos para el cuadro en lugar de roscas cortadas directamente en el carbono, lo que permite un laminado limpio y un mantenimiento que no requiere un título de ingeniería. Además, los componentes de transmisión LinkGlide y T-Type están fabricados para durar y siguen cambiando con limpieza incluso después de cientos de kilómetros de senderos.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Y sinceramente: rodamientos premium, tornillos estándar en cada pieza del pivote. Todo lo que necesitas para el mantenimiento lo puedes encontrar en cualquier buena tienda de bicicletas, no sólo en un distribuidor especializado.
                                </p>
                                
                                <div className="bg-neutral-100 p-6 md:p-8 rounded-2xl border-l-4 border-purple-500">
                                    <h4 className="text-xl md:text-2xl font-black text-black">
                                        Menos complejidad. Menos tiempo de taller. Más tiempo de ruta.
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BALANCED GEOMETRY MODAL */}
            {activeModal === 'balanced_geometry' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">GEOMETRÍA</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Eficiente subiendo, tranquila bajando</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Equilibramos la geometría para que obtengas la máxima tracción a toda velocidad sin quedarte parado en curvas cerradas.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Los pequeños baches se absorben de forma eficiente sin hundirse demasiado en el recorrido. En los descensos, la TAROK te sitúa justo en el centro de la acción gracias a su equilibrada relación alcance-altura (reach-to-stack). Los descensos se vuelven más rápidos, fáciles y fluidos.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Echemos un vistazo más de cerca a la configuración geométrica:
                                </p>
                            </div>

                            {/* Table */}
                            <div className="px-6 md:px-12 mb-12">
                                <div className="text-sm text-neutral-500 mb-4">Todos los valores en milímetros (mm) o grados (°) <br className="md:hidden" /><span className="md:hidden text-purple-500 font-bold">Desliza a izquierda y derecha para ver la lista</span></div>
                                <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
                                    <table className="w-full min-w-[800px] text-sm text-left">
                                        <thead className="bg-neutral-100 uppercase font-black text-xs">
                                            <tr>
                                                <th className="px-4 py-4 w-1/3">Talla del cuadro</th>
                                                <th colSpan="4" className="px-4 py-4 text-center border-l border-neutral-200">Tarok Ultimate</th>
                                                <th colSpan="4" className="px-4 py-4 text-center border-l border-neutral-200">Tarok</th>
                                            </tr>
                                            <tr className="border-t border-neutral-200 bg-neutral-50 text-neutral-500 uppercase">
                                                <th className="px-4 py-3 font-medium"></th>
                                                <th className="px-2 py-3 text-center border-l border-neutral-200">S</th>
                                                <th className="px-2 py-3 text-center">M</th>
                                                <th className="px-2 py-3 text-center">L</th>
                                                <th className="px-2 py-3 text-center">XL</th>
                                                <th className="px-2 py-3 text-center border-l border-neutral-200">S</th>
                                                <th className="px-2 py-3 text-center">M</th>
                                                <th className="px-2 py-3 text-center">L</th>
                                                <th className="px-2 py-3 text-center">XL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {geoData.map((row, i) => (
                                                <tr key={i} className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-neutral-700">{row.name}</td>
                                                    {row.u.map((val, j) => <td key={`u-${j}`} className={`px-2 py-3 text-center text-neutral-600 ${j===0 ? 'border-l border-neutral-100' : ''}`}>{val}</td>)}
                                                    {row.t.map((val, j) => <td key={`t-${j}`} className={`px-2 py-3 text-center text-neutral-600 ${j===0 ? 'border-l border-neutral-100' : ''}`}>{val}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie1.jpg" alt="Trailduro feeling" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Sensación Trailduro</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    El ángulo de dirección de 64° combina genes de enduro con la agilidad de una bicicleta de trail moderna y juguetona. Junto con la configuración mullet y el bajo centro de gravedad, mantienes el control total en el sendero. No te sientas sobre la máquina: te conviertes en parte de ella.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie2.jpg" alt="Your interface to the trail" className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Tu interfaz con el sendero</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-8">
                                    La máxima libertad de movimiento es una ventaja para el ciclista: la altura del tubo superior fuertemente reducida te da el espacio que necesitas para las secciones técnicas en todos los ángulos de inclinación, junto con la tija telescópica activa. Toda la bicicleta se convierte en tu conexión directa con el suelo.
                                </p>
                                
                                <div className="mb-12">
                                    <button onClick={() => navigate('/totem')} className="inline-flex items-center text-purple-600 font-bold hover:text-purple-500 transition-colors">
                                        Descubre todos los modelos TAROK <ChevronRight className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie3.jpg" alt="Power without fatigue" className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Potencia sin fatiga</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Un stack alto te sitúa en una posición erguida y centrada. Eso ahorra una energía valiosa y reduce la tensión en la zona lumbar. Así te mantienes preciso y con el control incluso en tu décimo descenso.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie4.jpg" alt="Send trails. With balance." className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Domina senderos. Con equilibrio.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Ajustamos las vainas para que la TAROK siga siendo agradablemente agresiva sin arruinar tu ritmo de subida. Cuando la rueda delantera empieza a levantarse en subidas cortas y empinadas, sólo necesitas un impulso controlado y eficiente.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie5.jpg" alt="Geometry action shot" className="w-full max-w-none object-contain mb-12" />
                        </div>
                    </div>
                </div>
            )}

            {/* AVINOX MOTOR MODAL */}
            {activeModal === 'avinox_motor' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <h3 className="text-xl md:text-3xl font-black text-black mb-1 leading-none uppercase">Motor</h3>
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">MOTOR DE MÁXIMA POTENCIA - AVINOX M2S</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Democratización de la potencia.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Pleno rendimiento para cada ciclista. Estamos abriendo el mundo de la TAROK a todo el mundo. Por eso, incluso la TAROK comp de entrada viene equipada con el nuevo sistema de propulsión Avinox, que ofrece unos excepcionales 125 Nm en modo Boost y hasta 1.100 vatios de potencia máxima.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    No estás eligiendo la potencia, simplemente estás eligiendo tu configuración.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinoxMotor1.jpeg" alt="Avinox Motor Detail 1" className="w-full max-w-none object-contain mb-6" />
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/avinoxMotor2.jpeg" alt="Avinox Motor Detail 2" className="w-full max-w-none object-contain mb-12" />
                        </div>
                    </div>
                </div>
            )}

            {/* AVINOX APP MODAL */}
            {activeModal === 'avinox_app' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <h3 className="text-xl md:text-3xl font-black text-black mb-1 leading-none uppercase">Aplicación Avinox Ride</h3>
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Aplicación</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Conectividad smartphone y seguridad mejorada</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    La aplicación Avinox Ride desbloquea todo el potencial de tu sistema de bicicleta eléctrica inteligente. Una vez emparejada por Bluetooth, tendrás acceso a funciones avanzadas como la protección contra el robo de la bicicleta, el seguimiento y el intercambio de datos de los recorridos, los ajustes de asistencia regulables y la monitorización del estado de la bicicleta en tiempo real.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    La aplicación también permite personalizar el perfil del ciclista, ajustar los modos de asistencia y configurar el comportamiento clave del sistema para que se adapte a tu estilo.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-app-3%201.png" alt="Avinox App Übersicht" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-8">Parámetros personalizables</h4>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-parameter_en.png" alt="Avinox Parameter" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Asegura tu TAROK en todo momento</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Tu TAROK se protege a sí misma y te avisa al instante. Al acercarte, se desbloquea automáticamente por Bluetooth. Si ocurre algo sospechoso, se dispara una alarma inmediatamente.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    Las notificaciones push en tiempo real te mantienen informado y con el control: sin pánico, sólo con la confianza de que tu bicicleta está protegida.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-app-fahrradschutz-2%201.png" alt="Avinox Fahrradschutz" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Detecta los problemas antes de que detengan tu viaje</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Si algo va mal, la TAROK te avisa en la pantalla y en la aplicación de inmediato, para que puedas reaccionar pronto y mantener tu bicicleta en las mejores condiciones.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-gesundheitsmanagement-1%201.png" alt="Avinox Gesundheitsmanagement" className="w-full max-w-none object-contain mb-12 px-6 md:px-12" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesDetailTarokTotem;
