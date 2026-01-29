import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { slugify, formatPrice } from '../../utils';
import { ChevronLeft, ChevronRight, Activity, Cpu, Circle, Anchor, Sparkles, Smile, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const SeriesDetailYangaKids = () => {
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
                    .eq('serie_id', 22); // Yanga Kids ID

                if (error) throw error;
                setBikes(data || []);

            } catch (error) {
                console.error('Error fetching Yanga Kids bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-tighter text-2xl">Loading Yanga Kids...</div>;

    const currentBike = bikes[activeIndex] || bikes[0];

    // Specialized specs for Kids
    const specs = currentBike ? [
        { label: 'Talla Rueda', value: currentBike.tamano_rueda || '20"', icon: Activity },
        { label: 'Estilo', value: 'MTB Hardtail', icon: Star },
        { label: 'Control', value: 'Frenos V-Brake', icon: Anchor },
        { label: 'Diversión', value: '100%', icon: Smile },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section */}
            <div className="relative text-white pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2Fb1%2Fb3%2F1747034724%2FRokua_hero.png&w=1920&q=100"
                        alt="Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-white/40" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-32 text-center mb-8">
                    <div className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                        Kids / Series / Yanga Kids
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tighter text-black drop-shadow-lg uppercase">
                        YANGA KIDS
                    </h1>
                </div>

                <div className="w-full relative z-10 mb-12">
                    <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
                        {bikes.length > 0 ? (
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
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
                                {bikes.map((bike) => (
                                    <SwiperSlide key={slugify(bike.modelo)} className={`!w-[85vw] md:!w-[800px] !h-full flex items-center justify-center transition-all duration-700 ${bikes.indexOf(bike) === activeIndex ? 'scale-110 opacity-100 z-10' : 'scale-75 opacity-40 blur-[1px]'}`}>
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
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500 font-bold uppercase tracking-widest">No hay modelos disponibles para Yanga Kids aún.</div>
                        )}
                    </div>
                </div>

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

                <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-20 hidden md:block">
                    <div className="flex items-center gap-4 md:gap-8 justify-center">
                        <button
                            onClick={() => swiperInstance?.slidePrev()}
                            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 bg-white shadow-xl rounded-tl-[2rem] rounded-br-[2rem] px-4 md:px-8 text-black max-w-4xl mx-auto">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="text-center">
                                    <spec.icon className="w-6 h-6 mx-auto mb-2 text-gray-800" />
                                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">{spec.label}</div>
                                    <div className="text-base md:text-lg font-bold text-black max-w-full truncate px-1">{spec.value}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => swiperInstance?.slideNext()}
                            className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Marketing Section */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 text-left lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                            El inicio de <br />
                            una gran pasión.
                        </h2>
                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                La Yanga Kids es la bicicleta ideal para que los niños se sientan como profesionales desde su primera pedalada. Resistente, divertida y fácil de manejar.
                            </p>
                            <p>
                                Diseñada para resistir el trato duro y ofrecer la mejor estabilidad en cualquier camino.
                            </p>
                        </div>
                    </div>
                    <div className="relative hidden lg:flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[700px]">
                            <img
                                src="https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Assetes%20web%20page/Raymon-2024-nauders-1874.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL0Fzc2V0ZXMgd2ViIHBhZ2UvUmF5bW9uLTIwMjQtbmF1ZGVycy0xODc0LmpwZyIsImlhdCI6MTc2NzgxODQ3MywiZXhwIjo4ODE2NzczMjA3M30.Xux1DNkIGQuR-4kWxK9GzmurZ4-Pxs8BiPgLjqsOi_A"
                                alt="Yanga Kids Adventure"
                                className="w-full h-auto object-cover rounded-2xl relative z-20 shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Range Grid */}
            <div className="max-w-[1400px] mx-auto px-4 py-32">
                <h3 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase italic tracking-tighter">
                    Gama Yanga Kids
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bikes.map((bike) => (
                        <Link to={`/product/${slugify(bike.modelo)}`} key={slugify(bike.modelo)} className="group block text-center" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-gray-50 rounded-3xl p-8 mb-6 relative aspect-[4/3] flex items-center justify-center transition-colors group-hover:bg-gray-100">
                                <img src={bike.imagenes_urls?.[0]} alt={bike.modelo} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="text-xl font-black uppercase mb-2">{bike.modelo}</h4>
                            <p className="text-gray-500 font-medium text-lg">
                                {formatPrice(bike.precio_eur, 'bikes')}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SeriesDetailYangaKids;
