import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatPrice } from '../utils';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';
import proomtbLogo from '../assets/proomtb_logo_white.png';
import { Zap, Bike, ShoppingBag, X } from 'lucide-react';

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

const ebikeCategories = [
    { id: 1, label: 'E-MTB', desc: 'Montaña asistida' },
    { id: 2, label: 'E-Gravel', desc: 'Aventura todo terreno' },
    { id: 3, label: 'E-Trekking', desc: 'Viaje y confort' },
    { id: 4, label: 'E-City', desc: 'Movilidad urbana' }
];

const normalCategories = [
    { id: 5, label: 'Road', desc: 'Asfalto y velocidad' },
    { id: 6, label: 'Gravel', desc: 'Caminos mixtos' },
    { id: 7, label: 'MTB', desc: 'Senderos de montaña' },
    { id: 8, label: 'Trekking', desc: 'Cicloturismo y paseo' },
    { id: 9, label: 'Kids', desc: 'Diversión segura' }
];

const TotemCatalog = () => {
    const [products, setProducts] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [accessoryCategories, setAccessoryCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedAccessory, setSelectedAccessory] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    // Load states from sessionStorage if available to persist user view when returning from detail page
    const [showCatalog, setShowCatalog] = useState(() => {
        return sessionStorage.getItem('totem_showCatalog') === 'true';
    });
    const [catalogSection, setCatalogSection] = useState(() => {
        return sessionStorage.getItem('totem_catalogSection') || 'menu';
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
        const val = sessionStorage.getItem('totem_selectedCategoryId');
        return val ? parseInt(val, 10) : null;
    });
    const [selectedAccessoryCategory, setSelectedAccessoryCategory] = useState(() => {
        return sessionStorage.getItem('totem_selectedAccessoryCategory') || 'all';
    });
    const [displayLimit, setDisplayLimit] = useState(() => {
        const val = sessionStorage.getItem('totem_displayLimit');
        return val ? parseInt(val, 10) : 10;
    });

    // Save states to sessionStorage when they change
    useEffect(() => {
        sessionStorage.setItem('totem_showCatalog', showCatalog);
        sessionStorage.setItem('totem_catalogSection', catalogSection);
        if (selectedCategoryId !== null) {
            sessionStorage.setItem('totem_selectedCategoryId', selectedCategoryId);
        } else {
            sessionStorage.removeItem('totem_selectedCategoryId');
        }
        sessionStorage.setItem('totem_selectedAccessoryCategory', selectedAccessoryCategory);
        sessionStorage.setItem('totem_displayLimit', displayLimit);
    }, [showCatalog, catalogSection, selectedCategoryId, selectedAccessoryCategory, displayLimit]);

    // Idle timer to reset to start screen and close modal after 60s of inactivity
    useEffect(() => {
        let timeout;
        const resetState = () => {
            sessionStorage.clear();
            setShowCatalog(false);
            setCatalogSection('menu');
            setSelectedCategoryId(null);
            setSelectedAccessoryCategory('all');
            setSelectedProduct(null);
            setSelectedAccessory(null);
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

            // Fetch accessories (products table)
            const { data: accessoriesData, error: accessoriesError } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true });

            // Create maps for series name and category ID lookup
            const seriesNameMap = {};
            const seriesCategoryMap = {};
            if (seriesData) {
                seriesData.forEach(s => {
                    seriesNameMap[s.id] = s.nombre;
                    seriesCategoryMap[s.id] = s.categoria_id;
                });
            }

            // Enrich bikes with series nombre and category ID
            const enrichedBikes = (bikesData || []).map(bike => ({
                ...bike,
                serie_nombre: seriesNameMap[bike.serie_id] || '',
                categoria_id: seriesCategoryMap[bike.serie_id] || null
            }));

            setSeriesList(seriesData || []);
            setProducts(enrichedBikes);

            // Enrich and map accessories
            const mappedAccessories = (accessoriesData || []).map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                category: item.category?.trim() || 'Accessory',
                description: item.description
            }));
            setAccessories(mappedAccessories);

            // Extract unique categories for accessories
            const normalizedCategories = (accessoriesData || [])
                .map(item => {
                    let cat = item.category?.trim();
                    if (cat === 'Guantilllas') return 'Guantillas';
                    return cat;
                })
                .filter(Boolean);
            const uniqueCategories = [...new Set(normalizedCategories)];
            setAccessoryCategories(uniqueCategories);

        } catch (error) {
            console.error('Error fetching data for totem:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to request smaller WebP thumbnails from Supabase Storage instead of raw 4K PNGs
    const getOptimizedImageUrl = (url, width = 800) => {
        if (!url) return url;
        if (url.includes('supabase.co/storage/v1/object/public/')) {
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

    // Determine horizontal categories filter options
    const bikeCategoriesOptions = catalogSection === 'ebikes' ? ebikeCategories : normalCategories;

    // Filter products based on selectedCategoryId and section
    const filteredProducts = products.filter(p => {
        if (catalogSection === 'ebikes') {
            if (p.categoria_id !== null && p.categoria_id <= 4) {
                if (selectedCategoryId !== null) {
                    return p.categoria_id === selectedCategoryId;
                }
                return true;
            }
            return false;
        } else if (catalogSection === 'bikes') {
            if (p.categoria_id !== null && p.categoria_id > 4) {
                if (selectedCategoryId !== null) {
                    return p.categoria_id === selectedCategoryId;
                }
                return true;
            }
            return false;
        }
        return false;
    });

    const displayedProducts = filteredProducts.slice(0, displayLimit);

    // Filter accessories based on selected category
    const filteredAccessories = accessories.filter(acc => {
        if (selectedAccessoryCategory !== 'all') {
            return acc.category === selectedAccessoryCategory;
        }
        return true;
    });

    const displayedAccessories = filteredAccessories.slice(0, displayLimit);

    // Scroll main container to top when category/section changes
    useEffect(() => {
        setDisplayLimit(10); // Reset limit on category change
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedCategoryId, selectedAccessoryCategory, catalogSection, showCatalog]);

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 10);
    };

    // Go back to main start screen
    const goHome = () => {
        sessionStorage.clear();
        setShowCatalog(false);
        setCatalogSection('menu');
        setSelectedCategoryId(null);
        setSelectedAccessoryCategory('all');
        setSelectedAccessory(null);
    };

    // Handle back navigation inside catalog
    const handleBack = () => {
        if (catalogSection === 'ebikes' || catalogSection === 'ebikes-menu') {
            if (catalogSection === 'ebikes') {
                setCatalogSection('ebikes-menu');
            } else {
                setCatalogSection('menu');
            }
            setSelectedCategoryId(null);
        } else if (catalogSection === 'bikes' || catalogSection === 'bikes-menu') {
            if (catalogSection === 'bikes') {
                setCatalogSection('bikes-menu');
            } else {
                setCatalogSection('menu');
            }
            setSelectedCategoryId(null);
        } else if (catalogSection === 'accessories' || catalogSection === 'accessories-menu') {
            if (catalogSection === 'accessories') {
                setCatalogSection('accessories-menu');
            } else {
                setCatalogSection('menu');
            }
            setSelectedAccessoryCategory('all');
            setSelectedAccessory(null);
        } else {
            goHome();
        }
    };

    const isListingView = catalogSection === 'ebikes' || catalogSection === 'bikes' || catalogSection === 'accessories';

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
                            onClick={() => {
                                setShowCatalog(true);
                                setCatalogSection('menu');
                            }}
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
                    <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 border border-white/10 px-6 py-4 rounded-full backdrop-blur-md">
                        <svg width="40" height="40" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        <span className="text-3xl font-bold uppercase tracking-widest">
                            {catalogSection === 'menu' ? 'Inicio' : 'Atrás'}
                        </span>
                    </button>
                    
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
                        <img src={raymonLogo} alt="Raymon" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                        <div className="w-px h-10 bg-white/20" />
                        <img src={proomtbLogo} alt="ProoMTB" className="h-10 md:h-14 w-auto object-contain" />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-500 text-2xl tracking-widest uppercase font-black italic">Catálogo</p>
                        <p className="text-white text-5xl font-black mt-1 uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            {catalogSection === 'menu' && 'SECCIONES'}
                            {(catalogSection === 'ebikes-menu' || catalogSection === 'ebikes') && 'E-BIKES'}
                            {(catalogSection === 'bikes-menu' || catalogSection === 'bikes') && 'BICICLETAS'}
                            {(catalogSection === 'accessories-menu' || catalogSection === 'accessories') && 'ACCESORIOS'}
                        </p>
                    </div>
                </div>

                {/* Horizontal Scroll Filter Bar (only if on a listing view) */}
                {isListingView && (
                    <div className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x px-8 pb-6 flex space-x-6 items-center min-h-[120px] mt-4">
                        {catalogSection === 'accessories' ? (
                            <>
                                <button
                                    onClick={() => setSelectedAccessoryCategory('all')}
                                    className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedAccessoryCategory === 'all'
                                        ? 'bg-white text-black border-white scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)]'
                                        : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                                        }`}
                                >
                                    TODOS
                                </button>
                                {accessoryCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedAccessoryCategory(cat)}
                                        className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedAccessoryCategory === cat
                                            ? 'bg-purple-600 text-white border-purple-500 scale-105 shadow-[0_10px_40px_rgba(147,51,234,0.3)]'
                                            : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSelectedCategoryId(null)}
                                    className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedCategoryId === null
                                        ? 'bg-white text-black border-white scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)]'
                                        : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                                        }`}
                                >
                                    TODOS
                                </button>
                                {bikeCategoriesOptions.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                        className={`snap-center shrink-0 px-12 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center min-w-[220px] ${selectedCategoryId === cat.id
                                            ? 'bg-purple-600 text-white border-purple-500 scale-105 shadow-[0_10px_40px_rgba(147,51,234,0.3)]'
                                            : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                                            } `}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Tap indicator */}
            {isListingView && (
                <div className="bg-white/5 backdrop-blur-sm py-4 flex items-center justify-center border-b border-white/5 shrink-0 z-10">
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-lg flex items-center">
                        <svg className="w-6 h-6 mr-4 animate-bounce text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                        {catalogSection === 'accessories' ? 'Selecciona un accesorio' : 'Selecciona un modelo'}
                    </p>
                </div>
            )}

            {/* Main Content Area */}
            {catalogSection === 'menu' ? (
                /* --- MAIN MENU INTERFACE (LEVEL 1) --- */
                <div className="flex-grow flex flex-col justify-center items-center px-16 relative z-10 gap-16">
                    <div className="text-center max-w-4xl space-y-6">
                        <h2 className="text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Explorar Catálogo
                        </h2>
                        <p className="text-zinc-400 text-2xl lg:text-3xl font-medium max-w-2xl mx-auto">
                            Selecciona una categoría para comenzar a explorar nuestro equipamiento y modelos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-12 w-full max-w-4xl">
                        {/* Option 1: E-BIKES */}
                        <div
                            onClick={() => {
                                setCatalogSection('ebikes-menu');
                                setSelectedCategoryId(null);
                            }}
                            className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                            <div className="flex items-center gap-10 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                    <Zap size={48} className="animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight">E-Bikes</span>
                                    <span className="text-zinc-400 text-xl font-medium mt-1">Rendimiento eléctrico sin límites</span>
                                </div>
                            </div>
                            <svg className="w-12 h-12 text-zinc-500 group-hover:text-white group-hover:translate-x-3 transition-all relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>

                        {/* Option 2: BICICLETAS */}
                        <div
                            onClick={() => {
                                setCatalogSection('bikes-menu');
                                setSelectedCategoryId(null);
                            }}
                            className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                            <div className="flex items-center gap-10 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Bike size={48} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight">Bicicletas</span>
                                    <span className="text-zinc-400 text-xl font-medium mt-1">Modelos musculares de alto rendimiento</span>
                                </div>
                            </div>
                            <svg className="w-12 h-12 text-zinc-500 group-hover:text-white group-hover:translate-x-3 transition-all relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>

                        {/* Option 3: ACCESORIOS */}
                        <div
                            onClick={() => {
                                setCatalogSection('accessories-menu');
                                setSelectedAccessoryCategory('all');
                            }}
                            className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                            <div className="flex items-center gap-10 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shadow-xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <ShoppingBag size={48} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight">Accesorios</span>
                                    <span className="text-zinc-400 text-xl font-medium mt-1">Equipamiento y complementos premium</span>
                                </div>
                            </div>
                            <svg className="w-12 h-12 text-zinc-500 group-hover:text-white group-hover:translate-x-3 transition-all relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            ) : catalogSection === 'ebikes-menu' ? (
                /* --- E-BIKES SUB-MENU (LEVEL 2) --- */
                <div className="flex-grow flex flex-col justify-center items-center px-16 relative z-10 gap-16">
                    <div className="text-center max-w-4xl space-y-6">
                        <h2 className="text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Categorías E-Bike
                        </h2>
                        <p className="text-zinc-400 text-2xl lg:text-3xl font-medium max-w-2xl mx-auto">
                            Elige una subcategoría de bicicletas eléctricas.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
                        {ebikeCategories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategoryId(cat.id);
                                    setCatalogSection('ebikes');
                                }}
                                className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl h-64"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                                <span className="text-4xl font-black text-white uppercase italic tracking-tight">{cat.label}</span>
                                <span className="text-zinc-400 text-lg font-medium mt-2">{cat.desc}</span>
                            </div>
                        ))}
                        <div
                            onClick={() => {
                                setSelectedCategoryId(null);
                                setCatalogSection('ebikes');
                            }}
                            className="col-span-2 bg-purple-600/15 backdrop-blur-2xl rounded-[3rem] p-8 border border-purple-500/30 flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all hover:bg-purple-600 hover:border-purple-500 group relative overflow-hidden shadow-2xl h-32"
                        >
                            <span className="text-3xl font-black text-white uppercase tracking-[0.2em]">VER TODOS LOS MODELOS E-BIKE</span>
                        </div>
                    </div>
                </div>
            ) : catalogSection === 'bikes-menu' ? (
                /* --- NORMAL BIKES SUB-MENU (LEVEL 2) --- */
                <div className="flex-grow flex flex-col justify-center items-center px-16 relative z-10 gap-16">
                    <div className="text-center max-w-4xl space-y-6">
                        <h2 className="text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Categorías Bicicletas
                        </h2>
                        <p className="text-zinc-400 text-2xl lg:text-3xl font-medium max-w-2xl mx-auto">
                            Elige una subcategoría de bicicletas tradicionales.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
                        {normalCategories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategoryId(cat.id);
                                    setCatalogSection('bikes');
                                }}
                                className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl h-64"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                                <span className="text-4xl font-black text-white uppercase italic tracking-tight">{cat.label}</span>
                                <span className="text-zinc-400 text-lg font-medium mt-2">{cat.desc}</span>
                            </div>
                        ))}
                        <div
                            onClick={() => {
                                setSelectedCategoryId(null);
                                setCatalogSection('bikes');
                            }}
                            className="col-span-2 bg-blue-600/15 backdrop-blur-2xl rounded-[3rem] p-8 border border-blue-500/30 flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all hover:bg-blue-600 hover:border-blue-500 group relative overflow-hidden shadow-2xl h-32"
                        >
                            <span className="text-3xl font-black text-white uppercase tracking-[0.2em]">VER TODOS LOS MODELOS</span>
                        </div>
                    </div>
                </div>
            ) : catalogSection === 'accessories-menu' ? (
                /* --- ACCESSORIES CATEGORIES SUB-MENU (LEVEL 2) --- */
                <div className="flex-grow flex flex-col justify-center items-center px-16 relative z-10 gap-16">
                    <div className="text-center max-w-4xl space-y-6">
                        <h2 className="text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Categorías Accesorios
                        </h2>
                        <p className="text-zinc-400 text-2xl lg:text-3xl font-medium max-w-2xl mx-auto">
                            Elige una subcategoría de equipamiento.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
                        {accessoryCategories.map((cat) => (
                            <div
                                key={cat}
                                onClick={() => {
                                    setSelectedAccessoryCategory(cat);
                                    setCatalogSection('accessories');
                                }}
                                className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] transition-all hover:bg-white/[0.06] hover:border-white/10 group relative overflow-hidden shadow-2xl h-64"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-zinc-600/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                                <span className="text-4xl font-black text-white uppercase italic tracking-tight">{cat}</span>
                                <span className="text-zinc-400 text-lg font-medium mt-2">Explorar {cat.toLowerCase()}</span>
                            </div>
                        ))}
                        <div
                            onClick={() => {
                                setSelectedAccessoryCategory('all');
                                setCatalogSection('accessories');
                            }}
                            className="col-span-2 bg-white/10 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/20 flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all hover:bg-white hover:text-black group relative overflow-hidden shadow-2xl h-32"
                        >
                            <span className="text-3xl font-black text-white uppercase tracking-[0.2em] group-hover:text-black transition-colors">VER TODOS LOS ACCESORIOS</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- SECTION CATALOG LISTINGS (LEVEL 3) --- */
                <div className="flex-1 overflow-y-auto p-12 lg:p-16 filter pb-48 no-scrollbar relative z-10" ref={scrollContainerRef}>
                    {catalogSection === 'accessories' ? (
                        /* ACCESORIOS CONTENT */
                        filteredAccessories.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-12">
                                <svg className="w-40 h-40 text-white/10 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                                <h3 className="text-5xl font-black text-white/20 uppercase tracking-tighter italic">No hay accesorios disponibles</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                                <div className="grid grid-cols-2 gap-12 lg:gap-16 w-full">
                                    {displayedAccessories.map(acc => (
                                        <div
                                            key={acc.id}
                                            onClick={() => setSelectedAccessory(acc)}
                                            className="bg-white/[0.03] backdrop-blur-2xl rounded-[4rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col cursor-pointer active:scale-95 transition-all border border-white/5 h-full relative group overflow-hidden hover:bg-white/[0.06] hover:border-white/10"
                                        >
                                            {/* Glow intensity effect */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            {/* Price Tag */}
                                            <div className="absolute top-8 right-8 bg-white text-black px-8 py-4 rounded-full text-3xl font-black z-10 shadow-2xl italic tracking-tighter">
                                                {formatPrice(acc.price, 'accessories')}
                                            </div>

                                            {/* Image Container */}
                                            <div className="aspect-[16/10] w-full flex items-center justify-center mb-12 bg-white/[0.02] rounded-[3rem] p-10 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                {acc.image_url ? (
                                                    <img
                                                        src={acc.image_url}
                                                        alt={acc.name}
                                                        className="w-[90%] h-[90%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700 mix-blend-lighten"
                                                    />
                                                ) : (
                                                    <div className="text-white/10 font-black tracking-widest uppercase text-3xl italic">SIN IMAGEN</div>
                                                )}
                                            </div>

                                            {/* Card Content */}
                                            <div className="flex flex-col justify-end flex-1 relative z-10">
                                                <div className="flex flex-col mb-8">
                                                    <span className="text-purple-400 text-xl font-black uppercase tracking-[0.3em] mb-2">{acc.category}</span>
                                                    <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                                        {acc.name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                                    <div className="text-2xl text-zinc-400 font-black uppercase tracking-widest flex items-center group-hover:text-white transition-colors">
                                                        Ver Detalle
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

                                {/* Load More Accessories */}
                                {filteredAccessories.length > displayedAccessories.length && (
                                    <button
                                        onClick={handleLoadMore}
                                        className="mt-24 bg-white text-black px-20 py-8 rounded-full text-4xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center"
                                    >
                                        <svg className="w-10 h-10 mr-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                        Cargar Más
                                    </button>
                                )}
                            </div>
                        )
                    ) : (
                        /* BIKES (E-BIKES & BICICLETAS) CONTENT */
                        filteredProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-12">
                                <svg className="w-40 h-40 text-white/10 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                                <h3 className="text-5xl font-black text-white/20 uppercase tracking-tighter italic">No hay modelos disponibles</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
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
                                                {formatPrice(product.precio_eur, 'bikes', product.serie_id)}
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

                                {/* Load More Bikes */}
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
                        )
                    )}
                </div>
            )}

            {/* --- PREMIUM DETAILS MODAL FOR ACCESSORIES --- */}
            {selectedAccessory && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-50 flex items-center justify-center p-16 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-5xl bg-zinc-900/95 border border-white/10 rounded-[4.5rem] p-16 flex flex-col md:flex-row gap-16 overflow-hidden shadow-2xl">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                        
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedAccessory(null)}
                            className="absolute top-10 right-10 w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all z-20 hover:bg-white/10 shadow-2xl"
                        >
                            <X size={44} />
                        </button>

                        {/* Image Column */}
                        <div className="flex-1 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 aspect-[4/3] md:aspect-square relative overflow-hidden">
                            {selectedAccessory.image_url ? (
                                <img
                                    src={selectedAccessory.image_url}
                                    alt={selectedAccessory.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)] mix-blend-lighten scale-105"
                                />
                            ) : (
                                <div className="text-white/20 font-black uppercase text-3xl italic">SIN IMAGEN</div>
                            )}
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 flex flex-col justify-between py-6 relative z-10">
                            <div>
                                <span className="text-purple-400 text-2xl font-black uppercase tracking-[0.3em] mb-4 block">
                                    {selectedAccessory.category}
                                </span>
                                <h2 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none italic mb-8">
                                    {selectedAccessory.name}
                                </h2>
                                <p className="text-zinc-400 text-2xl font-medium leading-relaxed max-h-[350px] overflow-y-auto no-scrollbar pr-4">
                                    {selectedAccessory.description || "Sin descripción disponible."}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 text-xl font-bold uppercase tracking-widest">Precio</span>
                                    <span className="text-5xl font-black text-white italic tracking-tighter mt-1">
                                        {formatPrice(selectedAccessory.price, 'accessories')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedAccessory(null)}
                                    className="bg-white text-black px-16 py-6 rounded-full text-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TotemCatalog;
