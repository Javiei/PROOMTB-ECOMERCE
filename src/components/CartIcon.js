import React, { useState, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Cart from './Cart';

const CartIcon = ({ onUnauthorized }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useAuth();

  const toggleCart = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Toggling cart. Current state:', isOpen);
    const newState = !isOpen;
    setIsOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : '';
  }, [isOpen, user, onUnauthorized]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={toggleCart}
        className="p-2 relative group focus:outline-none"
        aria-label="Ver carrito"
        aria-expanded={isOpen}
      >
        <svg 
          className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="absolute right-0 w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <Cart isOpen={isOpen} onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
