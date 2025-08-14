import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// Función auxiliar para procesar las URLs de imágenes
const processImageUrl = (product) => {
  let imageUrl = '';
  
  // 1. Verificar si hay un array de imágenes
  if (Array.isArray(product.images) && product.images.length > 0) {
    imageUrl = product.images[0];
    // Si es un objeto con propiedad url
    if (typeof imageUrl === 'object' && imageUrl.url) {
      imageUrl = imageUrl.url;
    }
  } 
  // 2. Verificar si hay una propiedad image
  else if (product.image) {
    imageUrl = product.image;
  } 
  // 3. Verificar si hay una propiedad image_url
  else if (product.image_url) {
    imageUrl = product.image_url;
  }
  
  // Asegurarse de que la URL sea absoluta
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  
  return imageUrl;
};

// Función para obtener todas las imágenes de un producto
const getAllProductImages = (product) => {
  if (!product) {
    console.log('No product provided to getAllProductImages');
    return [];
  }

  console.log('Getting all images for product:', product.id || 'unknown');
  const images = [];
  
  try {
    // 1. Verificar si hay un array de imágenes
    if (product.images) {
      console.log('Product has images property:', product.images);
      if (Array.isArray(product.images)) {
        product.images.forEach(img => {
          if (!img) return;
          
          if (typeof img === 'string') {
            console.log('Adding image from images array (string):', img);
            images.push(img);
          } else if (img && typeof img === 'object' && img.url) {
            console.log('Adding image from images array (object):', img.url);
            images.push(img.url);
          } else {
            console.log('Found image in array but with unexpected format:', img);
            // Try to stringify the image object in case it has a different structure
            const imgStr = JSON.stringify(img);
            if (imgStr && imgStr !== '{}') {
              console.log('Attempting to use stringified image object');
              images.push(imgStr);
            }
          }
        });
      } else if (typeof product.images === 'string') {
        console.log('Adding single image from images string:', product.images);
        images.push(product.images);
      }
    }
    
    // 2. Verificar si hay una propiedad image
    if (product.image) {
      console.log('Adding image from image property:', product.image);
      const img = product.image;
      if (typeof img === 'string' && !images.includes(img)) {
        images.push(img);
      } else if (img && typeof img === 'object' && img.url && !images.includes(img.url)) {
        images.push(img.url);
      }
    }
    
    // 3. Verificar si hay una propiedad image_url
    if (product.image_url) {
      console.log('Adding image from image_url property:', product.image_url);
      const imgUrl = product.image_url;
      if (typeof imgUrl === 'string' && !images.includes(imgUrl)) {
        images.push(imgUrl);
      } else if (imgUrl && typeof imgUrl === 'object' && imgUrl.url && !images.includes(imgUrl.url)) {
        images.push(imgUrl.url);
      }
    }
  
    console.log('Collected images before processing:', images);
    
    // Asegurarse de que las URLs sean absolutas
    const processedImages = images.map(img => {
      if (!img) return null;
      
      // Si es un objeto con propiedad url, usamos esa
      if (typeof img === 'object' && img.url) {
        img = img.url;
      }
      
      const imgStr = String(img);
      
      // Si ya es una URL completa, la dejamos como está
      if (imgStr.startsWith('http') || imgStr.startsWith('data:')) {
        return imgStr;
      }
      
      // Si es una ruta relativa, la convertimos a absoluta
      return `${window.location.origin}${imgStr.startsWith('/') ? '' : '/'}${imgStr}`;
    }).filter(Boolean); // Eliminar valores nulos o indefinidos
    
    console.log('Processed images:', processedImages);
    return processedImages;
  } catch (error) {
    console.error('Error processing images:', error);
    return [];
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAdding(true);
      console.log('Adding to cart:', { product, quantity });
      
      // Add to cart
      addToCart(product, quantity);
      
      // Show success feedback
      setAddSuccess(true);
      console.log('Product added to cart. Current cart:', [...cart, { ...product, quantity }]);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Hubo un error al agregar el producto al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };
  
  const handleAddToCartClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    handleAddToCart();
  };

  // Obtener producto actual
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        console.log('Raw product data from Supabase:', JSON.stringify(data, null, 2));
        
        // Procesar las imágenes del producto
        const processedImages = getAllProductImages(data);
        console.log('Processed images array:', processedImages);
        
        const productWithProcessedImages = {
          ...data,
          processedImages: processedImages
        };
        
        console.log('Final product object with images:', {
          ...productWithProcessedImages,
          // Don't log the entire images array if it's large
          images: Array.isArray(productWithProcessedImages.images) 
            ? `[Array of ${productWithProcessedImages.images.length} images]` 
            : productWithProcessedImages.images,
          processedImages: `[Array of ${processedImages.length} processed images]`
        });
        
        setProduct(productWithProcessedImages);
        // Una vez que tenemos el producto, buscamos productos relacionados
        fetchRelatedProducts(data.category, data.id);
      } else {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    }

    async function fetchRelatedProducts(category, excludeId) {
      setRelatedLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', excludeId)
        .limit(3);
      
      if (!error && data) {
        // Procesar las imágenes de los productos relacionados
        const processedRelatedProducts = data.map(prod => ({
          ...prod,
          processedImages: getAllProductImages(prod)
        }));
        setRelatedProducts(processedRelatedProducts);
      } else if (error) {
        console.error('Error fetching related products:', error);
      }
      setLoading(false);
      setRelatedLoading(false);
    }

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  return (
    <div className="min-h-screen w-full bg-gray-900">
      {/* Modal de imagen grande */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center" onClick={() => setModalImage(null)}>
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <button className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80" onClick={e => { e.stopPropagation(); setModalImage(null); }}>&times;</button>
            <img src={modalImage} alt="Vista ampliada" className="max-h-[80vh] w-auto rounded-xl shadow-2xl border-4 border-purple-500" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-[1500px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-900 rounded-xl shadow-lg p-8">
          {/* Galería + Info */}
          {loading ? (
            <div className="text-white">Cargando...</div>
          ) : !product ? (
            <div className="text-red-400">Producto no encontrado</div>
          ) : (
            <>
              {/* Sección de imagen (izquierda) */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  {product.processedImages && product.processedImages.length > 0 ? (
                    <div 
                      className="bg-white rounded-lg flex items-center justify-center aspect-square border-4 border-purple-500 cursor-pointer overflow-hidden p-6"
                      onClick={() => setModalImage(product.processedImages[0])}
                    >
                      <img 
                        src={product.processedImages[0]} 
                        alt={product.name}
                        className="object-contain h-full w-full"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible'; 
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center aspect-square border-4 border-gray-200">
                      <span className="text-gray-600">Sin imagen disponible</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sección de información (derecha) */}
              <div className="flex flex-col justify-center">
                <div className="bg-gray-800 p-8 rounded-lg h-full">
                  <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
                  <div className="flex items-center mb-6">
                    <span className="text-2xl font-bold text-purple-400 mr-4">${product.price?.toFixed(2)}</span>
                    <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">{product.rating} ★</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <label htmlFor="quantity" className="mr-2 text-gray-300">Cantidad:</label>
                      <input 
                        type="number" 
                        id="quantity"
                        min={1} 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500" 
                        disabled={isAdding}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className={`flex-1 ${isAdding ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded font-bold transition-colors`}
                        title={!user ? 'Inicia sesión para comprar' : ''}
                      >
                        {isAdding ? 'PROCESANDO...' : 'COMPRAR AHORA'}
                      </button>
                      <button 
                        onClick={handleAddToCartClick}
                        disabled={isAdding}
                        className={`flex-1 ${isAdding ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded font-bold transition-colors`}
                        title={!user ? 'Inicia sesión para agregar al carrito' : ''}
                      >
                        {isAdding ? 'AGREGANDO...' : 'AÑADIR AL CARRITO'}
                      </button>
                    </div>
                    {addSuccess && (
                      <div className="mt-2 p-2 bg-green-100 text-green-800 text-sm rounded">
                        ✅ {product.name} ha sido agregado al carrito
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-purple-400">Descripción</h3>
                    <p className="text-gray-300 text-sm">{product.description}</p>
                  </div>
                  <button 
                    onClick={() => navigate(-1)} 
                    className="mt-8 text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                  >
                    ← Volver a la tienda
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Sección de productos relacionados */}
      {/* Productos Relacionados */}
      {!relatedLoading && relatedProducts.length > 0 && (
        <section className="max-w-5xl w-full mt-16 mb-10">
          <h3 className="text-2xl font-bold text-white mb-8 tracking-widest">PRODUCTOS RELACIONADOS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(prod => (
              <Link 
                to={`/product/${prod.id}`} 
                key={prod.id} 
                className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-700 hover:border-purple-500 transition-colors"
              >
                {prod.images && prod.images.length > 0 ? (
                  <img 
                    src={prod.processedImages && prod.processedImages[0] ? prod.processedImages[0] : 'https://via.placeholder.com/150x150?text=Sin+imagen'} 
                    alt={prod.name}
                    className="h-32 w-32 object-contain mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150x150?text=Error+imagen';
                    }}
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  </div>
                )}
                <h4 className="text-lg font-bold text-white mb-2 text-center">{prod.name}</h4>
                <div className="text-xl font-bold text-purple-400 mb-4">
                  ${parseFloat(prod.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
                <span className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                  {prod.category}
                </span>
                <button 
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  Ver Producto
                </button>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Inicia sesión para continuar</h3>
            <p className="mb-6">Necesitas iniciar sesión para realizar compras o agregar productos al carrito.</p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login', { state: { from: `/product/${id}` } });
                }}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/signup', { state: { from: `/product/${id}` } });
                }}
                className="w-full bg-white text-purple-600 border border-purple-600 py-2 px-4 rounded hover:bg-purple-50 transition-colors"
              >
                Crear cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
