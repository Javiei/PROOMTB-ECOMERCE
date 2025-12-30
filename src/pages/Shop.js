import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ALL_CATEGORIES } from '../constants/categories';
import { useAuth } from '../contexts/AuthContext';
import { createSlug } from '../utils/stringUtils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/auth/AuthModal';
import { Filter, Heart, Search } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const list = data || [];
        const shuffled = list.sort(() => 0.5 - Math.random());
        setProducts(shuffled);
        setFilteredProducts(shuffled);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateDisplayedProducts = (list, count) => {
    const productsToShow = list.slice(0, count);
    setDisplayedProducts(productsToShow);
    setHasMore(count < list.length);
  };

  const loadMore = () => {
    const newVisible = visibleCount + ITEMS_PER_PAGE;
    setVisibleCount(newVisible);
    updateDisplayedProducts(filteredProducts, newVisible);
  };

  // Sincronizar URL
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    const currentSearch = searchParams.get('search') || '';
    if (currentSearch !== searchTerm) {
      setSearchTerm(currentSearch);
    }
    if (brandFilter && brandFilter !== searchTerm) {
      setSearchTerm(brandFilter);
    }
  }, [searchParams, brandFilter]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];
    const urlSearchTerm = searchParams.get('search') || '';
    const searchToUse = searchTerm || urlSearchTerm;

    if (searchToUse) {
      const term = searchToUse.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(term) ||
          (p.description || '').toLowerCase().includes(term) ||
          (p.brand || '').toLowerCase().includes(term) ||
          (p.category || '').toLowerCase().includes(term)
      );
    }

    if (brandFilter) {
      result = result.filter(p =>
        p.brand?.toLowerCase() === brandFilter.toLowerCase()
      );
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    result = result.filter((p) => Number(p.price || 0) <= Number(priceRange || 0));

    setFilteredProducts(result);
    updateDisplayedProducts(result, Math.min(visibleCount, result.length));
  }, [products, category, searchTerm, priceRange, visibleCount]);

  // Categorías
  const categories = ALL_CATEGORIES;

  // Helpers
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(price || 0));

  const maxPrice = Math.max(...products.map((p) => Number(p.price || 0)), 100000);
  const minCandidates = products.map((p) => Number(p.price || 0)).filter((n) => Number.isFinite(n) && n > 0);
  const minPrice = minCandidates.length ? Math.min(...minCandidates) : 0;

  useEffect(() => {
    if (products.length > 0 && priceRange === 100000) {
      setPriceRange(maxPrice);
    }
  }, [products, maxPrice, priceRange]);

  const getImageUrl = (product) => {
    let imageUrl = '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
      if (imageUrl && typeof imageUrl === 'object' && imageUrl.url) imageUrl = imageUrl.url;
    } else if (product.image) {
      imageUrl = product.image;
    } else if (product.image_url) {
      imageUrl = product.image_url;
    }
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      // Assume products images are in standard location if relative
      // Or handle generic relative path if it was uploaded to storage
      // For general products, paths might vary. 
      imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#fff', color: '#333' } }} />
      <Header />

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter animate-fade-in-up text-white drop-shadow-md">
            NUESTRA TIENDA
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl animate-fade-in-up delay-100 font-light drop-shadow">
            Equipamiento profesional para tu próxima aventura
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filtros</h3>
              </div>


              {/* Search Input in Sidebar */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categorías</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((item) => (
                      item.group ? (
                        <div key={item.group} className="mb-2">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.group}</h5>
                          <div className="pl-2 space-y-1">
                            {item.options.map((option) => (
                              <label key={option.value} className="flex items-center cursor-pointer group">
                                <input
                                  type="radio"
                                  name="category"
                                  value={option.value}
                                  checked={category === option.value}
                                  onChange={() => setCategory(option.value)}
                                  className="hidden"
                                />
                                <div className={`w-3 h-3 rounded-full border border-slate-300 mr-2 flex items-center justify-center ${category === option.value ? 'border-blue-500 bg-blue-500' : 'group-hover:border-blue-400'}`}>
                                  {category === option.value && <div className="w-1 h-1 bg-white rounded-full" />}
                                </div>
                                <span className={`text-sm ${category === option.value ? 'text-blue-600 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <label key={item.value} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={item.value}
                            checked={category === item.value}
                            onChange={() => setCategory(item.value)}
                            className="hidden"
                          />
                          <div className={`w-3 h-3 rounded-full border border-slate-300 mr-2 flex items-center justify-center ${category === item.value ? 'border-blue-500 bg-blue-500' : 'group-hover:border-blue-400'}`}>
                            {category === item.value && <div className="w-1 h-1 bg-white rounded-full" />}
                          </div>
                          <span className={`text-sm ${category === item.value ? 'text-blue-600 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{item.label}</span>
                        </label>
                      )
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2 font-mono">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(priceRange)}</span>
                  </div>
                </div>

                {/* Clear Filters */}
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
              <p>Mostrando <span className="font-bold text-slate-900">{displayedProducts.length}</span> de <span className="font-bold text-slate-900">{filteredProducts.length}</span> productos</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-96 bg-white rounded-2xl animate-pulse shadow-sm" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => {
                    const imageUrl = getImageUrl(product);
                    const isOutOfStock = product.stock_quantity <= 0;

                    return (
                      <Link
                        to={`/producto/${createSlug(product.name)}`}
                        state={{ product: product }}
                        key={product.id}
                        className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 block h-full flex flex-col ${isOutOfStock ? 'opacity-75 grayscale' : ''}`}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                          <img
                            src={imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {isOutOfStock && (
                              <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Agotado
                              </span>
                            )}
                            {product.old_price > product.price && (
                              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Oferta
                              </span>
                            )}
                          </div>

                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <button className="p-2 bg-white shadow-md rounded-full hover:bg-slate-50 text-slate-900 transition-colors">
                              <Heart size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-200 uppercase tracking-wider">
                              {product.brand || 'General'}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>

                          <div className="flex items-center justify-between mt-auto pt-4">
                            <div className="flex flex-col">
                              {product.old_price > product.price && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatPrice(product.old_price)}
                                </span>
                              )}
                              <span className="text-xl font-bold text-slate-900">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            <button
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {hasMore && displayedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={loadMore}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
                    >
                      Ver más productos
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron productos</h3>
                <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
                <button
                  onClick={() => {
                    setCategory('all');
                    setPriceRange(maxPrice);
                    setSearchTerm('');
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Limpiar todos los filtros
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
        initialTab="login"
      />
    </div>
  );
};

export default Shop;
