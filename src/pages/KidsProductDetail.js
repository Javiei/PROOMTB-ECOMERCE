import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, ShoppingCart, Truck, Shield, Check, Ruler } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast, Toaster } from 'react-hot-toast';

const KidsProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        fetchBikeDetail();
    }, [id]);

    const fetchBikeDetail = async () => {
        try {
            const { data, error } = await supabase
                .from('bikes_kids')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setBike(data);
            // Default to first size if available
            if (data.sizes && data.sizes.length > 0) {
                setSelectedSize(data.sizes[0]);
            }
        } catch (error) {
            console.error('Error fetching bike detail:', error);
            toast.error('Error al cargar la bicicleta');
            navigate('/kids');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!bike || !selectedSize) return;

        const cartItem = {
            id: `${bike.id}-${selectedSize.code}`, // Unique ID for cart based on variant
            name: `${bike.name} (${selectedSize.size})`,
            price: selectedSize.price,
            image: bike.image_url,
            originalBikeId: bike.id,
            selectedSize: selectedSize
        };

        addToCart(cartItem);
        toast.success(`Añadido al carrito: ${selectedSize.size}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!bike) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
            <Toaster position="bottom-right" />
            <Header />

            <main className="container mx-auto px-4 py-12">
                <button
                    onClick={() => navigate('/kids')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Kids
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 relative group shadow-sm">
                            <img
                                src={bike.image_url ? (!bike.image_url.startsWith('http') ? `/images/bikes_kids/${bike.image_url}` : bike.image_url) : 'https://via.placeholder.com/600x600?text=No+Image'}
                                alt={bike.name}
                                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found'; }}
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-bold border border-blue-200 mb-4">
                                PROOMTB KIDS
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{bike.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Shield size={16} className="text-green-600" />
                                    Garantía PROO
                                </span>
                                <span className="flex items-center gap-1">
                                    <Truck size={16} className="text-blue-600" />
                                    Envío Disponible
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            {/* Size Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Ruler size={16} /> Selecciona el Tamaño
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {bike.sizes && bike.sizes.map((sizeOption, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(sizeOption)}
                                            className={`p-3 rounded-xl border text-center transition-all duration-200 ${selectedSize && selectedSize.code === sizeOption.code
                                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-slate-900'
                                                }`}
                                        >
                                            <span className="block font-bold text-lg">{sizeOption.size}</span>
                                            <span className="text-xs opacity-80">{sizeOption.age}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-slate-200" />

                            {/* Price and Action */}
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Precio Online</p>
                                        <div className="text-4xl font-bold font-mono text-slate-900">
                                            RD$ {selectedSize ? selectedSize.price.toLocaleString() : '---'}
                                        </div>
                                    </div>
                                    {selectedSize && (
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500 mb-1">Código</div>
                                            <div className="font-mono text-blue-600">{selectedSize.code}</div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                                >
                                    <ShoppingCart size={24} />
                                    Añadir al Carrito
                                </button>

                                {selectedSize && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 text-center">
                                        Peso aproximado: <span className="font-mono font-bold">{selectedSize.weight}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Descripción</h3>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p>{bike.description}</p>
                                <p className="mt-4"><strong className="text-slate-900">Material Principal:</strong> {bike.material}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default KidsProductDetail;
