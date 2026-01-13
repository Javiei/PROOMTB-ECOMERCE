import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2 } from 'lucide-react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ bikes: [], accessories: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            // Search Bikes
            const { data: bikes, error: bikesError } = await supabase
                .from('bicicletas')
                .select('*')
                .or(`modelo.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(20);

            if (bikesError) throw bikesError;

            // Search Accessories
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(20);

            if (productsError) throw productsError;

            setResults({
                bikes: bikes || [],
                accessories: products || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <Loader2 className="animate-spin text-black" size={48} />
            </div>
        );
    }

    const hasResults = results.bikes.length > 0 || results.accessories.length > 0;

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">
                    Search Results: <span className="text-gray-400">"{query}"</span>
                </h1>

                {!hasResults ? (
                    <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
                        No products found relative to your search.
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Bikes Results */}
                        {results.bikes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-4">
                                    Bikes <span className="bg-black text-white px-3 py-1 rounded-full text-xs">{results.bikes.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {results.bikes.map(bike => (
                                        <Link key={bike.id} to={`/product/${bike.id}?type=bike`} className="group block">
                                            <div className="relative aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden mb-6">
                                                <img
                                                    src={bike.imagenes_urls?.[0]}
                                                    alt={bike.modelo}
                                                    className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-6 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                                                {bike.modelo}
                                            </h3>
                                            <p className="text-gray-500 font-bold">
                                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(bike.precio_eur)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Accessories Results */}
                        {results.accessories.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-4">
                                    Accessories <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-xs">{results.accessories.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {results.accessories.map(product => (
                                        <Link key={product.id} to={`/product/${product.id}?type=accessory`} className="group block">
                                            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-6 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-500 font-bold">
                                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
