import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const eBikeTabs = [
    { id: 'e-mtb', label: 'E-MTB' },
    { id: 'e-gravel', label: 'E-Gravel' },
    { id: 'e-trekking', label: 'E-Trekking' },
    { id: 'e-city', label: 'E-City' },
];

const bikeTabs = [
    { id: 'road', label: 'Road' },
    { id: 'gravel', label: 'Gravel' },
    { id: 'mtb', label: 'MTB' },
    { id: 'trekking', label: 'Trekking' },
    { id: 'kids', label: 'Kids' },
];

const categoryMap = {
    'e-mtb': 1,
    'e-gravel': 2,
    'e-trekking': 3,
    'e-city': 4,
    'road': 5,
    'gravel': 6,
    'mtb': 7,
    'trekking': 8,
    'kids': 9
};

const JourneySection = () => {
    const [mainCategory, setMainCategory] = useState('ebikes'); // 'ebikes' or 'bikes'
    const [activeTab, setActiveTab] = useState('e-mtb');
    const [products, setProducts] = useState([]); // Currently displayed products (filtered)
    const [allSeries, setAllSeries] = useState([]);
    const [allBikes, setAllBikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeProductIndex, setActiveProductIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch Series
                const { data: seriesData, error: seriesError } = await supabase
                    .from('series')
                    .select('id, categoria_id');

                if (seriesError) throw seriesError;
                setAllSeries(seriesData || []);

                // Fetch Bikes
                const { data: bikesData, error: bikesError } = await supabase
                    .from('bicicletas')
                    .select('*');

                if (bikesError) throw bikesError;
                setAllBikes(bikesData || []);

            } catch (error) {
                console.error('Error fetching journey data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Filter products when activeTab or data changes
    useEffect(() => {
        if (!allSeries.length || !allBikes.length) return;

        const targetCatId = categoryMap[activeTab];

        // 1. Find series IDs for this category
        const relevantSeriesIds = allSeries
            .filter(s => s.categoria_id === targetCatId)
            .map(s => s.id);

        if (relevantSeriesIds.length === 0) {
            setProducts([]);
            return;
        }

        // 2. Find representative bike for each series
        const bestBySeries = {};

        allBikes.forEach(bike => {
            if (relevantSeriesIds.includes(bike.serie_id)) {
                const existing = bestBySeries[bike.serie_id];
                const hasImg = bike.imagenes_urls && bike.imagenes_urls.length > 0;

                // Pick if no existing, or current has image and existing doesn't
                if (!existing || (hasImg && (!existing.imagenes_urls || existing.imagenes_urls.length === 0))) {
                    bestBySeries[bike.serie_id] = bike;
                }
            }
        });

        // 3. Convert to array and sort
        const filtered = Object.values(bestBySeries)
            .sort((a, b) => a.serie_id - b.serie_id)
            .map(item => ({
                id: item.id,
                name: item.modelo,
                price: item.precio_eur,
                image_url: item.imagenes_urls && item.imagenes_urls.length > 0 ? item.imagenes_urls[0] : null,
                serie_id: item.serie_id
            }));

        setProducts(filtered);
        setActiveProductIndex(0); // Reset slide position on tab change
        if (swiperInstance) {
            swiperInstance.slideTo(0);
        }

    }, [activeTab, allSeries, allBikes, swiperInstance]);

    const currentTabs = mainCategory === 'ebikes' ? eBikeTabs : bikeTabs;

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const handleMainCategoryClick = (cat) => {
        setMainCategory(cat);
        setActiveTab(cat === 'ebikes' ? 'e-mtb' : 'road');
    };

    return (
        <section className="py-12 lg:py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-12 lg:px-16">

                {/* Header */}
                <div className="mb-8 lg:mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
                        ¿Cuál es tu estilo?
                    </h2>
                    <p className="text-gray-500 max-w-3xl text-sm lg:text-lg">
                        Descubre un nuevo mundo con cada bicicleta. Ya sea en rutas suaves o paisajes urbanos, cada bicicleta conquista tu camino contigo.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Category Promos */}
                    <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-8">
                        {/* E-Bikes Card */}
                        <div
                            onClick={() => handleMainCategoryClick('ebikes')}
                            className={`relative h-[140px] lg:h-[300px] rounded-tl-2xl rounded-br-2xl lg:rounded-tl-[3rem] lg:rounded-br-[3rem] overflow-hidden group cursor-pointer transition-all duration-500 ${mainCategory === 'ebikes' ? 'ring-2 lg:ring-4 ring-black ring-offset-2 lg:ring-offset-4' : 'opacity-80 hover:opacity-100'}`}
                        >
                            <img src="https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Assetes%20web%20page/Raymon-2024-nauders-1715.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL0Fzc2V0ZXMgd2ViIHBhZ2UvUmF5bW9uLTIwMjQtbmF1ZGVycy0xNzE1LmpwZyIsImlhdCI6MTc2NzgxODIxNCwiZXhwIjo4ODE2NzczMTgxNH0.qXVLCoToq3ypqNG5ATndnfpsr--7kP4rwLSV8vSm5C8" alt="E-Bikes" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                            <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
                                <h3 className="text-xl lg:text-3xl font-black text-white uppercase italic tracking-tight">E-Bikes</h3>
                            </div>
                        </div>

                        {/* Bikes Card */}
                        <div
                            onClick={() => handleMainCategoryClick('bikes')}
                            className={`relative h-[140px] lg:h-[300px] rounded-tl-lg rounded-br-lg rounded-tr-2xl rounded-bl-2xl lg:rounded-tr-[3rem] lg:rounded-bl-[3rem] overflow-hidden group cursor-pointer transition-all duration-500 ${mainCategory === 'bikes' ? 'ring-2 lg:ring-4 ring-black ring-offset-2 lg:ring-offset-4' : 'opacity-80 hover:opacity-100'}`}
                        >
                            <img src="https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Assetes%20web%20page/Raymon-2024-nauders-1874.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL0Fzc2V0ZXMgd2ViIHBhZ2UvUmF5bW9uLTIwMjQtbmF1ZGVycy0xODc0LmpwZyIsImlhdCI6MTc2NzgxODQ3MywiZXhwIjo4ODE2NzczMjA3M30.Xux1DNkIGQuR-4kWxK9GzmurZ4-Pxs8BiPgLjqsOi_A" alt="Bikes" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                            <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
                                <h3 className="text-xl lg:text-3xl font-black text-white uppercase italic tracking-tight">Bicicletas</h3>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tabs & Product Display */}
                    <div className="lg:col-span-8 bg-gray-50 rounded-2xl p-8 lg:p-12">

                        {/* Tabs */}
                        <div className="flex flex-col mb-4">
                            {/* Segmented Control Tabs */}
                            <div className="flex p-1 bg-gray-100/80 rounded-xl overflow-x-auto scrollbar-hide">
                                {currentTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-[#222] text-white shadow-low'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            {/* Controls */}
                            <div className="hidden sm:flex space-x-2 absolute top-0 right-0"> {/* Adjusted position if needed, keeping hidden for now on mobile based on prev code */}
                            </div>
                        </div>

                        <div className="relative min-h-[350px] flex flex-col justify-between">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 relative overflow-hidden h-[250px] lg:h-[450px]">
                                        {products.length > 0 ? (
                                            <Swiper
                                                key={activeTab}
                                                modules={[Navigation, Pagination, EffectCoverflow]}
                                                effect={'coverflow'}
                                                grabCursor={true}
                                                centeredSlides={true}
                                                slidesPerView={'auto'}
                                                coverflowEffect={{
                                                    rotate: 0,
                                                    stretch: 0,
                                                    depth: 100,
                                                    modifier: 2.5,
                                                    slideShadows: false,
                                                }}
                                                loop={products.length > 2}
                                                onSwiper={setSwiperInstance}
                                                onSlideChange={(swiper) => setActiveProductIndex(swiper.realIndex)}
                                                className="h-full w-full"
                                            >
                                                {products.map((product) => (
                                                    <SwiperSlide key={product.id} className="!w-[85%] h-full flex items-end justify-center">
                                                        {({ isActive }) => (
                                                            <div className={`w-full h-full px-2 sm:px-8 transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 blur-[1px]'}`}>
                                                                {/* Product Info & Image Container */}
                                                                <Link
                                                                    to={
                                                                        product.serie_id === 1 ? '/series/ravor' :
                                                                            product.serie_id === 2 ? '/series/vantor' :
                                                                                product.serie_id === 3 ? '/series/trailray' :
                                                                                    product.serie_id === 4 ? '/series/hardray' :
                                                                                        product.serie_id === 5 ? '/series/vamok' :
                                                                                            product.serie_id === 6 ? '/series/korak' :
                                                                                                product.serie_id === 7 ? '/series/airok' :
                                                                                                    product.serie_id === 8 ? '/series/norza' :
                                                                                                        product.serie_id === 9 ? '/series/tavano' :
                                                                                                            product.serie_id === 10 ? '/series/tahona' :
                                                                                                                product.serie_id === 11 ? '/series/metmo' :
                                                                                                                    product.serie_id === 12 ? '/series/arva' :
                                                                                                                        product.serie_id === 13 ? '/series/kirana' :
                                                                                                                            product.serie_id === 14 ? '/series/soreno' :
                                                                                                                                product.serie_id === 15 ? '/series/territ' :
                                                                                                                                    product.serie_id === 16 ? '/series/zayn' :
                                                                                                                                        product.serie_id === 17 ? '/series/rokua' :
                                                                                                                                            product.serie_id === 18 ? '/series/yara' :
                                                                                                                                                product.serie_id === 19 ? '/series/arid' :
                                                                                                                                                    product.serie_id === 20 ? '/series/nayta' :
                                                                                                                                                        `/serie/${product.serie_id}`
                                                                    }
                                                                    className="block group w-full h-full flex flex-col justify-end"
                                                                >
                                                                    {/* Image */}
                                                                    <div className="flex-1 flex items-center justify-center mb-2 relative">
                                                                        <img
                                                                            src={product.image_url}
                                                                            alt={product.name}
                                                                            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                                                            loading="eager"
                                                                        />
                                                                    </div>

                                                                    {/* Info */}
                                                                    <div className="mt-1 pl-1 pb-2">
                                                                        <div className="flex items-center gap-1 mb-0.5">
                                                                            <h3 className="text-base sm:text-lg font-bold text-black tracking-tight uppercase">
                                                                                {product.name}
                                                                            </h3>
                                                                            <svg className="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 font-medium">
                                                                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(product.price)}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                <p>No hay productos disponibles.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Controls */}
                                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-4 gap-4 md:gap-0">
                                        {/* Left: View All Button */}
                                        <Link to={`/category/${activeTab}`} className="w-full md:w-auto block text-center px-8 py-3 bg-gray-100 hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase tracking-widest rounded-xl">
                                            Alle {activeTab.toUpperCase()}
                                        </Link>

                                        {/* Right: Navigation */}
                                        <div className="flex items-center gap-8">
                                            {/* Dots */}
                                            <div className="flex gap-3">
                                                {products.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => swiperInstance?.slideToLoop(idx)}
                                                        className={`w-2 h-2 rounded-full transition-all ${idx === activeProductIndex ? 'bg-black w-2' : 'bg-gray-300 hover:bg-gray-400'}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Arrows */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => swiperInstance?.slidePrev()}
                                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => swiperInstance?.slideNext()}
                                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
