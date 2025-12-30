import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import LegalFooter from './LegalFooter';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import { FaWhatsapp, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { FiShare2, FiShield, FiTruck } from 'react-icons/fi';
import ProductMetaTags from './ProductMetaTags';
import Header from './Header';
import { Toaster, toast } from 'react-hot-toast';

// ===================== SLUG ===================== //
const createSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
export { createSlug };

const ProductDetail = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Tallas predeterminadas
  const defaultBikeSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);
  const defaultClothingSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);

  // URL limpia
  useEffect(() => {
    if (product?.name) {
      const newSlug = createSlug(product.name);
      const expected = `/producto/${newSlug}`;
      const current = window.location.pathname;
      if (current !== expected) window.history.replaceState(null, '', expected);
    }
  }, [product]);

  // =============== FETCH PRODUCT =============== //
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);
        let data = null;

        if (productName) {
          const searchQuery = productName
            .replace(/-/g, ' ')
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

          let { data: exactMatch, error: exactError } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${searchQuery}%`)
            .single();

          if (exactError || !exactMatch) {
            const keywords = searchQuery.split(' ').filter(k => k.length > 2);
            const firstKeyword = keywords[0] || searchQuery;
            const { data: products, error: searchError } = await supabase
              .from('products')
              .select('*')
              .ilike('name', `%${firstKeyword}%`);

            const filteredProducts = products ? products.filter(product =>
              keywords.every(keyword =>
                product.name?.toLowerCase().includes(keyword.toLowerCase())
              )
            ) : [];
            if (searchError) throw searchError;
            if (products?.length) {
              const sorted = products
                .map(p => ({
                  ...p,
                  _matchScore: keywords.filter(k => p.name?.toLowerCase().includes(k.toLowerCase())).length,
                }))
                .sort((a, b) => b._matchScore - a._matchScore);
              data = sorted[0];
            }
          } else {
            data = exactMatch;
          }
        }

        if (!data) {
          setProduct(null);
          return;
        }

        if (data.images && typeof data.images === 'string') {
          try { data.processedImages = JSON.parse(data.images); }
          catch { data.processedImages = [data.image_url || data.image || '']; }
        } else if (Array.isArray(data.images)) {
          data.processedImages = data.images;
        } else {
          data.processedImages = [data.image_url || data.image || ''];
        }

        if (data.colors && typeof data.colors === 'string') {
          try { data.colors = JSON.parse(data.colors); } catch { data.colors = []; }
        }
        if (data.sizes && typeof data.sizes === 'string') {
          try { data.sizes = JSON.parse(data.sizes); } catch { data.sizes = []; }
        }

        if ((!Array.isArray(data.sizes) || data.sizes.length === 0) &&
          (data.category === 'Bicicletas' || data.category === 'Ropa' || data.category === 'Accesorios')) {
          data.sizes = (data.category === 'Bicicletas') ? [...defaultBikeSizes] : [...defaultClothingSizes];
        }

        if (Array.isArray(data.colors) && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (Array.isArray(data.sizes) && data.sizes.length > 0) setSelectedSize(data.sizes[0]);

        setProduct(data);

        if (data.category) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', data.id)
            .limit(4);

          if (relatedData) {
            const processedRelated = relatedData.map(item => {
              const r = { ...item };
              if (item.images && typeof item.images === 'string') {
                try { r.processedImages = JSON.parse(item.images); }
                catch { r.processedImages = [item.image_url || item.image || '']; }
              } else if (Array.isArray(item.images)) {
                r.processedImages = item.images;
              } else {
                r.processedImages = [item.image_url || item.image || ''];
              }
              return r;
            });
            setRelatedProducts(processedRelated);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('No se pudo cargar el producto. Por favor, inténtalo de nuevo más tarde.');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productName, defaultBikeSizes, defaultClothingSizes]);

  const images = useMemo(() => {
    if (!product) return [];
    const arr = product.processedImages || [];
    return arr.map(x => (typeof x === 'string' ? { url: x } : x));
  }, [product]);

  const handleAddToCart = (e) => {
    e?.preventDefault?.();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (product) {
      if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
        toast.error('Por favor selecciona una talla');
        return;
      }
      if (Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) {
        toast.error('Por favor selecciona un color');
        return;
      }

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || product.image || images[0]?.url || '',
        processedImages: product.processedImages,
        quantity,
        selectedColor,
        selectedSize,
      });
      toast.success('¡Añadido al carrito!');
    }
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Echa un vistazo a ${product?.name} en PROOMTB`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('¡Enlace copiado al portapapeles!');
      }
    } catch (e) {
      console.error('Share error', e);
    }
  };

  const formatDOP = (price) => new Intl.NumberFormat('es-DO', {
    style: 'currency', currency: 'DOP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(price || 0);

  const mainImage = images[selectedImage]?.url || product?.image_url || 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
  const isNew = product?.created_at && (new Date() - new Date(product.created_at)) < (30 * 24 * 60 * 60 * 1000);
  const oldPrice = product?.old_price || product?.compare_at_price || null;
  const hasDiscount = oldPrice && product?.price && oldPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0;
  const stock = typeof product?.stock_quantity === 'number' ? product.stock_quantity : (typeof product?.stock === 'number' ? product.stock : 10);
  const isOutOfStock = stock <= 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product || notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
          <p className="text-slate-500 mb-6">El producto que buscas no está disponible actualmente.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Volver</button>
            <button onClick={() => navigate('/tienda')} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Ir a la Tienda</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <ProductMetaTags product={product} />
      <Toaster position="bottom-right" />
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/tienda" className="hover:text-blue-600 transition-colors">Tienda</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 relative group shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Imagen+no+disponible'; }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isNew && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">Nuevo</span>
                )}
                {hasDiscount && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">-{discountPct}% OFF</span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-200 ring-offset-2' : 'border-slate-200 hover:border-blue-300'}`}
                  >
                    <img src={img.url || img} alt="" className="w-full h-full object-cover p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.category && (
                <Link to={`/tienda?category=${product.category}`} className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100 mb-3 hover:bg-blue-100 transition-colors uppercase tracking-wider">
                  {product.category}
                </Link>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <FiShield className="text-green-600" /> Garantía Oficial
                </span>
                <span className="flex items-center gap-1">
                  <FiTruck className="text-blue-600" /> Envío Nacional
                </span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 mb-8">
              {/* Price Block */}
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl font-bold text-slate-900">{formatDOP(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-slate-400 line-through">{formatDOP(oldPrice)}</span>
                    <span className="text-sm font-bold text-green-600">Ahorras {formatDOP(oldPrice - product.price)}</span>
                  </>
                )}
              </div>

              {/* Selectors */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">Color</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 border-transparent' : 'border-slate-200 hover:border-slate-400'}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className={`w-2 h-2 rounded-full ${['white', 'yellow', 'cream'].includes(color.toLowerCase()) ? 'bg-black' : 'bg-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Talla</span>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Guía de Tallas</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-lg border text-sm font-bold transition-all ${selectedSize === size ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className={isOutOfStock ? 'text-red-600' : 'text-green-700'}>
                    {isOutOfStock ? 'Agotado' : 'Disponible en stock'}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold text-lg"
                      disabled={isOutOfStock || quantity <= 1}
                    >-</button>
                    <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold text-lg"
                      disabled={isOutOfStock || quantity >= stock}
                    >+</button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart />
                    {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
                  </button>

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'}`}
                  >
                    <FaHeart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>

                <a
                  href={`https://wa.me/18297163555?text=${encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name}\n\n${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-50 text-green-600 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={20} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none text-slate-600">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Descripción</h3>
              <div className="whitespace-pre-line leading-relaxed">
                {product.description || 'No hay descripción disponible para este producto.'}
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={onShare}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
              >
                <FiShare2 /> Compartir este producto
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">También te podría interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link to={`/producto/${createSlug(rp.name)}`} key={rp.id} className="group block h-full">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                      <img
                        src={rp.image_url || rp.processedImages?.[0] || rp.image || 'https://via.placeholder.com/300'}
                        alt={rp.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible'; }}
                      />
                    </div>
                    <div className="mt-auto">
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 md:h-12 group-hover:text-blue-600 transition-colors">{rp.name}</h3>
                      <p className="text-slate-500 text-sm mb-2 capitalize">{rp.category}</p>
                      <p className="text-xl font-bold text-slate-900">{formatDOP(rp.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
      <LegalFooter />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthModalOpen(false);
          handleAddToCart({ preventDefault: () => { } });
        }}
      />
    </div>
  );
};

export default ProductDetail;
