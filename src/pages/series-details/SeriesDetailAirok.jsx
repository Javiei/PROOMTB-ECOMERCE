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

const SeriesDetailAirok = () => {
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
                    .eq('serie_id', 7); // Airok ID

                if (error) throw error;
                setBikes(data || []);
            } catch (error) {
                console.error('Error fetching Airok bikes:', error);
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
        { label: 'Travel', value: currentBike.horquilla || '150mm', icon: ArrowUpCircle },
        { label: 'Wheel Size', value: currentBike.tamano_rueda || '29"', icon: Activity },
        { label: 'Motor', value: currentBike.motor_modelo || 'Yamaha PW-X3', icon: Zap },
        { label: 'Battery', value: `${currentBike.bateria_wh || 630}Wh`, icon: Battery },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section: Image, Carousel, Specs */}
            <div className="relative bg-black text-white pb-32 overflow-hidden">
                {/* Background Image - Placeholder for Airok */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1200&q=100"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/50" />
                </div>



                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-32 text-center mb-8">
                    {/* Breadcrumbs */}
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        Bikes / Series / Airok
                    </div>

                    {/* Visible Title */}
                    <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tighter text-black drop-shadow-lg">
                        AIROK
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
                            <div className="text-center text-gray-400">No bikes found for Airok series.</div>
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
                            {formatPrice(bikes[activeIndex].precio_eur, 'bikes')}
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

            {/* Marketing Section 1 */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-24 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6 text-left lg:pl-4">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                            The new light e-MTB -<br />
                            Ready to float over<br />
                            your trails?
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                Palpitations. Adrenaline. That tingling in your stomach when 29" and 150mm travel carry you over roots and rocks. 17.7 kg of lightness. Every bend is a dance, every obstacle an adventure. You're in the flow and enjoying the trail with a big grin on your face. When you get to the bottom, you think: "Again!"
                            </p>
                            <p className="font-medium text-black">
                                Because Airok gives you that "again" feeling.
                                <br />
                                After every ride.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-start">
                        <div className="relative w-full rounded-3xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ffa%2F85%2Fc2%2F1719225146%2FKyrok_Banner_head.png&w=1920&q=75"
                                alt="Airok Action"
                                className="w-full h-full object-cover mix-blend-multiply scale-105"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Marketing Section 2 */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Image */}
                    <div className="hidden lg:flex justify-center lg:justify-end order-2 lg:order-1">
                        <div className="relative w-full rounded-3xl overflow-hidden flex items-center justify-center">
                            <img
                                src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F68%2Fb9%2F39%2F1719576142%2FRaymon_Kyrok_Highlight_Ehrliche%20Bikes%20-%20No%20Bullshit%20Garantie-Action.png&w=1920&q=75"
                                alt="Airok Guarantee"
                                className="w-full h-full object-cover mix-blend-multiply"
                            />
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className="space-y-6 text-left lg:pl-12 order-1 lg:order-2">
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                            Raymon factor -<br />
                            Honest bikes. No-<br />
                            bullshit guarantee.
                        </h2>

                        <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                            <p>
                                Airok is a promise. A promise of riding pleasure. The experience of over 100 years of bicycle family history has gone into its development. Every detail has been hand-picked and thought through so that you can experience the ultimate riding pleasure. Every day anew.
                            </p>
                            <p>
                                With a carbon frame and 150 mm suspension, Airok is agile and easy to handle, with enough reserves to really blast down the trail.
                            </p>
                            <p className="font-medium text-black italic">
                                "There are countless manufacturers with beautiful light E-MTBs - but it's the little things that make the difference. That's why Airok is uncompromisingly honestly equipped and, at 17.7 kg, also a lightweight."
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Discover Series Grid */}
            <div className="max-w-[1400px] mx-auto px-4 pb-32">
                <h3 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase">
                    Descubre la gama Airok
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
                                {formatPrice(bike.precio_eur, 'bikes')}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SeriesDetailAirok;
