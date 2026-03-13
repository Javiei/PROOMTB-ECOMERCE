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
                className="w-screen h-[1920px] max-h-screen flex flex-col bg-black font-sans select-none overflow-hidden relative cursor-pointer"
                onClick={() => setShowCatalog(true)}
            >
                {/* Background Video */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    <iframe
                        src="https://player.vimeo.com/video/1152285858?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&dnt=1"
                        className="absolute top-1/2 left-1/2 w-[300vh] min-w-full min-h-full h-[300vh] transform -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none opacity-80"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Start Video"
                    ></iframe>
                </div>

                {/* Gradient Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none z-10"></div>

                {/* Logos Centered on Y axis */}
                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 pointer-events-none pb-64">
                    <div className="flex flex-col items-center justify-center gap-16">
                        <img
                            src={raymonLogo}
                            alt="Raymon Logo"
                            className="h-32 md:h-48 w-auto object-contain brightness-0 invert drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
                        />
                        <div className="w-64 h-2 bg-white/30 rounded-full"></div>
                        <img
                            src={proomtbLogo}
                            alt="ProoMTB Logo"
                            className="h-48 md:h-64 w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
                        />
                    </div>
                </div>

                {/* Call to action center-bottom */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-64 z-20 pointer-events-none">
                    <div className="flex flex-col items-center animate-pulse">
                        <p className="text-white text-7xl font-black uppercase tracking-widest bg-black/40 px-16 py-8 rounded-full backdrop-blur-md border border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.2)] text-center">
                            Tocar <br />Para Comenzar
                        </p>
                        <svg className="w-24 h-24 text-white mt-12 animate-bounce drop-shadow-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
        );
    }

    // --- CATALOG VIEW ---
    return (
        <div className="w-screen h-[1920px] max-h-screen flex flex-col bg-zinc-50 font-sans select-none overflow-hidden relative animate-in fade-in duration-500">

            {/* Top Navigation Bar - Sticky */}
            <div className="bg-black text-white shrink-0 shadow-xl z-20 pb-4">
                <div className="p-8 flex items-center justify-between">
                    <button onClick={goHome} className="flex items-center text-zinc-400 hover:text-white transition-colors active:scale-95 bg-zinc-900 px-6 py-4 rounded-full">
                        <svg width="40" height="40" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        <span className="text-3xl font-bold uppercase tracking-widest">Atrás</span>
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <img src={raymonLogo} alt="Raymon" className="h-6 md:h-8 w-auto object-contain brightness-0 invert" />
                        <div className="w-px h-8 bg-white/30" />
                        <img src={proomtbLogo} alt="ProoMTB" className="h-8 md:h-12 w-auto object-contain" />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-500 text-2xl tracking-widest uppercase font-bold">Catálogo</p>
                        <p className="text-white text-5xl font-black mt-1 uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            MODELOS
                        </p>
                    </div>
                </div>

                {/* Series Horizontal Scroll */}
                <div className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x px-8 pb-6 flex space-x-4 items-center min-h-[100px] mt-4">
                    <button
                        onClick={() => setSelectedSerie(null)}
                        className={`snap-center shrink-0 px-10 py-5 rounded-full text-2xl font-black uppercase tracking-wider transition-all border-2 flex items-center justify-center min-w-[200px] ${selectedSerie === null
                            ? 'bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                            : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'
                            }`}
                    >
                        TODOS
                    </button>
                    {seriesList.map((serie) => (
                        <button
                            key={serie.id}
                            onClick={() => setSelectedSerie(serie.id)}
                            className={`snap-center shrink-0 px-10 py-5 rounded-full text-2xl font-black uppercase tracking-wider transition-all border-2 flex items-center justify-center min-w-[200px] ${selectedSerie === serie.id
                                ? 'bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'
                                } `}
                        >
                            {serie.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tap indicator */}
            <div className="bg-zinc-200 py-3 flex items-center justify-center border-b border-zinc-300 shadow-inner shrink-0 z-10">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-lg flex items-center">
                    <svg className="w-6 h-6 mr-3 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    Toca cualquier modelo para ver detalles
                </p>
            </div>

            {/* Main Content Area - Vertical scroll */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 filter pb-32 no-scrollbar" ref={scrollContainerRef}>
                {filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-12">
                        <svg className="w-40 h-40 text-zinc-300 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                        <h3 className="text-4xl font-black text-zinc-400 uppercase tracking-tighter">No hay modelos disponibles en esta categoría</h3>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full pb-16">
                        <div className="grid grid-cols-2 gap-6 md:gap-8 w-full">
                            {displayedProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/totem/series/${product.serie_nombre}`)}
                                    className="bg-white rounded-[3rem] p-8 shadow-xl shadow-zinc-200/50 flex flex-col cursor-pointer active:scale-95 transition-transform border border-zinc-100 h-full relative overflow-hidden"
                                >
                                    {/* Price Tag */}
                                    <div className="absolute top-6 right-6 bg-black text-white px-6 py-3 rounded-full text-2xl font-black z-10 shadow-lg">
                                        {formatPrice(product.precio_eur, 'bikes')}
                                    </div>

                                    {/* Image */}
                                    <div className="aspect-[4/3] w-full flex items-center justify-center mb-8 bg-zinc-50 rounded-[2rem] p-6 relative">
                                        {product.imagenes_urls?.length > 0 ? (
                                            <img
                                                src={getOptimizedImageUrl(product.imagenes_urls[0], 800)}
                                                alt={product.modelo}
                                                className="w-full h-full max-w-[800px] object-contain mix-blend-multiply transition-opacity duration-300"
                                                loading={filteredProducts.indexOf(product) < 4 ? "eager" : "lazy"}
                                                decoding="async"
                                                style={{ contentVisibility: filteredProducts.indexOf(product) > 6 ? 'auto' : 'visible' }}
                                            />
                                        ) : (
                                            <div className="text-zinc-300 font-black tracking-widest uppercase text-2xl">Imagen No Disp.</div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-col justify-end flex-1">
                                        <h3 className="text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter leading-tight mb-6">
                                            {product.modelo}
                                        </h3>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100">
                                            <div className="text-xl text-zinc-400 font-bold uppercase tracking-wider flex items-center">
                                                Info <svg width="24" height="24" className="ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            </div>
                                            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-black">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
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
                                className="mt-16 bg-white border border-zinc-200 text-black px-16 py-6 rounded-full text-3xl font-black uppercase tracking-widest shadow-lg hover:bg-zinc-50 active:scale-95 transition-all flex items-center"
                            >
                                <svg className="w-8 h-8 mr-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                Ver Más Modelos
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TotemCatalog;
