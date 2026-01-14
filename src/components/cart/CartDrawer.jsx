import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart
                        <span className="text-gray-400 text-sm font-medium ml-2">({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                            <p className="text-gray-500 font-medium">Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-black font-bold uppercase underline tracking-wider text-sm hover:text-gray-600"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={item.imagenes_urls?.[0] || item.image_url}
                                        alt={item.modelo || item.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm uppercase mb-1">{item.modelo || item.name}</h3>
                                        {item.selectedSize && (
                                            <p className="text-xs text-gray-500 font-medium">Size: {item.selectedSize}</p>
                                        )}
                                        <p className="text-sm font-bold mt-1">
                                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-black disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-black"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total</span>
                            <span className="text-xl font-black">
                                {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(cartTotal)}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                const phoneNumber = '8297163555';
                                const itemsList = cartItems.map(item =>
                                    `- ${item.modelo || item.name} ${item.selectedSize ? `(Talla: ${item.selectedSize})` : ''} x${item.quantity}: ${new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price)}`
                                ).join('\n');

                                const totalFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(cartTotal);

                                const message = `Hola! Me gustaría consultar disponibilidad para los siguientes productos:\n\n${itemsList}\n\nTotal estimado: ${totalFormatted}\n\nGracias!`;

                                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, '_blank');

                                // Close cart and navigate to success page
                                setIsCartOpen(false);
                                navigate('/gracias');
                            }}
                            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Consultar por WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
