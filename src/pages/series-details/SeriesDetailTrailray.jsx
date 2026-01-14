import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils';
import { ChevronLeft, ChevronRight, Zap, Battery, Activity, ArrowUpCircle } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const SeriesDetailTrailray = () => {
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
                    .eq('serie_id', 3); // Trailray ID

                if (error) throw error;
                setBikes(data || []);
            } catch (error) {
                console.error('Error fetching Trailray bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    // Specs Data from DB
    const currentBike = bikes[activeIndex] || bikes[0];
    const specs = currentBike ? [
        { label: 'Travel', value: currentBike.horquilla || '160mm', icon: ArrowUpCircle },
        { label: 'Wheel Size', value: currentBike.tamano_rueda || '29"', icon: Activity },
        { label: 'Motor', value: currentBike.motor_modelo || 'Yamaha', icon: Zap },
        { label: 'Battery', value: `${currentBike.bateria_wh || 630}Wh`, icon: Battery },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section: Image, Carousel, Specs */}
            <div className="relative bg-black text-white pb-32  overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F6d%2F29%2Fg0%2F1749728361%2FVantor_MainHeader.png&w=3840&q=100"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>



                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-32 text-center mb-8">
                    {/* Breadcrumbs */}
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        Bikes / Series / Trailray
                    </div>

                    {/* Visible Title */}
                    <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tighter text-black drop-shadow-lg">
                        TRAILRAY
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
                            <div className="text-center text-gray-400">No bikes found for Trailray series.</div>
                        )}
                    </div>
                </div>

                {/* Centered Model Name & Price - Updates with Active Index */}
                {bikes.length > 0 && bikes[activeIndex] && (
                    <div className="relative w-full text-center z-20 pointer-events-none mb-12">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black drop-shadow-lg">
                            {bikes[activeIndex].modelo}
                        </h2>
                        <p className="text-lg text-gray-700 font-medium">
                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(bikes[activeIndex].precio_eur)}
                        </p>
                    </div>
                )}

                {/* Specs Bar with Navigation Buttons */}
                <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-20 hidden md:block">
                    <div className="flex items-center gap-4 md:gap-8 justify-center">
                        <button
                            onClick={() => swiperInstance?.slidePrev()}
                            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={activeIndex === 0}
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
                            disabled={activeIndex === bikes.length - 1}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Marketing Text Section (White Background) */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-32 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 text-left lg:pr-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                                Unleash your wild side<br />
                                on the trails.
                            </h2>
                        </div>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                Summit view, high above everyday life. The air is clear and you plunge into the descent with your ultra-sensitive suspension. The tires of your mullet wheels grip the ground as you swing through tight bends. You are in rhythm with the trail, your smile wide and wild. Your freedom grows with every meter.
                            </p>
                            <p className="font-bold text-black text-xl">
                                Can you feel it? Every obstacle is an invitation and the end of the trail is just the beginning of your next adventure.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[600px] h-[400px]  rounded-3xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F11%2F46%2Ffc%2F1747376850%2FTrailray180_Ultra_Unleash-your-wild-Side_1920x1920%20(1).png&w=1920&q=75"
                                alt="Trailray Action"
                                className="w-full h-full object-cover mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Marketing Section: Image Left, Text Right */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-[600px] h-[400px] rounded-3xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F0d%2F78%2F8a%2F1747376861%2Fraymon-Trailray180_dmpfer_1920x1920%20(1).png&w=1920&q=75"
                                alt="Trailray Suspension"
                                className="w-full h-full object-cover mix-blend-multiply"
                            />
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className="space-y-6 text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                            Welcome to the<br />
                            wildest Trailray Era.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                Over the last 100 years, we have shaped many cycling moments - including the invention of the e-mountain bike. The latest addition to our Trailray series is now a tribute to the ultimate downhill fun and all aluminum lovers. Every element, from the robust frame design to the large 220mm disc brakes, is optimized to give you the highest performance and safety.
                            </p>
                            <p>
                                This bike is as aggressive as it looks and will defend you from anything that gets in your way.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Third Marketing Section: Yamaha Motor */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 text-left lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                            Yamaha PW-XM:<br />
                            Pushes straight away.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                The Yamaha PW-XM motor takes you over any terrain with a quiet but powerful push. The zero cadence function provides you with sporty support from the very first pedal stroke, and if things do get steeper, you are well equipped with your 800 Wh battery.
                            </p>
                            <p>
                                After your ride, the Smart Charger gives your bike optimum power. It adapts to the charging cycle of your battery, ensures the optimum charging current and thus increases the service life.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[600px] h-[400px] bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F0b%2Fd6%2Fd6%2F1747376871%2Fraymon_trailray180_motor_1920x1920.png&w=1920&q=75"
                                alt="Yamaha PW-XM Motor"
                                className="w-full h-full object-contain mix-blend-multiply p-8"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Discover Series Grid */}
            <div className="max-w-[1400px] mx-auto px-4 pb-32">
                <h3 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase">
                    Descubre la gama Trailray
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bikes.map((bike) => (
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
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SeriesDetailTrailray;
