import React, { useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Cart = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartCount,
    clearCart
  } = useCart();
  const cartRef = useRef(null);

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const isEmpty = cart.length === 0;

  // Handle body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the cart when it opens for better accessibility
      if (cartRef.current) {
        cartRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cart);
    onClose();
    // Navigate to checkout page or show checkout form
    alert('Redirigiendo al proceso de pago...');
  };

  return (
    <div 
      ref={cartRef}
      className="flex h-full flex-col overflow-y-auto bg-white shadow-xl"
      tabIndex="-1"
      aria-labelledby="cart-title"
    >
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900" id="cart-title">
            Tu carrito
            {!isEmpty && ` (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}
          </h2>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              aria-label="Cerrar carrito"
            >
              <span className="absolute -inset-0.5" />
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flow-root">
            {isEmpty ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {!user ? 'Inicia sesión para ver tu carrito' : 'Tu carrito está vacío'}
                </h3>
                <p className="mt-2 text-gray-500">
                  {!user 
                    ? 'Inicia sesión o regístrate para guardar tus productos' 
                    : 'Comienza agregando algunos productos a tu carrito'}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  {!user ? (
                    <>
                      <button
                        onClick={() => {
                          onClose();
                          // Aquí deberías abrir el modal de login
                          // Por ahora usamos un enlace directo
                          window.location.href = '/login';
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Iniciar sesión
                      </button>
                      <Link
                        to="/tienda"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Seguir comprando
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/tienda"
                      onClick={onClose}
                      className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Ver productos
                      <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {cart.map((product) => (
                  <li key={`${product.id}-${product.selectedColor || 'default'}`} className="py-6">
                    <div className="flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white p-1">
                        <img
                          src={product.processedImages?.[0] || product.image || 'https://via.placeholder.com/150'}
                          alt={product.name}
                          className="h-full w-full object-contain object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-1">{product.name}</h3>
                            <p className="ml-4 whitespace-nowrap">${(product.price * product.quantity).toFixed(2)}</p>
                          </div>
                          {product.selectedColor && (
                            <p className="mt-1 text-sm text-gray-500">
                              Color: <span className="capitalize">{product.selectedColor}</span>
                            </p>
                          )}
                          {product.selectedSize && (
                            <p className="text-sm text-gray-500">Talla: {product.selectedSize}</p>
                          )}
                          <p className="text-sm text-gray-500">${product.price.toFixed(2)} c/u</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${product.id}`} className="sr-only">
                              Cantidad
                            </label>
                            <select
                              id={`quantity-${product.id}`}
                              value={product.quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                              className="rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-2 pr-10 text-base text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="font-medium text-red-500 hover:text-red-400"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${cartTotal.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Los impuestos y el envío se calculan al finalizar la compra.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                console.log('Proceeding to checkout');
                // Add your checkout logic here
              }}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Finalizar compra
            </button>
          </div>
          <div className="mt-4 flex justify-center text-center text-sm">
            <button
              type="button"
              className="text-purple-600 font-medium hover:text-purple-500"
              onClick={onClose}
            >
              Seguir comprando<span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
