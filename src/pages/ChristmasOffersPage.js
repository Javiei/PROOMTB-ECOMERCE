import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ALL_CATEGORIES } from '../constants/categories';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import { createSlug } from '../utils/stringUtils';

const ITEMS_PER_PAGE = 12;

const ChristmasOffersPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filtros
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');

  // Resetear el estado de añadido después de 2 segundos
  useEffect(() => {
    if (addedProductId) {
      const timer = setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedProductId]);

  // Cargar productos de la tabla bikes_navidad_2025
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('🔍 Cargando ofertas navideñas...');
        const { data, error } = await supabase
          .from('bikes_navidad_2025')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Mapear los datos de la tabla al formato esperado
        const list = (data || []).map(bike => {
          const productId = bike.codigo || `bike-${Math.random().toString(36).substr(2, 9)}`;
          return {
          id: productId,
          codigo: productId, // Asegurarnos de que codigo esté definido
          name: bike.nombre || 'Bicicleta sin nombre',
          description: bike.descripcion || 'Bicicleta de oferta especial',
          price: parseFloat(bike.precio || 0),
          old_price: parseFloat((bike.precio * 1.2).toFixed(2)),
          image_url: bike.imagen_url || 'https://via.placeholder.com/300x300?text=Sin+imagen',
          images: bike.imagen_url ? [{ url: bike.imagen_url }] : [],
          brand: bike.marca || 'Sin marca',
          model: bike.modelo || 'Modelo no especificado',
          category: bike.categoria || 'bicicletas',
          stock: bike.disponible ? 10 : 0,
          created_at: bike.created_at || new Date().toISOString(),
          is_christmas_offer: true,
          ...bike
        };});

        console.log('✅ Ofertas navideñas cargadas:', list);
        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error('Error al cargar ofertas navideñas:', err);
        // Datos de prueba en caso de error
        const testData = [
          {
            id: 'test-1',
            name: 'Bicicleta de Prueba',
            description: 'Bicicleta de prueba para desarrollo',
            price: 25000,
            old_price: 30000,
            image_url: 'https://via.placeholder.com/300x300?text=Bicicleta+de+Prueba',
            images: [],
            brand: 'Marca de Prueba',
            model: 'Modelo X',
            category: 'bicicletas',
            stock: 5,
            created_at: new Date().toISOString(),
            is_christmas_offer: true
          }
        ];
        setProducts(testData);
        setFilteredProducts(testData);
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

  // Reiniciar contador visible cuando cambien filtros
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    if (brandFilter) {
      setSearchTerm(brandFilter);
    }
  }, [category, searchTerm, priceRange, brandFilter]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];

    // Aplicar filtro de marca desde la URL
    if (brandFilter) {
      result = result.filter(p => 
        p.brand?.toLowerCase() === brandFilter.toLowerCase()
      );
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
  }, [products, category, searchTerm, priceRange, visibleCount, brandFilter]);

  // Categorías
  const categories = ALL_CATEGORIES;

  // Precio en DOP (RD)
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(
      Number(price || 0)
    );

  // Rango de precios dinámico
  const maxPrice = Math.max(...products.map((p) => Number(p.price || 0)), 100000);
  const minCandidates = products
    .map((p) => Number(p.price || 0))
    .filter((n) => Number.isFinite(n) && n > 0);
  const minPrice = minCandidates.length ? Math.min(...minCandidates) : 0;

  // Inicializar priceRange al máximo al cargar
  useEffect(() => {
    if (products.length > 0 && priceRange === 100000) {
      setPriceRange(maxPrice);
    }
  }, [products, maxPrice, priceRange]);

  // Helper para URL de imagen
  const getImageUrl = (product) => {
    let imageUrl = '';

    if (Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
      if (imageUrl && typeof imageUrl === 'object' && imageUrl.url) {
        imageUrl = imageUrl.url;
      }
    } else if (product.image) {
      imageUrl = product.image;
    } else if (product.image_url) {
      imageUrl = product.image_url;
    }

    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return imageUrl || 'https://via.placeholder.com/300x300?text=Sin+imagen';
  };

  // Manejar añadir al carrito
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const itemToAdd = {
      ...product,
      quantity: 1,
      selectedSize: null
    };

    addToCart(itemToAdd);
    setAddedProductId(product.id);
  };

  // Renderizado
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Ofertas Especiales de Navidad
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Las mejores ofertas navideñas en bicicletas
            </p>
            <div className="relative mt-4 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar ofertas..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando ofertas...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product) => {
                  const imageUrl = getImageUrl(product);
                  const hasDiscount = product.old_price && product.old_price > product.price;
                  const discountPercentage = hasDiscount 
                    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
                    : 0;
                  const isNew = product.created_at && 
                    (new Date() - new Date(product.created_at)) < (30 * 24 * 60 * 60 * 1000);
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <div key={product.id} className="group relative">
                      <Link
                        key={product.id}
                        to={`/navidad/${product.codigo || product.id || 'producto'}/${createSlug(product.name || 'producto')}`}
                        state={{ product: product }}
                        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
                          {isNew && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Nuevo
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              -{discountPercentage}%
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Agotado
                            </span>
                          )}
                        </div>

                        {/* Product Image */}
                        <div className="relative pt-[100%] bg-gray-50">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name || 'Producto'}
                              className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                                e.currentTarget.classList.add('object-cover');
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <svg
                                className="w-10 h-10 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          {/* Brand */}
                          {product.brand && (
                            <p className="text-xs font-medium text-blue-600 mb-1 truncate">
                              {product.brand}
                            </p>
                          )}

                          {/* Title */}
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10 flex items-start">
                            {product.name}
                          </h3>

                          {/* Model */}
                          {product.model && (
                            <p className="text-xs text-gray-500 mb-2">
                              {product.model}
                            </p>
                          )}

                          {/* Price */}
                          <div className="mt-2">
                            {hasDiscount ? (
                              <div className="flex items-baseline">
                                <p className="text-lg font-bold text-red-600">
                                  {formatPrice(product.price)}
                                </p>
                                <p className="ml-2 text-sm text-gray-500 line-through">
                                  {formatPrice(product.old_price)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className={`w-full py-2 px-3 text-white text-sm font-medium rounded-md transition-colors ${
                                addedProductId === product.id 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : isOutOfStock
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={addedProductId === product.id || isOutOfStock}
                            >
                              {addedProductId === product.id 
                                ? '¡Añadido!' 
                                : isOutOfStock 
                                  ? 'Agotado' 
                                  : 'Agregar al carrito'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cargar más productos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal de autenticación */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default ChristmasOffersPage;