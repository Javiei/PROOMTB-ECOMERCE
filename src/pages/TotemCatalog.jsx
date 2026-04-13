import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatPrice } from '../utils';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';
import proomtbLogo from '../assets/proomtb_logo_white.png';

const specsMapping = [
    { label: 'Cuadro', key: 'cuadro_material' },
    { label: 'Horquilla', key: 'horquilla' },
    { label: 'Amortiguador', key: 'shock' },
    { label: 'Motor', key: 'motor_modelo' },
    { label: 'Batería', key: 'bateria_wh', format: (val) => `${val} Wh` },
    { label: 'Display', key: 'display' },
    { label: 'Frenos', key: 'frenos_modelo' },
    { label: 'Cambio', key: 'transmision_modelo' },
    { label: 'Ruedas', key: 'wheelset' },
    { label: 'Neumático Del.', key: 'tire_f' }
];

const TotemCatalog = () => {
    const [products, setProducts] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCatalog, setShowCatalog] = useState(false);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(10);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    // Idle timer to reset to start screen and close modal after 60s of inactivity
    useEffect(() => {
        let timeout;
        const resetState = () => {
            setShowCatalog(false);
            setSelectedSerie(null);
            setSelectedProduct(null);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(resetState, 60000); // 1 minute
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
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch bikes
            const { data: bikesData, error: bikesError } = await supabase
                .from('bicicletas')
                .select('*')
                .order('modelo', { ascending: true });

            // Fetch series for categories
            const { data: seriesData, error: seriesError } = await supabase
                .from('series')
                .select('id, nombre, categoria_id')
                .order('nombre', { ascending: true });

            // Create map of ID -> Name
            const seriesMap = {};
            if (seriesData) {
                seriesData.forEach(s => {
                    seriesMap[s.id] = s.nombre;
                });
            }

            // Enrich bikes with series nombre
            const enrichedBikes = (bikesData || []).map(bike => ({
                ...bike,
                serie_nombre: seriesMap[bike.serie_id] || ''
            }));

            setSeriesList(seriesData || []);
            setProducts(enrichedBikes);
        } catch (error) {
            console.error('Error fetching data for totem:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to request smaller WebP thumbnails from Supabase Storage instead of raw 4K PNGs
    const getOptimizedImageUrl = (url, width = 800) => {
        if (!url) return url;
        // Check if it's a Supabase storage URL
        if (url.includes('supabase.co/storage/v1/object/public/')) {
            // Append transformation parameters. Supabase image transformation requires project to have it enabled.
            // If enabled, this drastically reduces size. If not enabled, Supabase silently ignores it and returns original.
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}width=${width}&quality=80&format=webp`;
        }
        return url;
    };

    // Preload initially visible images using the OPTIMIZED URL
    useEffect(() => {
        if (products.length > 0) {
            const initialBikes = products.slice(0, 4);
            initialBikes.forEach(bike => {
                if (bike.imagenes_urls?.length > 0) {
                    const img = new Image();
                    img.src = getOptimizedImageUrl(bike.imagenes_urls[0], 800);
                }
            });
        }
    }, [products]);

    // Filter products based on selectedSerie
    const filteredProducts = products.filter(p => {
        return selectedSerie === null || p.serie_id === selectedSerie;
    });

    const displayedProducts = filteredProducts.slice(0, displayLimit);

    // Scroll main container to top when category changes
    useEffect(() => {
        setDisplayLimit(10); // Reset limit on category change
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedSerie, showCatalog]);

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 10);
    };

    // Go back to main start screen
    const goHome = () => {
        setShowCatalog(false);
        setSelectedSerie(null);
    };

    if (loading) {
        return (
            <div className="w-screen h-[1920px] max-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-6 mb-12 animate-pulse">
                    <img src={raymonLogo} alt="Raymon Logo" className="h-16 w-auto object-contain brightness-0 invert" />
                    <div className="w-32 h-1 bg-white/30 rounded-full" />
                    <img src={proomtbLogo} alt="ProoMTB Logo" className="h-24 w-auto object-contain" />
                </div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
                <p className="text-white text-2xl mt-8 font-bold tracking-widest uppercase">Cargando Catálogo</p>
            </div>
        );
    }

    // --- INITIAL START SCREEN VIEW ---
    if (!showCatalog) {
        return (
            <div
                className="w-screen h-full flex flex-col bg-black font-sans select-none overflow-hidden relative cursor-pointer"
            >
                {/* Background Nebula Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-between py-32 px-12">
                    {/* Header Logos */}
                    <div className="flex items-center gap-12 opacity-80">
                        <img src={raymonLogo} alt="Raymon" className="h-12 w-auto brightness-0 invert" />
                        <div className="w-px h-12 bg-white/20" />
                        <img src={proomtbLogo} alt="ProoMTB" className="h-16 w-auto" />
                    </div>

                    {/* Main Promotion Content */}
                    <div className="flex flex-col items-center text-center w-full max-w-6xl">
                        {/* THE NEW TAROK "Logo" style */}
                        <div className="flex flex-col items-center mb-16 select-none leading-none scale-125">
                            <span 
                                className="text-6xl md:text-8xl font-black italic tracking-widest uppercase"
                                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent', marginBottom: '-0.1em' }}
                            >
                                THE NEW
                            </span>
                            <span className="text-8xl md:text-[12rem] font-black italic text-white tracking-[0.2em] drop-shadow-[0_0_50px_rgba(166,60,242,0.6)] uppercase">
                                TAROK
                            </span>
                        </div>

                        {/* Large Product Image */}
                        <div className="relative mb-24 w-full flex justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full"></div>
                            <img 
                                src="https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Tarok/Ultra/Raymon_Tarok_Ultra_front.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL1Rhcm9rL1VsdHJhL1JheW1vbl9UYXJva19VbHRyYV9mcm9udC5wbmciLCJpYXQiOjE3NzYwMjUxMzQsImV4cCI6ODgxNzU5Mzg3MzR9.xXvnDG3FUyXMxuKLXBS4MHtMswWVIA7Yl6Qt__Mvjm4" 
                                alt="Raymon Tarok" 
                                className="relative z-10 w-[90%] h-auto object-contain drop-shadow-[0_60px_100px_rgba(0,0,0,0.9)] animate-in zoom-in-75 duration-1000"
                            />
                        </div>

                        {/* Performance Highlights */}
                        <div className="grid grid-cols-3 gap-12 w-full mb-24">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center">
                                <p className="text-purple-400 text-2xl font-black uppercase tracking-widest mb-2">Potencia</p>
                                <p className="text-6xl font-black text-white italic tracking-tighter">150 Nm</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center">
                                <p className="text-blue-400 text-2xl font-black uppercase tracking-widest mb-2">Motor</p>
                                <p className="text-5xl font-black text-white italic tracking-tighter">DJI AVINOX</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center">
                                <p className="text-white/40 text-2xl font-black uppercase tracking-widest mb-2">Peso</p>
                                <p className="text-6xl font-black text-white italic tracking-tighter">20.4 KG</p>
                            </div>
                        </div>
                    </div>

                    {/* Dual CTAs for Kiosk */}
                    <div className="flex flex-col gap-8 w-full max-w-4xl">
                        <button 
                            onClick={() => navigate('/totem/series/tarok')}
                            className="bg-white text-black py-10 px-16 rounded-full text-5xl font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-6 group"
                        >
                            EXPLORAR TAROK 
                            <svg className="w-12 h-12 transform group-hover:translate-x-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        <button 
                            onClick={() => setShowCatalog(true)}
                            className="bg-zinc-900 text-white border border-white/20 py-8 px-16 rounded-full text-3xl font-black uppercase tracking-widest backdrop-blur-md active:scale-95 transition-all"
                        >
                            Ver Catálogo Completo
                        </button>
                    </div>
                </div>

                {/* Bottom Interactive Hint */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
                    <p className="text-white text-xl font-bold uppercase tracking-widest mb-4">Toca para interactuar</p>
                    <div className="w-1 h-12 bg-gradient-to-t from-white to-transparent rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    // --- CATALOG VIEW ---
    return (
        <div className="w-screen h-[1920px] max-h-screen flex flex-col bg-zinc-950 font-sans select-none overflow-hidden relative animate-in fade-in duration-500">
            
            {/* Background Nebula Elements for Catalog */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Top Navigation Bar - Sticky Glassmorphic */}
            <div className="bg-black/40 backdrop-blur-xl text-white shrink-0 shadow-2xl z-20 pb-4 border-b border-white/5">
                <div className="p-8 flex items-center justify-between">
                    <button onClick={goHome} className="flex items-center text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 border border-white/10 px-6 py-4 rounded-full backdrop-blur-md">
                        <svg width="40" height="40" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        <span className="text-3xl font-bold uppercase tracking-widest">Inicio</span>
                    </button>
                    
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
                        <img src={raymonLogo} alt="Raymon" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                        <div className="w-px h-10 bg-white/20" />
                        <img src={proomtbLogo} alt="ProoMTB" className="h-10 md:h-14 w-auto object-contain" />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-500 text-2xl tracking-widest uppercase font-black italic">Catálogo</p>
                        <p className="text-white text-5xl font-black mt-1 uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            MODELOS
                        </p>
                    </div>
                </div>

                {/* Series Horizontal Scroll */}
                <div className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x px-8 pb-6 flex space-x-6 items-center min-h-[120px] mt-4">
                    <button
                        onClick={() => setSelectedSerie(null)}
                        className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedSerie === null
                            ? 'bg-white text-black border-white scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                            }`}
                    >
                        TODOS
                    </button>
                    {seriesList.map((serie) => (
                        <button
                            key={serie.id}
                            onClick={() => setSelectedSerie(serie.id)}
                            className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedSerie === serie.id
                                ? 'bg-purple-600 text-white border-purple-500 scale-105 shadow-[0_10px_40px_rgba(147,51,234,0.3)]'
                                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                                } `}
                        >
                            {serie.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tap indicator */}
            <div className="bg-white/5 backdrop-blur-sm py-4 flex items-center justify-center border-b border-white/5 shrink-0 z-10">
                <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-lg flex items-center">
                    <svg className="w-6 h-6 mr-4 animate-bounce text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    Selecciona un modelo
                </p>
            </div>

            {/* Main Content Area - Vertical scroll */}
            <div className="flex-1 overflow-y-auto p-12 lg:p-16 filter pb-48 no-scrollbar relative z-10" ref={scrollContainerRef}>
                {filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-12">
                        <svg className="w-40 h-40 text-white/10 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                        <h3 className="text-5xl font-black text-white/20 uppercase tracking-tighter italic">No hay modelos disponibles</h3>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        <div className="grid grid-cols-2 gap-12 lg:gap-16 w-full">
                            {displayedProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/totem/series/${product.serie_nombre.toLowerCase()}`)}
                                    className="bg-white/[0.03] backdrop-blur-2xl rounded-[4rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col cursor-pointer active:scale-95 transition-all border border-white/5 h-full relative group overflow-hidden hover:bg-white/[0.06] hover:border-white/10"
                                >
                                    {/* Glass Intensity Glow */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* Price Tag */}
                                    <div className="absolute top-8 right-8 bg-white text-black px-8 py-4 rounded-full text-3xl font-black z-10 shadow-2xl italic tracking-tighter">
                                        {formatPrice(product.precio_eur, 'bikes')}
                                    </div>

                                    {/* Image Container with Dynamic Glow */}
                                    <div className="aspect-[16/10] w-full flex items-center justify-center mb-12 bg-white/[0.02] rounded-[3rem] p-10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {product.imagenes_urls?.length > 0 ? (
                                            <img
                                                src={getOptimizedImageUrl(product.imagenes_urls[0], 1000)}
                                                alt={product.modelo}
                                                className="w-[110%] h-[110%] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700"
                                                loading={filteredProducts.indexOf(product) < 4 ? "eager" : "lazy"}
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="text-white/10 font-black tracking-widest uppercase text-3xl italic">SIN IMAGEN</div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-col justify-end flex-1 relative z-10">
                                        <div className="flex flex-col mb-8">
                                            <span className="text-purple-400 text-xl font-black uppercase tracking-[0.3em] mb-2">{product.serie_nombre}</span>
                                            <h3 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                                {product.modelo}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                            <div className="text-2xl text-zinc-400 font-black uppercase tracking-widest flex items-center group-hover:text-white transition-colors">
                                                DETalles 
                                                <svg className="w-8 h-8 ml-4 transform group-hover:translate-x-2 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            </div>
                                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-xl">
                                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {filteredProducts.length > displayedProducts.length && (
                            <button
                                onClick={handleLoadMore}
                                className="mt-24 bg-white text-black px-20 py-8 rounded-full text-4xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center"
                            >
                                <svg className="w-10 h-10 mr-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                Cargar Más
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TotemCatalog;
