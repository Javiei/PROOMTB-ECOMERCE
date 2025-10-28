import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import Footer from '../components/Footer';
import LegalFooter from '../components/LegalFooter';
import { createSlug } from '../components/ProductDetail';
import { FaWhatsapp, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import ProductMetaTags from '../components/ProductMetaTags';

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Obtener productos relacionados de la misma categoría
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        setLoadingRelated(true);
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .eq('categoria', product.category)
          .neq('codigo', product.id) // Excluir el producto actual
          .limit(4); // Limitar a 4 productos relacionados

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map(item => ({
            ...item,
            id: item.codigo,
            name: item.nombre,
            price: parseFloat(item.precio || 0),
            old_price: parseFloat((item.precio * 1.2).toFixed(2)),
            image_url: item.imagen_url || 'https://via.placeholder.com/300x300?text=Sin+imagen',
            category: item.categoria || 'bicicletas',
            stock: item.disponible ? 10 : 0
          }));
          setRelatedProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error al cargar productos relacionados:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Obtener imágenes del producto
  const images = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      if (typeof product.images === 'string') {
        try {
          return JSON.parse(product.images);
        } catch (e) {
          return [{ url: product.images }];
        }
      }
      return product.images;
    }
    return product.image_url ? [{ url: product.image_url }] : [];
  }, [product]);

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
          // Procesar imágenes
          let processedImages = [];
          if (data.images && typeof data.images === 'string') {
            try {
              processedImages = JSON.parse(data.images);
            } catch (e) {
              processedImages = data.images ? [data.images] : [];
            }
          } else if (Array.isArray(data.images)) {
            processedImages = data.images;
          }

          const formattedProduct = {
            ...data,
            id: data.codigo,
            name: data.nombre,
            description: data.descripcion,
            price: parseFloat(data.precio || 0),
            old_price: parseFloat((data.precio * 1.2).toFixed(2)),
            image_url: data.imagen_url || (processedImages[0]?.url || 'https://via.placeholder.com/600x600?text=Imagen+no+disponible'),
            images: processedImages,
            brand: data.marca || 'Sin marca',
            model: data.modelo || 'Modelo no especificado',
            category: data.categoria || 'bicicletas',
            stock: data.disponible ? 10 : 0,
            is_christmas_offer: true,
            created_at: data.created_at || new Date().toISOString()
          };
          setProduct(formattedProduct);
        } else {
          navigate('/ofertas-navidenas', { replace: true });
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        navigate('/ofertas-navidenas', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', { 
      style: 'currency', 
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Manejar agregar al carrito
  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (product && product.stock > 0) {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || (product.images && product.images[0]?.url) || '',
        quantity: quantity,
        selectedSize: '',
        selectedColor: '',
        is_christmas_offer: true
      };

      addToCart(itemToAdd);
      setAddedToCart(true);
      
      // Resetear el mensaje después de 3 segundos
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Echa un vistazo a ${product.name} en PMTBWB`,
          url: window.location.href,
        });
      } else {
        // Fallback para navegadores que no soportan la API de Web Share
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-8">Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
          <Link 
            to="/ofertas-navidenas" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaArrowLeft className="mr-2" /> Volver a las ofertas
          </Link>
        </div>
      </div>
    );
  }

  // Verificar si el producto es nuevo (menos de 30 días)
  const isNew = product.created_at && 
    (new Date() - new Date(product.created_at)) < (30 * 24 * 60 * 60 * 1000);

  // Calcular descuento si existe
  const hasDiscount = product.old_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
    
  // Obtener la URL de la imagen principal
  const mainImage = images[selectedImage]?.url || product.image_url || 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductMetaTags product={product} />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/ofertas-navidenas" className="text-blue-600 hover:text-blue-800 hover:underline">Ofertas Navideñas</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600 truncate max-w-xs md:max-w-md">{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-6">
              {/* Imágenes del producto */}
              <div className="mb-8 lg:mb-0">
                <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
                      e.currentTarget.classList.add('object-cover');
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {isNew && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nuevo
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Miniaturas */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img.url || img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Imagen';
                          }}
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                        )}
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
                      {product.brand && (
                        <p className="text-sm font-medium text-blue-600 mb-1">
                          {product.brand}
                        </p>
                      )}
                      
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      
                      {product.model && (
                        <p className="text-lg text-gray-600 mb-4">
                          {product.model}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <FaHeart 
                        className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      onClick={handleShare}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <FiShare2 className="mr-1" /> Compartir
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  {hasDiscount ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="ml-3 px-2 py-1 text-sm font-medium text-white bg-red-600 rounded">
                          {discountPercentage}% OFF
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.old_price)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          Ahorras {formatPrice(product.old_price - product.price)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center">
                    {product.stock > 0 ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-gray-600 font-medium">
                          {product.stock > 5 
                            ? 'En stock' 
                            : `¡Solo quedan ${product.stock} unidades!`}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-600 text-sm font-medium">
                        <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2"></span>
                        Agotado - ¡Próximamente más stock!
                      </span>
                    )}
                  </div>
                  
                  {product.stock > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{
                            width: `${Math.min(100, (product.stock / 10) * 100)}%`,
                            maxWidth: '100%'
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.stock} unidades disponibles
                      </p>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {product.description && (
                  <div className="prose max-w-none mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
                    <div className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* Cantidad y botón de compra */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700 font-medium">Cantidad:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity >= Math.min(10, product.stock)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                        product.stock <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : addedToCart
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <FaShoppingCart className="mr-2" />
                      {addedToCart
                        ? '¡Añadido al carrito!'
                        : product.stock > 0
                          ? 'Agregar al carrito'
                          : 'Agotado'}
                    </button>
                    
                    <a 
                      href={`https://wa.me/18297163555?text=Hola,%20estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(product.name)}%20(${window.location.href})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-4 px-6 border border-green-500 rounded-lg font-medium text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <FaWhatsapp className="mr-2 text-green-500 text-xl" />
                      Consultar por WhatsApp
                    </a>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 pt-2">
                    <p>Envío a todo el país</p>
                  </div>
                </div>

                {/* Descripción */}
                {product.description && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción del producto</h3>
                    <div className="prose max-w-none text-gray-600">
                      {product.description.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                
                
                {/* Categorías */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/categoria/${product.category}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      {product.category || 'Sin categoría'}
                    </Link>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Ofertas Navideñas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sección de productos relacionados */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
          
          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  to={`/producto-navideno/${relatedProduct.id}`} 
                  key={relatedProduct.id}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
                      <img 
                        src={relatedProduct.image_url} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 capitalize">
                          {relatedProduct.category?.replace(/-/g, ' ')}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-lg font-medium text-gray-900">
                            {formatPrice(relatedProduct.price)}
                          </p>
                          {relatedProduct.old_price && relatedProduct.old_price > relatedProduct.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {formatPrice(relatedProduct.old_price)}
                            </span>
                          )}
                        </div>
                        {relatedProduct.stock <= 0 && (
                          <span className="inline-block mt-1 text-xs text-red-600">
                            Agotado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay productos relacionados disponibles en este momento.</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              to="/ofertas-navidenas"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver más ofertas
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
      <LegalFooter />
      
      {/* Botón de WhatsApp flotante */}
      <a 
        href={`https://wa.me/18095555555?text=Hola,%20estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(product.name)}%20(${window.location.href})`}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 z-50"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>

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

export default ChristmasProductDetail;
