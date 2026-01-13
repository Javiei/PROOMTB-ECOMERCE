import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Accessories = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 21; // 3 columns * 7 rows

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        try {
            setLoading(true);

            // Fetch all products from 'products' table as requested
            const { data, error } = await supabase
                .from('products')
                .select('*');

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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Helper to truncate text
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Section */}
            <div className="pt-24 pb-12 text-center">
                <h1 className="text-3xl md:text-4xl text-gray-400 font-medium">
                    Descubre todos los <span className="text-black font-black">Accesorios</span>
                </h1>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-16">
                {/* Toolbar */}
                <div className="flex justify-end items-center mb-8 text-sm text-gray-500 space-x-6 border-b border-gray-100 pb-4">
                    <span>{products.length} Accesorios</span>
                    <div className="flex items-center space-x-2">
                        <button className="hover:text-black"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
                        <button className="hover:text-black"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-black">
                        <span className="mr-2">Ordenar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No se encontraron accesorios.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {currentProducts.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                                    {/* Product Image */}
                                    <div className="bg-gray-50/50 rounded-lg p-8 mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                                        <div className="aspect-[4/3] flex items-center justify-center">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-gray-300 text-xs uppercase">Sin Imagen</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic text-gray-900">RAYMON</p>
                                        <h3 className="text-lg font-black uppercase tracking-tight text-gray-900" title={product.name}>
                                            {truncateText(product.name, 25)}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-900">
                                            {product.price} €
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-20">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-500 hover:text-black disabled:text-gray-300"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
                                </button>
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-500 hover:text-black disabled:text-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${currentPage === number
                                            ? 'bg-gray-100 text-black font-bold'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-500 hover:text-black disabled:text-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-500 hover:text-black disabled:text-gray-300"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" /></svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Accessories;
