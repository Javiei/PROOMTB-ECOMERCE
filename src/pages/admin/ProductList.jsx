import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERIES_CONFIG } from '../../config/menuConfig';
import { formatPrice } from '../../utils';

const ProductList = ({ type }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 20;

    // Helper to get Series Name
    const getSeriesName = (id) => {
        if (!id) return 'N/A';
        const series = SERIES_CONFIG[id];
        return series ? series.label : `ID: ${id}`;
    };

    // Data is fetched via the debouncedSearch effect below to handle both initial load and search transitions
    // Resetting states when type or search changes is handled there.

    const fetchProducts = async (currentPage, term = searchTerm) => {
        try {
            if (currentPage === 0) setLoading(true);
            else setLoadingMore(true);

            const tableName = type === 'bikes' ? 'bicicletas' : 'products';
            const from = currentPage * itemsPerPage;
            const to = from + itemsPerPage - 1;

            let query = supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, to);

            // Add server-side search filters
            if (term.trim()) {
                const searchPattern = `%${term.trim()}%`;
                if (type === 'bikes') {
                    query = query.ilike('modelo', searchPattern);
                } else {
                    query = query.ilike('name', searchPattern);
                }
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                if (currentPage === 0) {
                    setProducts(data);
                } else {
                    setProducts(prev => [...prev, ...data]);
                }
                setHasMore(data.length === itemsPerPage);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setProducts([]);
            setPage(0);
            setHasMore(true);
            fetchProducts(0, searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, type]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, searchTerm);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const tableName = type === 'bikes' ? 'bicicletas' : 'products';
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    // if (loading) return <div>Loading products...</div>; // Remove this line

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                    {type === 'bikes' ? 'Bicycles' : type === 'accessories' ? 'Accessories' : 'All Products'} ({products.length}{hasMore ? '+' : ''})
                </h2>
                <Link
                    to={`/admin/${type === 'bikes' ? 'bikes' : 'accessories'}/new`}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2 w-fit"
                >
                    <Plus size={18} />
                    Add {type === 'bikes' ? 'Bike' : 'Product'}
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name / Model</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                            <span className="text-sm text-gray-400 font-medium uppercase tracking-widest">Cargando productos...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-gray-400 uppercase text-xs font-bold tracking-widest">
                                        No se encontraron productos
                                    </td>
                                </tr>
                            )}
                            {!loading && products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 w-20">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg p-1">
                                            <img
                                                src={product.imagenes_urls?.[0] || product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-sm">{product.name || product.modelo}</div>
                                        <div className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{product.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {product.serie_id ? getSeriesName(product.serie_id) : (product.category_id || 'N/A')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-sm">
                                        <div className="flex flex-col">
                                            <span>{formatPrice(product.precio_eur || product.price, type)}</span>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <span className="text-[10px] text-gray-400 font-normal uppercase">
                                                    +{product.sizes.length} variants
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/${type === 'bikes' ? 'bikes' : 'accessories'}/edit/${product.id}`}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {hasMore && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="bg-white border border-gray-200 text-black px-8 py-2 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loadingMore ? 'Cargando...' : 'Cargar más'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
