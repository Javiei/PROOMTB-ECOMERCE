import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial load - try DB if logged in, else LocalStorage
    useEffect(() => {
        if (user) {
            fetchCartFromDB();
        } else {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    }, [user]);

    // Save to LocalStorage whenever cart changes (if guest)
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const fetchCartFromDB = async () => {
        // Placeholder for DB logic: Assumes a 'cart_items' table exists
        // In a real app, you'd select * from cart_items where user_id = user.id
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id);

            if (!error && data) {
                // Transform DB data to matched cart structure if needed
                setCartItems(data);
            }
        } catch (error) {
            console.warn("Could not fetch cart from DB (table might not exist yet)", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        // Check if item exists
        const existingItem = cartItems.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
        let newCart;

        if (existingItem) {
            newCart = cartItems.map(item =>
                (item.id === product.id && item.selectedSize === product.selectedSize)
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cartItems, { ...product, quantity }];
        }

        setCartItems(newCart);
        setIsCartOpen(true);

        if (user) {
            // Sync to DB (Optimistic UI update above, background sync here)
            // Implementation depends on DB structure.
            // For now, simpler to just keep local state if DB structure isn't confirmed.
            try {
                // Example upsert
                // await supabase.from('cart_items').upsert(...)
            } catch (e) {
                console.error("Error syncing to cart DB", e);
            }
        }
    };

    const removeFromCart = (itemId, size) => {
        setCartItems(curr => curr.filter(item => !(item.id === itemId && item.selectedSize === size)));
        // Sync delete to DB if user logged in...
    };

    const updateQuantity = (itemId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(curr => curr.map(item =>
            (item.id === itemId && item.selectedSize === size)
                ? { ...item, quantity: newQuantity }
                : item
        ));
        // Sync update to DB if user logged in...
    };

    const clearCart = () => {
        setCartItems([]);
        if (!user) localStorage.removeItem('cartItems');
        // Sync clear to DB...
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartCount,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
