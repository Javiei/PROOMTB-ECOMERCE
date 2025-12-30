import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Info, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast, Toaster } from 'react-hot-toast';

const KidsPage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 20000,
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const { data, error } = await supabase
        .from('bikes_kids')
        .select('*');

      if (error) throw error;
      setBikes(data || []);
    } catch (error) {
      console.error('Error fetching kids bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = (bike) => {
    if (bike.sizes && bike.sizes.length > 0) {
      // Return the lowest price or a range? Let's return the first one or lowest.
      const prices = bike.sizes.map(s => s.price);
      return Math.min(...prices);
    }
    return 0; // Fallback
  };

  const filteredBikes = bikes.filter(bike => {
    const price = getDisplayPrice(bike);
    return price >= filters.minPrice && price <= filters.maxPrice;
  });

  const handleAddToCart = (e, bike) => {
    e.preventDefault();
    // For quick add, we might default to the first size or require them to go to detail.
    // Given size selection is mandatory for price, let's redirect to detail or just add first size.
    // Safer to just let them go to detail page for size selection.
    window.location.href = `/kids/${bike.id}/${encodeURIComponent(bike.name)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
        },
      }} />
      <Header />

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter animate-fade-in-up text-indigo-900 drop-shadow-sm">
            ZONA KIDS
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl animate-fade-in-up delay-100 font-light drop-shadow">
            La mejor aventura sobre ruedas para los pequeños de la casa
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

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-2 block">Precio Máximo</label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2 font-mono">
                    <span>RD$ 0</span>
                    <span>RD$ {filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-96 bg-white rounded-2xl animate-pulse shadow-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBikes.map((bike) => (
                  <Link
                    to={`/kids/${bike.id}/${encodeURIComponent(bike.name)}`}
                    key={bike.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                      {/* Placeholder logic if image_url is missing or simple path */}
                      <img
                        src={bike.image_url ? (!bike.image_url.startsWith('http') ? `/images/bikes_kids/${bike.image_url}` : bike.image_url) : 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={bike.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                      />

                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <button className="p-2 bg-white shadow-md rounded-full hover:bg-slate-50 text-slate-900 transition-colors">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-200">
                          {bike.sizes ? `${bike.sizes.length} Tamaños` : 'Kids'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{bike.name}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{bike.description}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium">Desde</span>
                          <span className="text-xl font-bold font-mono text-slate-900">
                            RD$ {getDisplayPrice(bike).toLocaleString()}
                          </span>
                        </div>
                        <button
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 font-mono group-hover:shadow-lg group-hover:shadow-blue-500/20"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KidsPage;
