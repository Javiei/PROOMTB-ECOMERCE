import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, Star, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils';

const Accessories = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name-asc');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const itemsPerPage = viewMode === 'grid' ? 21 : 20;

    const sortOptions = [
        { id: 'name-asc', label: 'Nombre (A-Z)' },
        { id: 'name-desc', label: 'Nombre (Z-A)' },
        { id: 'price-asc', label: 'Precio (ascendente)' },
        { id: 'price-desc', label: 'Precio (descendente)' }
    ];

    useEffect(() => {
        fetchAccessories();
    }, [sortBy]);

    // Reset to first page when view mode changes
    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode]);

    const fetchAccessories = async () => {
        try {
            setLoading(true);

            let query = supabase.from('products').select('*');

            if (sortBy === 'name-asc') query = query.order('name', { ascending: true });
            else if (sortBy === 'name-desc') query = query.order('name', { ascending: false });
            else if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
            else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching accessories:', error);
            } else {
                // Map DB fields to Component fields
                const mappedData = (data || []).map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image_url: item.image_url,
                    category: item.category_id || 'Accessory'
                }));
                setProducts(mappedData);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Helper to truncate text
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="pb-12 text-center">
                <h1 className="text-3xl md:text-5xl text-gray-400 font-medium tracking-tight">
                    Descubre todos los <span className="text-black font-black">Accesorios</span>
                </h1>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-16">
                {/* Toolbar */}
                <div className="flex justify-end items-center mb-12 text-sm text-gray-500 space-x-8 border-b border-gray-100 pb-6">
                    <span className="font-medium">{products.length} Accesorios</span>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1 transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1 transition-colors ${viewMode === 'list' ? 'text-black' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-200"></div>

                    <div className="relative">
                        <div
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center cursor-pointer hover:text-black transition-colors font-medium"
                        >
                            <span className="mr-2">Ordenar por</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isSortOpen && (
                            <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortBy(option.id);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm transition-colors hover:bg-gray-50 ${sortBy === option.id ? 'text-black font-bold' : 'text-gray-500'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Listing */}
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No se encontraron accesorios.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {currentProducts.map((product) => (
                            <Link to={`/product/${slugify(product.name)}`} key={product.id} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                {/* Card Container */}
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-10 mb-6 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 flex items-center justify-center aspect-[4/3]">
                                    <div className="w-full h-full flex items-center justify-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="text-gray-300 text-xs uppercase font-bold tracking-widest">No Image</div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="px-4 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest italic text-gray-900">RAYMON</p>
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black leading-none" title={product.name}>
                                        {truncateText(product.name, 35)}
                                    </h3>
                                    <p className="text-lg font-bold text-black">
                                        {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(product.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-6">
                        {currentProducts.map((product) => (
                            <Link
                                to={`/product/${slugify(product.name)}`}
                                key={product.id}
                                className="group block bg-white border border-gray-100 rounded-3xl p-8 transition-all duration-500 shadow-sm hover:shadow-lg"
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    {/* Left: Image */}
                                    <div className="w-full md:w-1/4 aspect-[4/3] flex items-center justify-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="text-gray-300 text-xs uppercase font-bold tracking-widest">No Image</div>
                                        )}
                                    </div>

                                    {/* Middle: Brand & Model */}
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic text-gray-900">RAYMON</p>
                                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black leading-none italic">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Right: Price & Arrow */}
                                    <div className="flex items-center gap-8">
                                        <p className="text-2xl font-black text-black">
                                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(product.price)}
                                        </p>
                                        <div className="hidden md:flex w-12 h-12 rounded-full border border-gray-100 items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-20 border-t border-gray-100 pt-12">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-3 text-gray-500 hover:text-black disabled:text-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-xl transition-all ${currentPage === number
                                    ? 'bg-black text-white'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 text-gray-500 hover:text-black disabled:text-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Accessories;

