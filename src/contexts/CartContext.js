import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if it exists
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        return parsedCart;
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        // Try to save a simplified version if the full cart is too large
        try {
          const simplifiedCart = cart.map(({ id, name, price, quantity, image }) => ({
            id, name, price, quantity, image
          }));
          localStorage.setItem('cart', JSON.stringify(simplifiedCart));
        } catch (e) {
          console.error('Could not save simplified cart:', e);
        }
      }
    };

    // Only save if we're on the client side
    if (typeof window !== 'undefined') {
      saveCart();
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    try {
      if (!product || !product.id) {
        console.error('Invalid product:', product);
        throw new Error('Producto no válido');
      }

      if (!product || !product.id) {
        console.error('Invalid product:', product);
        throw new Error('Producto no válido');
      }


      setCart(prevCart => {
        // Check if product is already in cart
        const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
        let newCart = [...prevCart];

        if (existingItemIndex >= 0) {
          // Update quantity if product exists
          const updatedItem = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity
          };
          newCart[existingItemIndex] = updatedItem;
        } else {
          // Add new item to cart
          const newItem = {
            ...product,
            quantity,
            // Ensure we have all required fields
            name: product.name || 'Producto sin nombre',
            price: product.price || 0,
            image: product.image || product.images?.[0] || ''
          };
          newCart = [...newCart, newItem];
        }

        return newCart;
      });

      return true;
    } catch (error) {
      console.error('Error in addToCart:', error);
      return false;
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
