import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ALL_CATEGORIES } from '../constants/categories';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(false);

  // Filtros
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');

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
        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error('Error al cargar productos:', err);
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
  }, [category, searchTerm, priceRange]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(term) ||
          (p.description || '').toLowerCase().includes(term)
      );
    }

    result = result.filter((p) => Number(p.price || 0) <= Number(priceRange || 0));

    setFilteredProducts(result);
    updateDisplayedProducts(result, Math.min(visibleCount, result.length));
  }, [products, category, searchTerm, priceRange, visibleCount]);

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

    return imageUrl;
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TIENDA</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de ciclismo
          </p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="search" className="sr-only">
              Buscar productos
            </label>
            <div className="relative">
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
                id="search"
                type="text"
                placeholder="Buscar productos..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Contenido principal */}
          <div className="flex-1">
            {/* Resumen */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">
                {displayedProducts.length > 0 ? (
                  <>
                    Mostrando <span className="font-semibold">{displayedProducts.length}</span> de{' '}
                    <span className="font-semibold">{filteredProducts.length}</span> productos
                  </>
                ) : (
                  <>No se encontraron productos</>
                )}
                {category !== 'all' &&
                  ` en ${
                    categories
                      .flatMap((c) => (c.group ? c.options : c))
                      .find((c) => c.value === category)?.label || category
                  }`}
                {searchTerm && ` para "${searchTerm}"`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando productos...</p>
              </div>
            ) : (
              <>
                {/* Grid de productos */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedProducts.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-600">
                          No se encontraron productos que coincidan con tu búsqueda.
                        </p>
                      </div>
                    ) : (
                      displayedProducts.map((product) => {
                        const imageUrl = getImageUrl(product);
                        return (
                          <Link
                            to={`/producto/${product.id}`}
                            key={product.id}
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                          >
                            <div className="relative pb-[100%] bg-gray-100">
                              {imageUrl ? (
                                <>
                                  <img
                                    src={imageUrl}
                                    alt={product.name || 'Producto'}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src =
                                        'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                                    }}
                                  />
                                  {Array.isArray(product.images) && product.images.length > 1 && (
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                      +{product.images.length - 1}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                  <svg
                                    className="w-12 h-12 text-gray-400"
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
                                  <span className="sr-only">Sin imagen</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white font-medium">Ver detalles</span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-12">
                                {product.name}
                              </h3>
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </p>
                              {product.old_price && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.old_price)}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                ) : (
                  // Estado vacío (sin resultados)
                  <div className="col-span-full text-center py-12">
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron productos</h3>
                    <p className="mt-1 text-gray-500">
                      Intenta con otros filtros o términos de búsqueda.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setCategory('all');
                          setPriceRange(maxPrice);
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                )}

                {/* Botón Cargar más */}
                {hasMore && displayedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                      disabled={loading}
                    >
                      Cargar más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel lateral de filtros */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.map((item) => {
                    if (item.group) {
                      return (
                        <div key={item.group} className="mb-2">
                          <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {item.group}
                          </h5>
                          <div className="space-y-1 pl-2">
                            {item.options.map((option) => (
                              <label key={option.value} className="flex items-center">
                                <input
                                  type="radio"
                                  name="category"
                                  value={option.value}
                                  checked={category === option.value}
                                  onChange={() => setCategory(option.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <label key={item.value} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={item.value}
                          checked={category === item.value}
                          onChange={() => setCategory(item.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Rango de precios */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rango de precios</h4>
                <div className="px-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="mt-2 text-sm text-gray-600">Máximo: {formatPrice(priceRange)}</div>
                </div>
              </div>

              {/* Limpiar filtros */}
              <button
                onClick={() => {
                  setCategory('all');
                  setPriceRange(maxPrice);
                  setSearchTerm('');
                }}
                className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
