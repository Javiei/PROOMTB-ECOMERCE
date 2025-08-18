import { useNavigate } from 'react-router-dom';

// Navegación a la tienda con filtros opcionales
export const navigateToShop = (navigate, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Añadir filtros a los parámetros de consulta
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, value);
    }
  });
  
  navigate(`/tienda?${queryParams.toString()}`);
};

// Navegación a la página de producto
export const navigateToProduct = (navigate, productId) => {
  navigate(`/producto/${productId}`);
};
