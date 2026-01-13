import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERIES_CONFIG } from '../../config/menuConfig';

const ProductList = ({ type }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to get Series Name
    const getSeriesName = (id) => {
        if (!id) return 'N/A';
        const series = SERIES_CONFIG[id];
        return series ? series.label : `ID: ${id}`;
    };

    useEffect(() => {
        fetchProducts();
    }, [type]);

    const fetchProducts = async () => {
        try {
            const tableName = type === 'bikes' ? 'bicicletas' : 'products';

            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
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

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.modelo?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                    {type === 'bikes' ? 'Bicycles' : type === 'accessories' ? 'Accessories' : 'All Products'} ({filteredProducts.length})
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
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
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
                            {filteredProducts.map((product) => (
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
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.precio_eur || product.price)}
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
            </div>
        </div>
    );
};

export default ProductList;
