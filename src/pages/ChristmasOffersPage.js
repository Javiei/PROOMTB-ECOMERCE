import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import { createSlug } from '../utils/stringUtils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, Filter, Gift, Heart, ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 12;

const ChristmasOffersPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { user } = useAuth();

  // Filtros
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const list = (data || []).map(bike => ({
          id: bike.codigo || `bike-${Math.random().toString(36).substr(2, 9)}`,
          codigo: bike.codigo,
          name: bike.nombre || 'Bicicleta sin nombre',
          description: bike.descripcion || 'Oferta especial de Navidad',
          price: parseFloat(bike.precio || 0),
          old_price: parseFloat((bike.precio * 1.2).toFixed(2)),
          image_url: bike.imagen_url || 'https://via.placeholder.com/300x300?text=Sin+imagen',
          images: bike.imagen_url ? [{ url: bike.imagen_url }] : [],
          brand: bike.marca || 'Sin marca',
          model: bike.modelo || 'Esp. Navidad',
          category: bike.categoria || 'bicicletas',
          stock: bike.disponible ? 10 : 0,
          created_at: bike.created_at || new Date().toISOString(),
          is_christmas_offer: true,
          ...bike
        }));

        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error('Error al cargar ofertas navideñas:', err);
        setError('Hubo un problema al cargar las ofertas. Por favor revisa tu conexión.');
        toast.error('Error al cargar las ofertas');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateDisplayedProducts = (list, count) => {
    try {
      const productsToShow = list.slice(0, count);
      setDisplayedProducts(productsToShow);
      setHasMore(count < list.length);
    } catch (e) {
      console.error("Error updating displayed products", e);
    }
  };

  const loadMore = () => {
    const newVisible = visibleCount + ITEMS_PER_PAGE;
    setVisibleCount(newVisible);
    updateDisplayedProducts(filteredProducts, newVisible);
  };

  useEffect(() => {
    try {
      setVisibleCount(ITEMS_PER_PAGE);
      if (brandFilter) setSearchTerm(brandFilter);
    } catch (e) {
      console.error("Error in filter effect", e);
    }
  }, [category, searchTerm, priceRange, brandFilter]);

  // Aplicar filtros
  useEffect(() => {
    try {
      let result = [...products];
      if (brandFilter) {
        result = result.filter(p => p.brand?.toLowerCase() === brandFilter.toLowerCase());
      }
      if (category !== 'all') {
        result = result.filter((p) => p.category === category);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (p) =>
            (p.name || '').toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term) ||
            (p.model || '').toLowerCase().includes(term)
        );
      }
      result = result.filter((p) => Number(p.price || 0) <= Number(priceRange || 0));

      setFilteredProducts(result);
      updateDisplayedProducts(result, Math.min(visibleCount, result.length));
    } catch (e) {
      console.error("Error applying filters", e);
    }
  }, [products, category, searchTerm, priceRange, visibleCount, brandFilter]);

  // Helpers
  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(Number(price || 0));
    } catch {
      return '$0';
    }
  };

  const maxPrice = products.length ? Math.max(...products.map((p) => Number(p.price || 0)), 100000) : 100000;
  const minCandidates = products.map((p) => Number(p.price || 0)).filter((n) => Number.isFinite(n) && n > 0);
  const minPrice = minCandidates.length ? Math.min(...minCandidates) : 0;

  useEffect(() => {
    if (products.length > 0 && priceRange === 100000) setPriceRange(maxPrice);
  }, [products, maxPrice, priceRange]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({ ...product, quantity: 1, selectedSize: null });
    toast.success('¡Añadido al carrito!');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Recargar página</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      <Toaster position="bottom-right" />
      <Header />

      {/* Christmas Hero */}
      <div className="relative h-[40vh] bg-red-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="animate-bounce mb-4 text-green-300">
            <Gift size={64} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter animate-fade-in-up text-white drop-shadow-md">
            OFERTAS NAVIDEÑAS
          </h1>
          <p className="text-xl md:text-2xl text-red-100 max-w-2xl animate-fade-in-up delay-100 font-light drop-shadow">
            Regala aventura y diversión al mejor precio esta Navidad
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-red-600">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filtros Navideños</h3>
              </div>

              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Buscar ofertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categorías</h4>
                  {/* Simplified Categories for Christmas */}
                  <div className="space-y-2">
                    {['all', 'bicicletas', 'accesorios'].map(c => (
                      <label key={c} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={c}
                          checked={category === c}
                          onChange={() => setCategory(c)}
                          className="hidden"
                        />
                        <div className={`w-3 h-3 rounded-full border border-slate-300 mr-2 flex items-center justify-center ${category === c ? 'border-red-500 bg-red-500' : 'group-hover:border-red-400'}`}>
                          {category === c && <div className="w-1 h-1 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm capitalize ${category === c ? 'text-red-600 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{c === 'all' ? 'Todas' : c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-2 block">Precio Máximo</label>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2 font-bold font-sans">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(priceRange)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCategory('all');
                    setPriceRange(maxPrice);
                    setSearchTerm('');
                  }}
                  className="w-full py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
              <p>Encontradas <span className="font-bold text-red-600">{filteredProducts.length}</span> súper ofertas</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => <div key={n} className="h-96 bg-white rounded-2xl animate-pulse shadow-sm" />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => {
                    const hasDiscount = product.old_price && product.old_price > product.price;
                    const discountPct = hasDiscount ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
                    const isOutOfStock = product.stock <= 0;

                    return (
                      <Link
                        key={product.id}
                        to={`/navidad/${product.codigo || product.id}/${createSlug(product.name)}`}
                        state={{ product: product }}
                        className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 block h-full flex flex-col ${isOutOfStock ? 'opacity-75 grayscale' : ''}`}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                          <img
                            src={product.image_url || 'https://via.placeholder.com/300x300?text=Sin+imagen'}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagen'; }}
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {isOutOfStock && <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase">Agotado</span>}
                            {hasDiscount && <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase shadow-sm">-{discountPct}% Navidad</span>}
                          </div>

                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white shadow-md rounded-full text-red-500 hover:bg-red-50 transition-colors">
                              <Heart size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">
                              {product.brand || 'Oferta'}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2">{product.name}</h3>

                          <div className="flex items-center justify-between mt-auto pt-4">
                            <div className="flex flex-col">
                              {hasDiscount && <span className="text-xs text-slate-400 line-through">{formatPrice(product.old_price)}</span>}
                              <span className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</span>
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={isOutOfStock}
                              className={`p-3 rounded-xl transition-colors ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20'}`}
                            >
                              <ShoppingCart size={20} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <button onClick={loadMore} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30 active:scale-95">
                      Ver más ofertas
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Gift size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron ofertas</h3>
                <p className="text-slate-500">Intenta buscar otro producto navideño.</p>
                <button
                  onClick={() => {
                    setCategory('all');
                    setPriceRange(maxPrice);
                    setSearchTerm('');
                  }}
                  className="mt-6 text-red-600 font-bold hover:underline"
                >
                  Ver todas las ofertas
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default ChristmasOffersPage;