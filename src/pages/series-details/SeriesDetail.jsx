import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Battery, Activity, ArrowUpCircle } from 'lucide-react';

const SeriesDetail = () => {
    const { serieId } = useParams();
    const [bikes, setBikes] = useState([]);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Series Info
                const { data: sData } = await supabase
                    .from('series')
                    .select('*')
                    .eq('id', serieId)
                    .single();
                setSeriesInfo(sData);

                // Fetch Bikes
                const { data: bData, error } = await supabase
                    .from('bicicletas')
                    .select('*')
                    .eq('serie_id', serieId);

                if (error) throw error;
                setBikes(bData || []);
            } catch (error) {
                console.error('Error fetching series data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (serieId) fetchData();
    }, [serieId]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? bikes.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === bikes.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    // Specs Data from DB
    const currentBike = bikes[activeIndex];
    const specs = currentBike ? [
        { label: 'Travel', value: currentBike.horquilla || 'Standard', icon: ArrowUpCircle },
        { label: 'Wheel Size', value: currentBike.tamano_rueda || '29"', icon: Activity },
        { label: 'Motor', value: currentBike.motor_modelo || 'Yamaha', icon: Zap },
        { label: 'Battery', value: `${currentBike.bateria_wh || 500}Wh`, icon: Battery },
    ] : [];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Section: Image, Carousel, Specs */}
            <div className="relative bg-black text-white pb-32 rounded-b-[3rem] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ffa%2F85%2Fc2%2F1719225146%2FKyrok_Banner_head.png&w=640&q=75"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                </div>

                {/* Background Text */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 opacity-20 mix-blend-overlay">
                    <h1 className="text-[20vw] font-black text-white leading-none whitespace-nowrap -ml-[10vw]">
                        {seriesInfo?.nombre || 'SERIES'}
                    </h1>
                </div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10 pt-12">

                    {/* Visible Title */}
                    <h1 className="text-6xl md:text-[8rem] font-black text-center leading-none mb-12 tracking-tighter text-white drop-shadow-lg uppercase">
                        {seriesInfo?.nombre || 'PROOMTB'}
                    </h1>

                    {/* 3D Carousel Section */}
                    <div className="relative h-[600px] flex items-center justify-center perspective-1000 mb-24">
                        {bikes.length > 0 ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Navigation */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-0 z-50 p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 z-50 p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Active Bike Display */}
                                <div className="text-center w-full max-w-4xl animate-fade-in-up">
                                    <Link to={`/product/${bikes[activeIndex].id}`} className="block group">
                                        <div className="relative aspect-[16/10] mb-8">
                                            <img
                                                src={bikes[activeIndex].imagenes_urls?.[0]}
                                                alt={bikes[activeIndex].modelo}
                                                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-2 text-white">
                                            {bikes[activeIndex].modelo}
                                        </h2>
                                        <p className="text-xl text-gray-300 font-medium">
                                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(bikes[activeIndex].precio_eur)}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">No bikes found.</div>
                        )}
                    </div>

                    {/* Specs Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/10 backdrop-blur-sm bg-white/5 rounded-2xl mx-4 lg:mx-0">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="text-center">
                                <spec.icon className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">{spec.label}</div>
                                <div className="text-xl font-bold text-white">{spec.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Empty marketing section for generic detail or reuse components if needed
                For generic series detail, we might not have custom marketing text, 
                so we can leave it simple or just not include it if seriesInfo doesn't exist.
            */}
        </div>
    );
};

export default SeriesDetail;
