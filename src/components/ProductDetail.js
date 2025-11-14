import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import LegalFooter from './LegalFooter';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import { FaWhatsapp, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import ProductMetaTags from './ProductMetaTags';

// ===================== SLUG ===================== //
const createSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
export { createSlug };

// ===================== STYLE TOKENS (estilo "Christmas") ===================== //
const STYLE = {
  pageWrapper: 'min-h-screen bg-gray-50',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  inner: 'bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden',
  grid: 'lg:grid lg:grid-cols-2 lg:gap-8 p-6',
  mainImgWrap: 'relative bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center',
  mainImg: 'w-full h-full object-contain p-4',
  thumbsGrid: 'grid grid-cols-4 gap-3 mt-4',
  thumbBtn: 'relative h-20 rounded-md overflow-hidden border-2 transition-all',
  thumbActive: 'border-blue-500 ring-2 ring-blue-200 scale-105',
  thumbIdle: 'border-gray-200 hover:border-gray-300',
  title: 'text-3xl font-bold text-gray-900 mb-2',
  brand: 'text-sm font-medium text-blue-600 mb-1',
  model: 'text-lg text-gray-600 mb-4',
  shareBtn: 'flex items-center text-sm text-gray-500 hover:text-gray-700',
  priceBox: 'mb-6 p-4 bg-gray-50 rounded-lg',
  priceBig: 'text-4xl font-bold',
  priceRed: 'text-red-600',
  priceNormal: 'text-gray-900',
  strike: 'text-lg text-gray-500 line-through',
  saveText: 'ml-2 text-sm text-gray-500',
  stockRow: 'mt-3 flex items-center',
  stockDotGreen: 'h-2 w-2 rounded-full bg-green-500 mr-2',
  stockDotRed: 'h-2 w-2 rounded-full bg-red-500 inline-block mr-2',
  stockBarWrap: 'w-full bg-gray-200 rounded-full h-2.5',
  stockBar: 'bg-green-500 h-2.5 rounded-full',
  qtyBox: 'flex items-center justify-between bg-gray-50 p-3 rounded-lg',
  qtyStepper: 'flex items-center border border-gray-300 rounded-md',
  qtyBtn: 'px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40',
  qtyNum: 'w-12 text-center',
  ctaPrimary: 'w-full flex items-center justify-center py-4 px-6 rounded-lg font-medium text-white transition-colors',
  ctaEnabled: 'bg-blue-600 hover:bg-blue-700',
  ctaDisabled: 'bg-gray-400 cursor-not-allowed',
  ctaAdded: 'bg-green-600 hover:bg-green-700',
  ctaWhats: 'w-full flex items-center justify-center py-4 px-6 border border-green-500 rounded-lg font-medium text-green-600 hover:bg-green-50 transition-colors',
  sectionTitle: 'text-lg font-medium text-gray-900 mb-3',
  prose: 'prose max-w-none text-gray-600',
};

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Tallas predeterminadas
  const defaultBikeSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);
  const defaultClothingSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);

  // URL limpia como en Christmas
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
            
            // Usar solo la primera palabra clave para la búsqueda inicial
            const firstKeyword = keywords[0] || searchQuery;
            
            // Realizar la consulta simple
            const { data: products, error: searchError } = await supabase
              .from('products')
              .select('*')
              .ilike('name', `%${firstKeyword}%`);
            
            // Filtrar localmente los resultados para incluir más palabras clave
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

        // Procesar imágenes como en base
        if (data.images && typeof data.images === 'string') {
          try { data.processedImages = JSON.parse(data.images); }
          catch { data.processedImages = [data.image_url || data.image || '']; }
        } else if (Array.isArray(data.images)) {
          data.processedImages = data.images;
        } else {
          data.processedImages = [data.image_url || data.image || ''];
        }

        // colors & sizes
        if (data.colors && typeof data.colors === 'string') {
          try { data.colors = JSON.parse(data.colors); } catch { data.colors = []; }
        }
        if (data.sizes && typeof data.sizes === 'string') {
          try { data.sizes = JSON.parse(data.sizes); } catch { data.sizes = []; }
        }

        // Defaults si corresponde
        if ((!Array.isArray(data.sizes) || data.sizes.length === 0) &&
            (data.category === 'Bicicletas' || data.category === 'Ropa' || data.category === 'Accesorios')) {
          data.sizes = (data.category === 'Bicicletas') ? [...defaultBikeSizes] : [...defaultClothingSizes];
        }

        if (Array.isArray(data.colors) && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (Array.isArray(data.sizes) && data.sizes.length > 0) setSelectedSize(data.sizes[0]);

        setProduct(data);

        // Relacionados
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

  // Imágenes normalizadas para UI Christmas
  const images = useMemo(() => {
    if (!product) return [];
    const arr = product.processedImages || [];
    // Acepta strings o objetos {url}
    return arr.map(x => (typeof x === 'string' ? { url: x } : x));
  }, [product]);

  // Handlers
  const handleAddToCart = (e) => {
    e?.preventDefault?.();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (product) {
      // Validación de talla/color si existen
      if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
        alert('Por favor selecciona una talla');
        return;
      }
      if (Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) {
        alert('Por favor selecciona un color');
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
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Echa un vistazo a ${product?.name} en PROOMTB` ,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (e) {
      console.error('Share error', e);
    }
  };

  // Helpers UI
  const formatDOP = (price) => new Intl.NumberFormat('es-DO', {
    style: 'currency', currency: 'DOP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(price || 0);

  // Estado derivado
  const mainImage = images[selectedImage]?.url || product?.image_url || 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
  const isNew = product?.created_at && (new Date() - new Date(product.created_at)) < (30 * 24 * 60 * 60 * 1000);
  const oldPrice = product?.old_price || product?.compare_at_price || null; // opcional si tu schema lo tiene
  const hasDiscount = oldPrice && product?.price && oldPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0;
  const stock = typeof product?.stock === 'number' ? product.stock : null; // si existe en tu schema
  
  // Barra de "en stock" visual (NO conectada a BD) – deriva un porcentaje pseudo-aleatorio por producto
  const pseudoStockPercent = useMemo(() => {
    const s = (product?.id ?? product?.name ?? 'x').toString();
    const sum = Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct = sum % 100; // 0..99
    return Math.max(15, Math.min(95, pct)); // siempre algo visible, 15%..95%
  }, [product?.id, product?.name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product || notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">
            {error || 'El producto que buscas no existe o ha sido eliminado.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver atrás
            </button>
            <button
              onClick={() => navigate('/tienda')}
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver todos los productos
            </button>
          </div>
          {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <p className="font-medium">Error técnico:</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={STYLE.pageWrapper}>
      <ProductMetaTags product={product} />
      <main className="bg-white">
        <div className={`${STYLE.container} py-8`}>
          {/* Breadcrumbs estilo Christmas */}
          <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/tienda" className="text-blue-600 hover:text-blue-800 hover:underline">Tienda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600 truncate max-w-xs md:max-w-md">{product.name}</span>
          </nav>

          <div className={STYLE.inner}>
            <div className={STYLE.grid}>
              {/* Imágenes del producto */}
              <div className="mb-8 lg:mb-0">
                <div className={STYLE.mainImgWrap}>
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={STYLE.mainImg}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
                      e.currentTarget.classList.add('object-cover');
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {isNew && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Nuevo</span>
                    )}
                    {hasDiscount && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">-{discountPct}% OFF</span>
                    )}
                  </div>
                </div>

                {/* Miniaturas */}
                {images.length > 1 && (
                  <div className={STYLE.thumbsGrid}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`${STYLE.thumbBtn} ${selectedImage === idx ? STYLE.thumbActive : STYLE.thumbIdle}`}
                        aria-label={`Vista ${idx + 1}`}
                      >
                        <img
                          src={img.url || img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Imagen'; }}
                        />
                        {selectedImage === idx && <div className="absolute inset-0 bg-blue-500/20" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="lg:pl-8">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      {product.brand && <p className={STYLE.brand}>{product.brand}</p>}
                      <h1 className={STYLE.title}>{product.name}</h1>
                      {product.model && <p className={STYLE.model}>{product.model}</p>}
                    </div>

                    {/* Favorito */}
                    <button
                      onClick={() => setIsFavorite(v => !v)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <FaHeart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mt-2">
                    <button onClick={onShare} className={STYLE.shareBtn}>
                      <FiShare2 className="mr-1" /> Compartir
                    </button>
                  </div>
                </div>

                {/* Precio y stock */}
<div className={STYLE.priceBox}>
  {hasDiscount ? (
    <div className="space-y-2">
      <div className="flex items-baseline">
        <span className={`${STYLE.priceBig} ${STYLE.priceRed}`}>{formatDOP(product.price)}</span>
        <span className="ml-3 px-2 py-1 text-sm font-medium text-white bg-red-600 rounded">
          {discountPct}% OFF
        </span>
      </div>
      <div className="flex items-center">
        <span className={STYLE.strike}>{formatDOP(oldPrice)}</span>
        <span className={STYLE.saveText}>Ahorras {formatDOP(oldPrice - product.price)}</span>
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      <span className={`${STYLE.priceBig} ${STYLE.priceNormal}`}>{formatDOP(product.price)}</span>
    </div>
  )}

  {/* Indicador + barra de disponibilidad estilo Christmas (sin cantidades y sin BD) */}
  {(typeof stock !== 'number' || stock > 0) ? (
    <div className="mt-3">
      <div className="flex items-center mb-2">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2" />
        <span className="text-sm font-medium text-gray-700">En stock</span>
      </div>
      <div className={STYLE.stockBarWrap}>
        <div className={STYLE.stockBar} style={{ width: '90%' }} />
      </div>
    </div>
  ) : (
    <div className="mt-3">
      <div className="flex items-center mb-2">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2" />
        <span className="text-sm font-medium text-red-600">Agotado</span>
      </div>
      <div className={STYLE.stockBarWrap}>
        <div className="h-2.5 rounded-full bg-gray-300 w-full" />
      </div>
    </div>
  )}
</div>


                {/* Descripción corta */}
                {product.description && (
                  <div className="prose max-w-none mb-8">
                    <h3 className={STYLE.sectionTitle}>Descripción</h3>
                    <div className="text-gray-600 whitespace-pre-line">{product.description}</div>
                  </div>
                )}

                {/* Selectores de color/talla si existen */}
                {Array.isArray(product.colors) && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`relative rounded-full p-0.5 ${selectedColor === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                          aria-label={`Color ${color}`}
                        >
                          <span
                            className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center capitalize"
                            style={{ backgroundColor: color?.toLowerCase?.() === 'white' ? '#f9fafb' : color }}
                          >
                            {(color?.toLowerCase?.() === 'white' || color?.toLowerCase?.() === 'black') && (
                              <span className={`text-xs ${color?.toLowerCase?.() === 'black' ? 'text-white' : 'text-black'}`}>{color}</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Talla</h3>
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Guía de tallas</span>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none ${selectedSize === size ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cantidad y CTAs */}
                <div className="mt-6 space-y-4">
                  <div className={STYLE.qtyBox}>
                    <span className="text-gray-700 font-medium">Cantidad:</span>
                    <div className={STYLE.qtyStepper}>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className={STYLE.qtyBtn}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className={STYLE.qtyNum}>{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(10, typeof stock === 'number' ? Math.min(10, stock) : 10, q + 1))}
                        className={STYLE.qtyBtn}
                        disabled={typeof stock === 'number' ? quantity >= Math.min(10, stock) : quantity >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={typeof stock === 'number' ? stock <= 0 : false}
                      className={`${STYLE.ctaPrimary} ${typeof stock === 'number' && stock <= 0 ? STYLE.ctaDisabled : addedToCart ? STYLE.ctaAdded : STYLE.ctaEnabled}`}
                    >
                      <FaShoppingCart className="mr-2" />
                      {addedToCart ? '¡Añadido al carrito!' : (typeof stock === 'number' && stock <= 0 ? 'Agotado' : 'Agregar al carrito')}
                    </button>

                    <a
                      href={`https://wa.me/18297163555?text=${encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name}\n\n${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={STYLE.ctaWhats}
                      aria-label="Contactar por WhatsApp"
                      title="Contáctanos por WhatsApp"
                    >
                      <FaWhatsapp className="mr-2 text-green-500 text-xl" />
                      Consultar por WhatsApp
                    </a>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-2">
                    <p>Envío a todo el país</p>
                  </div>
                </div>

                {/* Descripción extendida */}
                {product.description && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className={STYLE.sectionTitle}>Descripción del producto</h3>
                    <div className={STYLE.prose}>
                      {String(product.description).split('\n').map((p, i) => (
                        <p key={i} className="mb-4">{p}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categoría */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/categoria/${product.category}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      {product.category || 'Sin categoría'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="bg-gray-50 py-12">
            <div className={STYLE.container}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <Link to={`/producto/${createSlug(rp.name)}`} key={rp.id} className="group block">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
                        <img
                          src={rp.image_url || rp.processedImages?.[0] || rp.image || 'https://via.placeholder.com/300'}
                          alt={rp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible'; }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{rp.name}</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 capitalize">{rp.category}</p>
                          <p className="text-lg font-medium text-gray-900">{formatDOP(rp.price)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <LegalFooter />

      {/* Botón de WhatsApp flotante */}
      <a
        href={`https://wa.me/18297163555?text=${encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name} (${window.location.href})`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 z-50"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>

      {/* Modal Auth */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthModalOpen(false);
          handleAddToCart({ preventDefault: () => {} });
        }}
      />
    </div>
  );
};

export default ProductDetail;
