import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({ bikes: [], accessories: [] });

    // Helper to generate slug
    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-')   // Replace multiple - with single -
            .replace(/^-+/, '')       // Trim - from start of text
            .replace(/-+$/, '');      // Trim - from end of text
    };

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const searchTerm = `%${query.replace(/ /g, '%')}%`;

            const { data: bikes } = await supabase
                .from('bicicletas')
                .select('id, modelo, precio_eur, imagenes_urls')
                .ilike('modelo', searchTerm);

            const { data: accessories } = await supabase
                .from('products')
                .select('id, name, price, image_url')
                .ilike('name', searchTerm);

            setResults({
                bikes: bikes || [],
                accessories: accessories || []
            });
            setLoading(false);
        };

        if (query) {
            fetchResults();
        } else {
            setResults({ bikes: [], accessories: [] });
            setLoading(false);
        }
    }, [query]);

    if (loading) return (
        <div className="min-h-screen pt-32 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pt-32 px-4 md:px-12 bg-white">
            <Helmet>
                <title>Search Results: {query} | PROOMTB</title>
            </Helmet>

            <h1 className="text-3xl font-bold uppercase mb-8">Search Results for "{query}"</h1>

            {results.bikes.length === 0 && results.accessories.length === 0 && (
                <p className="text-gray-500">No results found.</p>
            )}

            {results.bikes.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-xl font-bold uppercase mb-6 border-b pb-2">Bikes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {results.bikes.map(bike => (
                            <Link key={bike.id} to={`/product/${slugify(bike.modelo)}`} className="group block">
                                <div className="relative aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden mb-6">
                                    <img
                                        src={bike.imagenes_urls?.[0]}
                                        alt={bike.modelo}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold uppercase text-sm mb-1">{bike.modelo}</h3>
                                <p className="text-gray-500 text-sm">
                                    {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(bike.precio_eur)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {results.accessories.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-xl font-bold uppercase mb-6 border-b pb-2">Accessories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {results.accessories.map(product => (
                            <Link key={product.id} to={`/product/${slugify(product.name)}`} className="group block">
                                <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold uppercase text-sm mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(product.price)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
