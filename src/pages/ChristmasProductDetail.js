import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { createSlug } from '../utils/stringUtils';
import { FaWhatsapp, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { FiShare2, FiShield, FiTruck } from 'react-icons/fi';
import ProductMetaTags from '../components/ProductMetaTags';
import { Toaster, toast } from 'react-hot-toast';

const ChristmasProductDetail = () => {
  const { id, productName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      try {
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .eq('categoria', product.category)
          .neq('codigo', product.id)
          .limit(4);
        if (!error && data) {
          setRelatedProducts(data.map(item => ({
            ...item,
            id: item.codigo,
            name: item.nombre,
            price: parseFloat(item.precio || 0),
            old_price: parseFloat((item.precio * 1.2).toFixed(2)),
            image_url: item.imagen_url,
            stock: item.disponible ? 10 : 0
          })));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRelated();
  }, [product]);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .eq('codigo', id)
          .single();

        if (error) throw error;
        if (data) {
          setProduct({
            ...data,
            id: data.codigo,
            name: data.nombre,
            description: data.descripcion,
            price: parseFloat(data.precio || 0),
            old_price: parseFloat((data.precio * 1.2).toFixed(2)),
            image_url: data.imagen_url,
            images: data.imagen_url ? [{ url: data.imagen_url }] : [],
            brand: data.marca || 'Oferta Navidad',
            model: data.modelo,
            category: data.categoria || 'bicicletas',
            stock: data.disponible ? 10 : 0,
            created_at: data.created_at
          });
        } else {
          navigate('/ofertas-navidad');
        }
      } catch (err) {
        console.error(err);
        navigate('/ofertas-navidad');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity,
        selectedSize: null,
        is_christmas_offer: true
      });
      toast.success('¡Añadido al carrito!');
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(p || 0);

  const onShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div></div>;
  if (!product) return null;

  const hasDiscount = product.old_price > product.price;
  const discountPct = hasDiscount ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      <ProductMetaTags product={product} />
      <Toaster position="bottom-right" />
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <nav className="flex items-center text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-red-600 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/ofertas-navidad" className="hover:text-red-600 transition-colors">Ofertas Navidad</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 relative group shadow-sm">
              <img
                src={product.image_url || 'https://via.placeholder.com/600x600'}
                alt={product.name}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/600x600'; }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase shadow-md">-{discountPct}% Navidad</span>}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-bold border border-red-100 mb-3 uppercase tracking-wider">Oferta Navideña</span>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><FiShield className="text-green-600" /> Garantía Oficial</span>
                <span className="flex items-center gap-1"><FiTruck className="text-blue-600" /> Envío Rápido</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 mb-8">
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl font-bold font-mono text-slate-900">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-slate-400 line-through font-mono">{formatPrice(product.old_price)}</span>
                    <span className="text-sm font-bold text-green-600">Ahorras {formatPrice(product.old_price - product.price)}</span>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold text-lg" disabled={isOutOfStock}>-</button>
                    <span className="w-8 text-center font-mono font-bold text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold text-lg" disabled={isOutOfStock}>+</button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20'}`}
                  >
                    <FaShoppingCart />
                    {isOutOfStock ? 'Agotado' : 'Comprar Ahora'}
                  </button>

                  <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'}`}>
                    <FaHeart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>

                <a href={`https://wa.me/18297163555?text=${encodeURIComponent(`Hola, me interesa la oferta navideña: ${product.name}`)}`} target="_blank" rel="noreferrer" className="w-full py-3 bg-green-50 text-green-600 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                  <FaWhatsapp size={20} /> Consultar por WhatsApp
                </a>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Descripción</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Más Ofertas Navideñas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link to={`/navidad/${rp.id}/${createSlug(rp.name)}`} key={rp.id} className="group block h-full">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden">
                      <img src={rp.image_url} alt={rp.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="mt-auto">
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-red-600">{rp.name}</h3>
                      <p className="text-xl font-mono font-bold text-slate-900">{formatPrice(rp.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default ChristmasProductDetail;
