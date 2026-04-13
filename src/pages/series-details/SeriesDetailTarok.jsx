import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Smartphone, ArrowRight, Battery, Activity, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { slugify, formatPrice } from '../../utils';

const geoData = [
  { name: 'Seat tube length', u: ['400', '420', '440', '460'], t: ['400', '420', '440', '460'] },
  { name: 'Effective top tube length', u: ['572', '593', '620', '647'], t: ['572', '593', '620', '647'] },
  { name: 'Head tube length', u: ['115', '115', '125', '135'], t: ['115', '115', '125', '135'] },
  { name: 'Chainstay length', u: ['445', '445', '445', '445'], t: ['445', '445', '445', '445'] },
  { name: 'Wheelbase', u: ['1.223', '1.244', '1.272', '1.302'], t: ['1.223', '1.244', '1.272', '1.302'] },
  { name: 'Reach', u: ['435', '456', '480', '505'], t: ['435', '456', '480', '505'] },
  { name: 'Stack', u: ['642', '642', '651', '660'], t: ['642', '642', '651', '660'] },
  { name: 'Bottom bracket drop', u: ['19', '19', '19', '19'], t: ['19', '19', '19', '19'] },
  { name: 'Ground clearance', u: ['25', '25', '25', '25'], t: ['25', '25', '25', '25'] },
  { name: 'Head angle', u: ['64°', '64°', '64°', '64°'], t: ['64°', '64°', '64°', '64°'] },
  { name: 'Seat angle', u: ['78,3°', '77,9°', '77,5°', '77,3°'], t: ['78,3°', '77,9°', '77,5°', '77,3°'] },
  { name: 'Stem length', u: ['35', '35', '35', '35'], t: ['35', '35', '35', '35'] },
  { name: 'Handlebar width', u: ['800', '800', '800', '800'], t: ['800', '800', '800', '800'] },
  { name: 'Crank length', u: ['160', '160', '160', '165'], t: ['160', '160', '160', '165'] },
  { name: 'Dropper Post', u: ['120', '150', '180', '210'], t: ['125', '150', '170', '200'] },
  { name: 'Standover height', u: ['–', '75', '–', '-'], t: ['–', '75', '–', '–'] },
];

const SeriesDetailTarok = () => {
    const textRef = useRef(null);
    const introTextRef = useRef(null);
    const efficiencyTextRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [introScrollProgress, setIntroScrollProgress] = useState(0);
    const [efficiencyScrollProgress, setEfficiencyScrollProgress] = useState(0);
    const [activeModal, setActiveModal] = useState(null);
    const [bikes, setBikes] = useState([]);
    const [loadingBikes, setLoadingBikes] = useState(true);

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



    return (
        <div className="font-sans text-neutral-900 bg-white">
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
                        <span>Bikes</span>
                        <span>/</span>
                        <span>Fully</span>
                        <span>/</span>
                        <span>Modelle</span>
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
                        Full-power e-MTB performance, wrapped in an ultra-light full-carbon frame. Powered by the revolutionary Avinox M2S. Ready for any trail you dare to take on.
                    </p>

                    <a href="#discover" className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        Discover TAROK
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
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">Mullet setup</p>
                            <p className="text-2xl md:text-3xl font-black text-white">160/150mm</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">Weight</p>
                            <p className="text-2xl md:text-3xl font-black text-white">from 20.4 kg</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mb-2 font-bold">High power</p>
                            <p className="text-2xl md:text-3xl font-black text-white">150 Nm / 700 Wh</p>
                        </div>
                    </div>
                </div>
                </section>

                {/* CHOOSE YOUR TAROK (Models) */}
                <section id="discover" className="relative z-10 py-24 px-6 md:px-16">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-[10px] md:text-xs font-black text-purple-400 uppercase tracking-[0.4em] mb-4">Models</h2>
                        <h3 className="text-4xl md:text-5xl lg:text-5xl font-black mb-20 text-white italic tracking-tight">Choose your TAROK.</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-white max-w-6xl mx-auto">
                            {bikes.map(bike => (
                                <Link to={`/product/${slugify(bike.modelo)}`} key={bike.id} className="group flex flex-col items-center transition-all duration-500" onClick={() => window.scrollTo(0, 0)}>
                                    <div className="aspect-[16/10] w-full flex items-center justify-center relative mb-8">
                                        <img 
                                            src={bike.imagenes_urls?.[0]} 
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
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-20">
                            <Link to="/catalogo" className="inline-flex items-center gap-2 border border-purple-500 text-purple-300 px-8 py-3 rounded-full font-bold hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_15px_rgba(166,60,242,0.4)]">
                                Discover all TAROK models <ArrowRight className="w-4 h-4" />
                            </Link>
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
                        <h4 className="text-sm md:text-base font-bold text-purple-400 uppercase tracking-[0.2em] mb-6">Kinematics</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white">
                            Maximum confidence on the most
                            <br className="hidden md:block" /> demanding descents.
                        </h2>
                        <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-light">
                            At the heart of the TAROK is its HSC full-carbon frame. <span 
                                ref={textRef} 
                                style={{
                                    color: `rgba(${80 + scrollProgress * 112}, ${80 + scrollProgress * 52}, ${90 + scrollProgress * 162}, ${0.3 + scrollProgress * 0.7})`,
                                    textShadow: `0 0 ${scrollProgress * 20}px rgba(192,132,252,${scrollProgress * 0.8})`,
                                    transition: 'color 0.1s ease-out, text-shadow 0.1s ease-out'
                                }}
                            >With a system weight
                            <br className="hidden lg:block" /> of just 20.4 kg, the TAROK effortlessly outperforms the competition in its
                            <br className="hidden lg:block" /> class.</span>
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
                            Stable at speed. Playful when the trail gets technical. The specially developed rear suspension kinematics deliver sensitive initial travel response and controlled support through the mid-stroke. The suspension stays active under braking, giving you maximum traction on any terrain at all times.
                        </p>
                    </div>

                    <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-6 lg:px-8">
                        {[
                            {
                                subtitle: 'SUSPENSION',
                                title: 'Total control',
                                desc: 'Confidence and control in every situation.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/total_control.jpeg'
                            },
                            {
                                subtitle: 'TECHNOLOGY',
                                title: 'Seamless integration',
                                desc: 'Optimized down to the smallest detail.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/seamless_integration.jpeg'
                            },
                            {
                                subtitle: 'NO-BULLSHIT GUARANTEE',
                                title: 'Pure Simplicity',
                                desc: 'No unnecessary features. Pure ride feel.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/pure_simplicity.jpeg'
                            },
                            {
                                subtitle: 'GEOMETRY',
                                title: 'Balanced Geometry',
                                desc: 'The numbers behind the feeling.',
                                img: 'https://www.raymon-bicycles.com/images/tarok/geometrie.jpeg'
                            }
                        ].map((item, idx) => (
                            <div key={idx} onClick={() => { 
                                if (item.title === 'Total control') setActiveModal('total_control');
                                if (item.title === 'Seamless integration') setActiveModal('seamless_integration');
                                if (item.title === 'Pure Simplicity') setActiveModal('pure_simplicity');
                                if (item.title === 'Balanced Geometry') setActiveModal('balanced_geometry');
                            }} className="relative group overflow-hidden rounded-lg md:rounded-xl aspect-square md:aspect-[10/9] cursor-pointer">
                                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/50 group-hover:to-black/20 transition-colors duration-700"></div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col justify-end w-full">
                                    <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-purple-400 mb-2">{item.subtitle}</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{item.title}</h3>
                                    <p className="text-sm md:text-base font-medium text-white/80 mb-6">{item.desc}</p>
                                    <span className="text-xs font-bold text-white flex items-center gap-2 group-hover:text-purple-400 transition-colors uppercase tracking-wider">
                                        <ArrowRight className="w-4 h-4" /> Learn more
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
                        <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-purple-400 mb-6 block">Efficiency</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-12 md:mb-16 leading-tight drop-shadow-md">
                            Full power with minimal <br className="hidden md:block"/> energy loss.
                        </h2>
                        
                        <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-4xl mx-auto">
                            <span className="text-white">Light carbon wheels reduce rotating mass and improve your acceleration and handling noticeably. Experience maximum </span>
                            <span 
                                ref={efficiencyTextRef}
                                style={{
                                    color: `rgba(${80 + efficiencyScrollProgress * 112}, ${80 + efficiencyScrollProgress * 52}, ${90 + efficiencyScrollProgress * 162}, ${0.3 + efficiencyScrollProgress * 0.7})`,
                                    textShadow: `0 0 ${efficiencyScrollProgress * 20}px rgba(192,132,252,${efficiencyScrollProgress * 0.8})`,
                                    transition: 'color 0.1s ease-out, text-shadow 0.1s ease-out'
                                }}
                            >
                                efficiency on long climbs and technical uphills.
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
                            "We developed the TAROK because we were fired up to build it. After all, the best ideas come when the workshop doors should already be closed."
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
                        <h4 className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-[0.2em] mb-6">FULL POWER MOTOR - AVINOX M2S</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white drop-shadow-md">
                            Your power? Times 8!
                        </h2>
                        <p className="text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto text-balance">
                            As if you had superhero legs: the patented planetary gearbox of the Avinox M2S gives you up to 800% support. Every gram of pedal pressure translates into pure, consistent drive. It is designed for maximum durability and power output, so you can push TAROK as long as you want.
                        </p>
                        <span onClick={() => setActiveModal('avinox_motor')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block mb-16">
                            &rarr; Learn more
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
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4">System</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white drop-shadow-md">
                                Data that thinks ahead.
                            </h2>
                            <p className="text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed max-w-xl text-balance">
                                The Avinox Drive System runs precisely in the background. Over 40 data points capture everything that matters on trail: range, ride time, speed. With the Avinox Ride app, you can tailor TAROK to your needs and set up your display exactly how you like it.
                            </p>
                            <span onClick={() => setActiveModal('avinox_app')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block">
                                &rarr; Learn more
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
                                alt="Avinox Battery FP700" 
                                className="w-full max-w-[600px] h-auto object-contain"
                            />
                        </div>
                        <div>
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4">Battery</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black leading-tight mb-8 text-white drop-shadow-md pr-8">
                                Up to 157 km of range for maximum laps.
                            </h2>
                            <p className="text-base md:text-lg font-medium text-white/90 mb-6 leading-relaxed max-w-xl text-balance">
                                Whichever TAROK model you choose, it always comes equipped with the new FP700 battery with even higher energy density. But don't let the “700” fool you. We deliberately call it a high-energy battery. With an exceptionally high energy density of 220 Wh/kg, it delivers instant push with up to 2,000 W of output.
                            </p>
                            <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed max-w-xl text-balance">
                                The secret lies in the system: only the combination of the M2S motor and FP700 battery unleashes this level of performance.
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
                            <h4 className="text-xs md:text-sm font-bold text-purple-400 tracking-[0.2em] mb-4 uppercase">APP</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black leading-tight mb-8 text-white drop-shadow-md pb-2">
                                Avinox Ride App including anti-theft protection
                            </h2>
                            <p className="text-base md:text-lg font-medium text-white mb-10 leading-relaxed text-shadow-sm text-balance">
                                Secure, connected, and always on your radar: use the app to fine-tune torque and motor overrun to match your riding style exactly. Thanks to integrated LTE connectivity, you can keep an eye on your TAROK at all times. A digital lock, real-time GPS, and an audible alarm make life difficult for thieves while you always know exactly where your bike is.
                            </p>
                            <span onClick={() => setActiveModal('avinox_app')} className="cursor-pointer text-sm md:text-base font-bold text-white hover:text-purple-400 transition-colors inline-block drop-shadow-md">
                                &rarr; Learn more
                            </span>
                        </div>
                    </div>
                </section>


                </div> {/* End blackout wrapper */}
                </div> {/* End content layer */}
            </div> {/* End massive continuous container */}

            {/* MODALS */}
            {activeModal === 'total_control' && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white w-full md:w-[85vw] lg:w-[1000px] h-screen max-w-none overflow-y-auto relative flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header */}
                        <div className="sticky top-0 w-full bg-white z-10 px-6 py-6 md:px-8 border-b border-gray-100 flex justify-between items-start rounded-tl-3xl">
                            <div>
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">Suspension</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Total control</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Everything in harmony.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Power means nothing if you cannot control it. To make it happen, every parameter has to work in sync. The TAROK was developed around one core principle: TOTAL CONTROL. Suspension, tires, and kinematics interlock as one unit, turning every meter into direct, controlled traction.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control.jpeg" alt="Total control top" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Reduced standover height.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    You move the bike - not the other way around. The drastically reduced standover height and compact central shock layout free up significantly more room to move, giving you full control whether you are riding steep lines, pushing deep into corners, or shifting in mid-air. More control in every zone.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control2.png" alt="Reduced standover height" className="w-full max-w-none object-contain mb-16" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Plenty of suspension. Even more reserves.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Your suspension gives you comfort and, at the same time, enough reserves to back you no matter how rough the trail gets. It responds sensitively, absorbs small hits, and remains stable and controlled even on heavy impacts.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/total_control3.png" alt="Plenty of suspension" className="w-full max-w-none object-contain mb-16 px-6" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Factory refined and trail tested.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    To make the TAROK perform right out of the box, the shock tune has been precisely matched to the rear kinematics. Better suspension feel means better traction, more feedback and full confidence on every trail.
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
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">Technology</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Seamless integration</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Seamless integration, with your flow at the center.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Nothing feels intrusive, combining high energy density with maximum range at minimal weight.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    The TAROK's silhouette gives little away about what is inside. Its exceptionally low top tube and slender down tube barely suggest that you are riding a full-power e-MTB.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    This is no coincidence - it is by design. The motor mount, cable routing, and components have all been refined down to the last millimeter. No visible compromises. Just radical system integration.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/technologie1.jpg" alt="Seamless integration top" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Innovative 2-inch OLED touchscreen.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    The innovative 2-inch OLED touchscreen is sharper than your smartphone at 326 ppi - and just as easy to use, even in the rain and with gloves. With 800 nits of brightness and extreme contrast, it lets you take in real-time data on range, compass, and battery status at a glance, without distraction.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Moving from deep shade to bright sunlight? No problem. The ambient light sensor adjusts brightness in milliseconds as your trail shifts between dense forest and the ridgeline. Intuitive swipe gestures ensure seamless, lag-free control. Everything in view. Period.
                                </p>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/technologie2.png" alt="Innovative 2-inch OLED touchscreen" className="w-full max-w-none object-contain mb-16" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Just swipe — no pressing required.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    You can use the display just like your smartphone and easily switch between menu items.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    And yes, it works with gloves on, too.
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
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Wireless controllers with Bluetooth connectivity.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Also worth noting: Avinox has developed innovative dual wireless controllers that support a Bluetooth connection to the control display.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    This significantly simplifies the cable system and makes bike maintenance easier. On trail, the controllers let you switch modes quickly while also giving you access to other functions and commands.
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
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">NO-BULLSHIT GUARANTEE</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Pure Simplicity</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">No unnecessary features.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    You want to hit trail and understand your bike intuitively. The TAROK does not overwhelm you - it deliberately stays pared back. No unnecessary features. No gimmicks. Just the essentials. We stripped complexity so you can spend more time riding and less time in the workshop.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/nobullshit.jpg" alt="No Bullshit Guarantee" className="w-full object-cover max-h-[400px] mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <ul className="space-y-6 mb-12">
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Easy and fast:</strong> we use robust, standardized hardware. If you ever need a replacement part, you can get it without waiting weeks for delivery.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Frame inserts:</strong> we protect your frame. Thanks to replaceable inserts, you never have to worry about threads in carbon. Made a mistake while tightening a bolt? Swap the insert, fix it, and keep going.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Bulletproof drivetrain:</strong> with LinkGlide and T-Type components, we rely on drivetrain technology built for maximum durability. Absolutely. Racking up mile after mile.
                                    </li>
                                    <li className="text-base md:text-lg text-neutral-600 leading-relaxed">
                                        <strong className="text-black">Smooth Shift function:</strong> shift without pedaling. On the TAROK Ultimate and Ultra, the system changes gears electronically, even when your legs are still. That reduces wear and ensures you're always in the right gear for re-entry.
                                    </li>
                                </ul>

                                <h4 className="text-xl md:text-2xl font-bold mb-4">No-bullshit guarantee</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    In other words, every part on the TAROK is chosen to last - and to be easy to service when the time comes.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    RAYMON stands for robust, standardized hardware instead of fragile proprietary parts. We use frame inserts rather than threads cut directly into the carbon, allowing for a clean layup and servicing that does not require an engineering degree. On top of that, LinkGlide and T-Type drivetrain components are built for durability and continue to shift cleanly even after hundreds of trail miles.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    And honestly: premium bearings, standard bolts on every complicated pivot hardware. Everything you need for servicing can be found at any good bike shop - not just at a specialist dealer.
                                </p>
                                
                                <div className="bg-neutral-100 p-6 md:p-8 rounded-2xl border-l-4 border-purple-500">
                                    <h4 className="text-xl md:text-2xl font-black text-black">
                                        Less complexity. Less workshop time. More trail time.
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
                                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-purple-400 mb-2 block">GEOMETRY</span>
                                <h3 className="text-3xl md:text-4xl font-black text-black">Efficient uphill, calm downhill</h3>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors mt-1">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    We balanced the geometry so you get maximum traction at full speed without stalling in tight switchbacks.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Small bumps are absorbed efficiently without sinking too deep into the travel. On descents, TAROK places you right in the center of the action thanks to the finely balanced reach-to-stack ratio. Downhills become faster, easier, and feel more fluid.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    Let's take a closer look at the geo setup:
                                </p>
                            </div>

                            {/* Table */}
                            <div className="px-6 md:px-12 mb-12">
                                <div className="text-sm text-neutral-500 mb-4">All values in millimeters (mm) or degrees (°) <br className="md:hidden" /><span className="md:hidden text-purple-500 font-bold">Swipe left and right to view the list</span></div>
                                <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
                                    <table className="w-full min-w-[800px] text-sm text-left">
                                        <thead className="bg-neutral-100 uppercase font-black text-xs">
                                            <tr>
                                                <th className="px-4 py-4 w-1/3">Frame size</th>
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
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Trailduro feeling</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    The 64° head angle combines enduro genes with the agility of a modern, playful trail bike. Together with the mullet setup and low center of gravity, you keep full control on the trail. You do not sit on the machine - you become part of it.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie2.jpg" alt="Your interface to the trail" className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Your interface to the trail</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-8">
                                    Maximum freedom of movement is a rider advantage: the heavily reduced standover height gives you the room you need for technical sections in every lean angle, together with the active dropper post. The whole bike becomes your direct connection to the ground.
                                </p>
                                
                                <div className="mb-12">
                                    <Link to="/catalogo" className="inline-flex items-center text-purple-600 font-bold hover:text-purple-500 transition-colors">
                                        Discover all TAROK models <ChevronRight className="w-5 h-5 ml-1" />
                                    </Link>
                                </div>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie3.jpg" alt="Power without fatigue" className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Power without fatigue</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    A high stack puts you in an upright, centered position. That saves valuable energy and reduces strain on your lower back. So you stay precise and in control even on your tenth descent.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/geometrie4.jpg" alt="Send trails. With balance." className="w-full max-w-none object-contain mb-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Send trails. With balance.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    We tuned the chainstay so TAROK stays nicely aggressive without killing your uphill rhythm. When the front wheel starts to rise on steep punchy climbs, you only need controlled, efficient drive.
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
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Full power motor - AVINOX M2S</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Democratizing of power.</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Full performance for every rider. We are opening up the world of TAROK to everyone. That is why even the entry-level TAROK comp comes equipped with the new Avinox drive system, delivering an exceptional 125 Nm in Boost mode and up to 1,100 watts of peak power.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    You are not choosing the power - you are simply choosing your setup.
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
                                <h3 className="text-xl md:text-3xl font-black text-black mb-1 leading-none uppercase">Avinox Ride App</h3>
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">App</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-0 pb-12 w-full flex flex-col text-black pt-8">
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Smartphone connectivity and enhanced security</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    The Avinox Ride app unlocks the full potential of your smart e-bike system. Once paired via Bluetooth, you gain access to advanced features like bike theft protection, ride data tracking and sharing, adjustable assistance settings, and real-time bike status monitoring.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    The app also lets you customize your ride profile, tune support modes, and configure key system behavior to match your style.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-app-3%201.png" alt="Avinox App Übersicht" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />
                            
                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-8">Customizable parameters</h4>
                            </div>
                            
                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-parameter_en.png" alt="Avinox Parameter" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Secure your TAROK at all times</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6">
                                    Your TAROK protects itself - and alerts you instantly. As you approach, it unlocks automatically via Bluetooth. If anything suspicious happens, an alarm is triggered immediately.
                                </p>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-bold mb-12">
                                    Real-time push notifications keep you informed and in control - no panic, just confidence that your bike is protected.
                                </p>
                            </div>

                            <img src="https://www.raymon-bicycles.com/images/tarok/avinox-app-fahrradschutz-2%201.png" alt="Avinox Fahrradschutz" className="w-full max-w-none object-contain mb-16 px-6 md:px-12" />

                            <div className="px-6 md:px-12">
                                <h4 className="text-xl md:text-2xl font-bold mb-4">Detect issues before they stop your ride</h4>
                                <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-12">
                                    If something is off, TAROK notifies you on the display and in the app right away, so you can react early and keep your bike in top condition.
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

export default SeriesDetailTarok;
