import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { slugify, formatPrice } from '../../utils';
import { ChevronLeft, ChevronRight, Zap, Battery, Activity, ArrowUpCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const SeriesDetailMetmo = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const { data, error } = await supabase
                    .from('bicicletas')
                    .select('*')
                    .eq('serie_id', 11); // Metmo ID

                if (error) throw error;
                setBikes(data || []);

            } catch (error) {
                console.error('Error fetching Metmo bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    const currentBike = bikes[activeIndex] || bikes[0];

    const specs = currentBike ? [
        { label: 'Travel', value: currentBike.horquilla || 'N/A', icon: ArrowUpCircle },
        { label: 'Wheel Size', value: currentBike.tamano_rueda || '27.5"', icon: Activity },
        { label: 'Motor', value: currentBike.motor_modelo || 'Yamaha PW-CE', icon: Zap },
        { label: 'Battery', value: `${currentBike.bateria_wh || 500}Wh`, icon: Battery },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section: Image, Carousel, Specs */}
            <div className="relative text-white pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F30%2Fc5%2F9f%2F1747034561%2FMetmo_hero.png&w=1920&q=100"
                        alt="Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-white/40" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-32 text-center mb-8">
                    {/* Breadcrumbs */}
                    <div className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                        Bikes / Series / Metmo
                    </div>

                    {/* Visible Title */}
                    <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tighter text-black drop-shadow-lg">
                        METMO
                    </h1>
                </div>

                {/* 3D Carousel Section - Full Width */}
                <div className="w-full relative z-10 mb-12">
                    <div className="relative h-[400px] md:h-[700px] flex items-center justify-center">
                        {bikes.length > 0 ? (
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                loop={false}
                                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                onSwiper={setSwiperInstance}
                                modules={[EffectCoverflow, Navigation]}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                    slideShadows: false,
                                }}
                                className="w-full h-full"
                            >
                                {bikes.map((bike, index) => (
                                    <SwiperSlide key={slugify(bike.modelo)} className={`!w-[85vw] md:!w-[1000px] !h-full flex items-center justify-center transition-all duration-700 ${index === activeIndex ? 'scale-125 opacity-100 z-10' : 'scale-90 opacity-40 blur-[2px]'}`}>
                                        {({ isActive }) => (
                                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                                <Link to={`/product/${slugify(bike.modelo)}`} className="relative group block w-full">
                                                    <div className="relative aspect-[16/10] mb-8">
                                                        <img
                                                            src={bike.imagenes_urls?.[0]}
                                                            alt={bike.modelo}
                                                            className="w-full h-full object-contain drop-shadow-2xl"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500">No bikes found for Metmo series.</div>
                        )}
                    </div>
                </div>

                {/* Centered Model Name & Price */}
                {currentBike && (
                    <div className="relative w-full text-center z-20 pointer-events-none mb-12">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black drop-shadow-lg">
                            {currentBike.modelo}
                        </h2>
                        <p className="text-lg text-gray-600 font-medium">
                            {formatPrice(currentBike.precio_eur, 'bikes')}
                        </p>
                    </div>
                )}

                {/* Specs Bar with Navigation Buttons */}
                <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-20 hidden md:block">
                    <div className="flex items-center gap-4 md:gap-8 justify-center">
                        <button
                            onClick={() => swiperInstance?.slidePrev()}
                            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!swiperInstance || swiperInstance.isBeginning}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 bg-white shadow-xl rounded-tl-[2rem] rounded-br-[2rem] px-4 md:px-8 text-black max-w-4xl mx-auto">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="text-center">
                                    <spec.icon className="w-6 h-6 mx-auto mb-2 text-gray-800" />
                                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">{spec.label}</div>
                                    <div className="text-base md:text-lg font-bold text-black max-w-full truncate px-1" title={spec.value}>{spec.value}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => swiperInstance?.slideNext()}
                            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!swiperInstance || swiperInstance.isEnd}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Marketing Section */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 text-left lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                            Comfort and freedom<br />
                            on every kilometer.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                The birds are chirping and you roll calmly and enjoyably to the market on your Metmo. The low frame allows you to get off easily and safely and push it through the stalls. Your basket is quickly filled with goodies and you look forward to the journey home because your Metmo makes the ride so easy.
                            </p>
                            <p>
                                Whether for everyday use or on vacation: with the Metmo, every ride becomes a discovery tour that makes you smile.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image Component with Background Card */}
                    <div className="relative hidden lg:flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[700px]">


                            {/* The Bike Image */}
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2Ff6%2F0d%2F1719930712%2FRaymon_metmo_citybike_city_highlight.png&w=1920&q=75"
                                alt="Metmo Bike"
                                className="w-full h-auto object-contain drop-shadow-xl relative z-20"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Second Marketing Section - Quality of Life */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-[750px] flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F31%2F38%2F55%2F1724842838%2FMetmo_Rcklicht.png&w=1920&q=75"
                                alt="Metmo Detail"
                                className="w-[600px] h-auto object-contain "
                            />
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className="space-y-6 text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                            Designed for quality<br />
                            of life.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                With over 100 years of family history, we know that everyone has different needs. We have developed the Metmo for everyone who wants to cover distances that are too long on foot with comfort and ease.
                            </p>
                            <p>
                                Metmo will be a faithful companion for years to come, allowing you to experience freedom in a whole new way.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Discover Series Grid */}
            <div className="max-w-[1400px] mx-auto px-4 py-32">
                <h3 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase">
                    Descubre la gama Metmo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bikes.length > 0 ? (
                        bikes.map((bike) => (
                            <Link to={`/product/${slugify(bike.modelo)}`} key={slugify(bike.modelo)} className="group block text-center" onClick={() => window.scrollTo(0, 0)}>
                                <div className="bg-gray-50 rounded-3xl p-8 mb-6 relative aspect-[4/3] flex items-center justify-center transition-colors group-hover:bg-gray-100">
                                    <img
                                        src={bike.imagenes_urls?.[0]}
                                        alt={bike.modelo}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="text-xl font-black uppercase mb-2">{bike.modelo}</h4>
                                <p className="text-gray-500 font-medium text-lg">
                                    {formatPrice(bike.precio_eur, 'bikes')}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400">
                            Próximamente más modelos Metmo.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SeriesDetailMetmo;
