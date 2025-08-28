import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import LegalFooter from './LegalFooter';
import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

const ProductDetail = () => {
  const { id: idWithName } = useParams();
  // Extraer el ID de la URL (último segmento después del último '-')
  // y asegurarse de que tenga el formato correcto
  let id = idWithName.split('-').pop();
  
  // Si el ID es más corto que un UUID estándar (36 caracteres), 
  // asumimos que es un ID corto y lo usamos directamente
  // De lo contrario, intentamos extraer solo la parte del UUID
  if (id.length >= 36) {
    // Intentar extraer un UUID del final de la cadena
    const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    if (uuidMatch) {
      id = uuidMatch[0];
    }
  }
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Tallas predeterminadas para bicicletas y ropa si no están definidas en el producto
  const defaultBikeSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);
  const defaultClothingSizes = useMemo(() => ['S', 'M', 'L', 'XL'], []);
  
  // Debugging para ver la categoría del producto
  useEffect(() => {
    if (product) {
      console.log('Categoría del producto:', product.category);
      console.log('Tallas del producto:', product.sizes);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let data = null;
        let error = null;
        
        // Primero intentamos con una búsqueda exacta por ID
        const { data: exactMatch, error: exactError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (!exactError && exactMatch) {
          data = exactMatch;
        } else {
          // Si no encontramos coincidencia exacta, buscamos por el ID corto
          const { data: allProducts, error: allError } = await supabase
            .from('products')
            .select('*');
            
          if (allError) throw allError;
          
          // Buscamos manualmente un ID que termine con el ID corto
          const matchingProduct = allProducts.find(product => 
            product.id && product.id.endsWith && product.id.endsWith(id)
          );
          
          if (matchingProduct) {
            data = matchingProduct;
          } else {
            throw new Error('Producto no encontrado');
          }
        }

        if (error) throw error;

        // Procesar las imágenes si existen
        if (data) {
          // Convertir la cadena JSON de imágenes a un array si es necesario
          if (data.images && typeof data.images === 'string') {
            try {
              data.processedImages = JSON.parse(data.images);
            } catch (e) {
              console.error('Error parsing images JSON:', e);
              data.processedImages = [data.image_url || data.image || ''];
            }
          } else if (Array.isArray(data.images)) {
            data.processedImages = data.images;
          } else {
            // Si no hay imágenes, usar la imagen principal
            data.processedImages = [data.image_url || data.image || ''];
          }

          // Asegurarse de que colors y sizes sean arrays
          if (data.colors && typeof data.colors === 'string') {
            try {
              data.colors = JSON.parse(data.colors);
            } catch (e) {
              console.error('Error parsing colors JSON:', e);
              data.colors = [];
            }
          }

          if (data.sizes && typeof data.sizes === 'string') {
            try {
              data.sizes = JSON.parse(data.sizes);
            } catch (e) {
              console.error('Error parsing sizes JSON:', e);
              data.sizes = [];
            }
          }

          // Asignar tallas predeterminadas si no hay tallas y es bicicleta o ropa
          if ((!data.sizes || data.sizes.length === 0 || !Array.isArray(data.sizes)) && 
              (data.category === 'Bicicletas' || 
               data.category === 'Ropa' || 
               data.category === 'Accesorios')) {
            if (data.category === 'Bicicletas') {
              data.sizes = [...defaultBikeSizes];
            } else if (data.category === 'Ropa' || data.category === 'Accesorios') {
              data.sizes = [...defaultClothingSizes];
            }
            console.log('Asignando tallas predeterminadas:', data.sizes);
          }

          // Establecer el color y talla por defecto si están disponibles
          if (Array.isArray(data.colors) && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }

          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }

          setProduct(data);

          // Obtener productos relacionados de la misma categoría
          if (data.category) {
            const { data: relatedData, error: relatedError } = await supabase
              .from('products')
              .select('*')
              .eq('category', data.category)
              .neq('id', id)
              .limit(4);

            if (!relatedError && relatedData) {
              // Procesar imágenes de productos relacionados
              const processedRelated = relatedData.map(item => {
                let processedItem = { ...item };
                
                // Procesar imágenes
                if (item.images && typeof item.images === 'string') {
                  try {
                    processedItem.processedImages = JSON.parse(item.images);
                  } catch (e) {
                    processedItem.processedImages = [item.image_url || item.image || ''];
                  }
                } else if (Array.isArray(item.images)) {
                  processedItem.processedImages = item.images;
                } else {
                  processedItem.processedImages = [item.image_url || item.image || ''];
                }
                
                return processedItem;
              });
              
              setRelatedProducts(processedRelated);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id, defaultBikeSizes, defaultClothingSizes]);

  const handleAddToCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Validar si el producto requiere selección de talla
    if (product && Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla antes de añadir al carrito');
      return;
    }

    // Validar si el producto requiere selección de color
    if (product && Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color antes de añadir al carrito');
      return;
    }

    if (product) {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || product.image,
        processedImages: product.processedImages,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize
      };

      addToCart(itemToAdd);
      alert('Producto añadido al carrito');
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <button 
          onClick={() => navigate('/tienda')} 
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-10" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Inicio
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/tienda" className="ml-2 text-gray-500 hover:text-gray-700">
                Tienda
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Product images */}
          <div className="flex flex-col">
            <div className="mb-6 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 shadow-md">
              <img
                src={product.image_url || product.processedImages[selectedImage] || product.image || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-center object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
            </div>
            
            {/* Thumbnail images */}
            {product.processedImages && product.processedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {product.processedImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden shadow ${selectedImage === idx ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-200'}`}
                  >
                    <img
                      src={img || 'https://via.placeholder.com/150'}
                      alt={`${product.name} - Vista ${idx + 1}`}
                      className="w-full h-full object-center object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-4">
              <h2 className="sr-only">Información del producto</h2>
              <p className="text-3xl text-gray-900 font-bold">${product.price?.toFixed(2)}</p>
            </div>

            {/* Reviews placeholder */}
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${rating < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{product.reviews || 0} reseñas</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-900">Descripción</h3>
              <div className="mt-2 text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              {/* Color selector */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-3">
                    <div className="flex items-center space-x-4">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-1 ring-purple-500' : ''}`}
                        >
                          <span
                            className={`h-10 w-10 rounded-full border border-black border-opacity-10 capitalize flex items-center justify-center`}
                            style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f9fafb' : color.toLowerCase() }}
                          >
                            {color.toLowerCase() === 'white' || color.toLowerCase() === 'black' ? (
                              <span className={`text-xs ${color.toLowerCase() === 'black' ? 'text-white' : 'text-black'}`}>
                                {color}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Size selector - Siempre visible para depuración */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Talla</h3>
                  <span className="text-sm font-medium text-purple-600 hover:text-purple-500 cursor-pointer">Guía de tallas</span>
                </div>
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-3">
                    {(defaultBikeSizes).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none ${selectedSize === size ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-300 text-gray-900'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900">Cantidad</h3>
                <div className="mt-3">
                  <select
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="max-w-full rounded-md border border-gray-300 py-2 px-3 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-purple-600 py-3 px-8 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Añadir al carrito
                </button>
                
                <a 
                  href={`https://wa.me/18297163555?text=${encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name}\n\n${window.location.href}`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  aria-label="Contactar por WhatsApp"
                  title="Contáctanos por WhatsApp"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    className="bi bi-whatsapp mr-2" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.922-3.556 7.922-7.93 0-2.125-.847-4.126-2.32-5.607zM7.994 14.496a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.64 2.986-6.602 6.657-6.602a6.58 6.58 0 0 1 4.66 1.931 6.582 6.582 0 0 1 1.93 4.66c-.003 3.639-2.961 6.602-6.61 6.602zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.608-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.127.418.475.152.904.129 1.246.082.38-.051 1.171-.48 1.338-.943.164-.464.164-.86.114-.944-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-2 text-sm text-gray-500">Envío en 2-3 días hábiles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-md bg-gray-200 group-hover:opacity-90 transition-opacity duration-300">
                    <img
                      src={relatedProduct.image_url || relatedProduct.processedImages?.[0] || relatedProduct.image || 'https://via.placeholder.com/300'}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        <Link to={`/producto/${relatedProduct.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {relatedProduct.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{relatedProduct.category}</p>
                    </div>
                    <p className="mt-2 text-sm font-bold text-gray-900">${relatedProduct.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <LegalFooter />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
};

export default ProductDetail;
