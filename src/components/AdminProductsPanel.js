import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon as XIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ALL_CATEGORIES } from '../constants/categories';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Crear un objeto plano de categorías para facilitar su uso
const flattenCategories = () => {
  const flatCategories = {};
  
  ALL_CATEGORIES.forEach(category => {
    if (category.group) {
      // Si es un grupo de categorías, agregar cada opción
      category.options.forEach(option => {
        flatCategories[option.value] = option.label;
      });
    } else if (category.value !== 'all') {
      // Si es una categoría individual (excepto 'all')
      flatCategories[category.value] = category.label;
    }
  });
  
  return flatCategories;
};

const categories = flattenCategories();

export default function AdminProductsPanel() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all'
  });
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: ''
  });

  // Calcular estadísticas de productos por categoría
  const categoryStats = useMemo(() => {
    const stats = {};
    products.forEach(product => {
      const category = product.category || 'Sin categoría';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }, [products]);

  // Configuración del gráfico de pastel
  const chartData = useMemo(() => {
    // Generar colores dinámicamente para cada categoría
    const backgroundColors = [
      'rgba(59, 130, 246, 0.7)',  // Azul
      'rgba(16, 185, 129, 0.7)',  // Verde
      'rgba(245, 158, 11, 0.7)',  // Amarillo
      'rgba(239, 68, 68, 0.7)',   // Rojo
      'rgba(139, 92, 246, 0.7)',  // Púrpura
      'rgba(20, 184, 166, 0.7)',  // Verde azulado
      'rgba(249, 115, 22, 0.7)',  // Naranja
      'rgba(236, 72, 153, 0.7)',  // Rosa
    ];
    
    return {
      labels: Object.keys(categoryStats).map(key => categories[key] || key),
      datasets: [
        {
          data: Object.values(categoryStats),
          backgroundColor: backgroundColors.slice(0, Object.keys(categoryStats).length),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }, [categoryStats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribución de productos por categoría',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',  // Hace el gráfico un donut en lugar de un círculo completo
  };

  // Efecto para aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...products];

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          (product.name?.toLowerCase().includes(term) || '') ||
          (product.description?.toLowerCase().includes(term) || '') ||
          (product.category?.toLowerCase().includes(term) || '')
      );
    }

    // Aplicar filtro de categoría
    if (filters.category && filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, filters]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setError('Error al cargar los productos: ' + error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingProduct(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const saveChanges = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update(editingProduct)
        .eq('id', editingId);
      
      if (error) throw error;
      
      setProducts(products.map(p => p.id === editingId ? { ...p, ...editingProduct } : p));
      setSuccess('Producto actualizado correctamente');
      setEditingId(null);
      setEditingProduct(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error al actualizar el producto: ' + error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setProducts(products.filter(product => product.id !== id));
        setSuccess('Producto eliminado correctamente');
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Error al eliminar el producto: ' + error.message);
      }
    }
  };

  const addNewProduct = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          rating: 5,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      setProducts([data[0], ...products]);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        image_url: ''
      });
      
      setSuccess('Producto agregado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error al agregar el producto: ' + error.message);
    }
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Productos</h1>
      
      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Estadísticas de Productos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Total de Productos</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Categorías Únicas</h3>
            <p className="text-3xl font-bold text-green-600">{Object.keys(categoryStats).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Mostrando</h3>
            <p className="text-3xl font-bold text-purple-600">{filteredProducts.length} productos</p>
          </div>
        </div>
        
        <div className="h-96">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Barra de búsqueda y filtros */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar productos</label>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por categoría</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Mensajes de éxito y error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          <p>{success}</p>
        </div>
      )}

      {/* Formulario para agregar nuevo producto */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h2>
        <form onSubmit={addNewProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {Object.entries(categories).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                <input
                  type="url"
                  name="image_url"
                  value={newProduct.image_url}
                  onChange={handleNewProductChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {newProduct.image_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                    <img 
                      src={newProduct.image_url} 
                      alt="Vista previa" 
                      className="h-20 w-20 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=Error+imagen';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el producto..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Agregar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Imagen del producto */}
            <div className="h-48 bg-gray-100 overflow-hidden relative">
              {product.images?.[0] || product.image_url ? (
                <img 
                  src={product.images?.[0] || product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Contenido de la tarjeta */}
            <div className="p-4">
              {editingId === product.id ? (
                // Vista de edición
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre</label>
                    <input
                      type="text"
                      value={editingProduct?.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-500">Precio ($)</label>
                    <input
                      type="number"
                      value={editingProduct?.price || ''}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-500">URL de la imagen</label>
                    <input
                      type="url"
                      value={editingProduct?.image_url || ''}
                      onChange={(e) => handleFieldChange('image_url', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {editingProduct?.image_url && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                        <img 
                          src={editingProduct.image_url} 
                          alt="Vista previa" 
                          className="h-20 w-20 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100x100?text=Error+imagen';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-500">Categoría</label>
                    <select
                      value={editingProduct?.category || ''}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {Object.entries(categories).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-500">Descripción</label>
                    <textarea
                      value={editingProduct?.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={saveChanges}
                      className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista normal
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {categories[product.category] || product.category}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron productos que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
}
