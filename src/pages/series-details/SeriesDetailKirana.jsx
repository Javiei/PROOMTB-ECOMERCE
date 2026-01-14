import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils';
import { ChevronLeft, ChevronRight, Activity, Cpu, Circle, Anchor } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const SeriesDetailKirana = () => {
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
                    .eq('serie_id', 13); // Kirana ID

                if (error) throw error;
                setBikes(data || []);

            } catch (error) {
                console.error('Error fetching Kirana bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    const currentBike = bikes[activeIndex] || bikes[0];

    // Road bike specific specs
    const specs = currentBike ? [
        { label: 'Frame', value: currentBike.cuadro_material || 'Carbon', icon: Circle },
        { label: 'Drivetrain', value: currentBike.transmision_modelo || 'Shimano 105', icon: Cpu },
        { label: 'Wheels', value: currentBike.tamano_rueda || '700c', icon: Activity },
        { label: 'Brakes', value: currentBike.frenos_modelo || 'Hydraulic Disc', icon: Anchor },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section: Image, Carousel, Specs */}
            <div className="relative text-white pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F22%2F6f%2F06%2F1747034579%2FKirana_hero.png&w=1920&q=100"
                        alt="Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-white/60" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-32 text-center mb-8">
                    {/* Breadcrumbs */}
                    <div className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                        Bikes / Series / Kirana
                    </div>

                    {/* Visible Title */}
                    <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tighter text-black drop-shadow-lg">
                        KIRANA
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
                            <div className="text-center text-gray-500">No bikes found for Kirana series.</div>
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
                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(currentBike.precio_eur)}
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

            {/* Marketing Section 1 */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 text-left lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                            Find Harmony - <br />
                            on Wheels.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                Helmet on, clicks on. Get on the Kirana and escape from reality. With the lightweight carbon frame and comfortable Continental 30 mm wide tires, you'll roll smoothly over the asphalt and cover the kilometers in record time.
                            </p>
                            <p>
                                It's your moment of peace and concentration. A time when you are alone with the rhythm of your breathing and the hum of the wind.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image Component */}
                    <div className="relative hidden lg:flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[700px]">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F99%2F39%2F19%2F1747200177%2FRaymon_Kirana_Action_road_1920x1920_1920x1920.png&w=1920&q=75"
                                alt="Kirana Action"
                                className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl relative z-20"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Marketing Section 2 - Build to Last */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24 bg-gray-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-[750px] flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F2b%2F20%2Fa7%2F1747200193%2FRaymon_kirana_action_detail_rahmen_1920x1920.png&w=1920&q=75"
                                alt="Kirana Detail"
                                className="w-full h-auto object-contain rounded-2xl"
                            />
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className="space-y-6 text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                            Raymon Design: Built <br />
                            to Last.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                The Kirana reflects a century of expertise in bicycle design. It combines robust and lightweight construction with timeless style, designed for durability and optimum performance. Trust in quality and precision craftsmanship and look forward to a bike that will accompany you for years to come.
                            </p>
                            <p>
                                The Kirana is therefore the perfect choice for demanding cyclists who don't want to compromise on speed and comfort.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Discover Series Grid */}
            <div className="max-w-[1400px] mx-auto px-4 py-32">
                <h3 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase">
                    Descubre la gama Kirana
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
                                    {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(bike.precio_eur)}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400">
                            Próximamente más modelos Kirana.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SeriesDetailKirana;
