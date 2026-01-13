import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import AuthModal from '../auth/AuthModal';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import raymonLogo from '../../assets/Raymon_logo_black schriftzug.png';
import proomtbLogo from '../../assets/LOGO PRO MTB AND ROAD VECTORES CORREGIDOS.pdf.png';
import SearchOverlay from './SearchOverlay';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false); // For Accessories
    const [showEBikesMenu, setShowEBikesMenu] = useState(false); // For E-Bikes
    const [showBikesMenu, setShowBikesMenu] = useState(false); // For Normal Bikes
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { setIsCartOpen, cartCount } = useCart();
    const { user, signOut } = useAuth();

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Check Admin Role
    React.useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setIsAdmin(false);
                return;
            }

            try {
                const { data, error } = await import('../../supabaseClient').then(module =>
                    module.supabase
                        .from('profiles')
                        .select('Role')
                        .eq('id', user.id)
                        .single()
                );

                if (data?.Role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error('Error checking admin role:', err);
                setIsAdmin(false);
            }
        };

        checkAdminRole();
    }, [user]);

    const handleUserClick = () => {
        if (user) {
            navigate('/profile');
        } else {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-4">
                            <img src={proomtbLogo} alt="Proomtb Logo" className="h-8 md:h-12 w-auto object-contain" />
                            <div className="h-6 md:h-8 w-auto w-px bg-gray-300"></div>
                            <img src={raymonLogo} alt="Raymon Logo" className="h-6 md:h-8 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-8 items-center">
                        <div
                            className="group"
                            onMouseEnter={() => setShowEBikesMenu(true)}
                            onMouseLeave={() => setShowEBikesMenu(false)}
                        >
                            <button className="inline-flex items-center h-20 px-1 text-sm font-bold uppercase tracking-wider hover:text-gray-600 transition-colors relative z-50">
                                E-Bikes
                            </button>

                            {/* E-Bikes Mega Menu */}
                            <div className={`transition-opacity duration-200 ${showEBikesMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                {showEBikesMenu && <MegaMenu type="ebikes" onMouseLeave={() => setShowEBikesMenu(false)} />}
                            </div>
                        </div>

                        <div
                            className="group"
                            onMouseEnter={() => setShowBikesMenu(true)}
                            onMouseLeave={() => setShowBikesMenu(false)}
                        >
                            <button className="inline-flex items-center h-20 px-1 text-sm font-bold uppercase tracking-wider hover:text-gray-600 transition-colors relative z-50">
                                Bicicletas
                            </button>

                            {/* Normal Bikes Mega Menu */}
                            <div className={`transition-opacity duration-200 ${showBikesMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                {showBikesMenu && <MegaMenu type="bikes" onMouseLeave={() => setShowBikesMenu(false)} />}
                            </div>
                        </div>
                        <div
                            className="group"
                            onMouseEnter={() => setShowMegaMenu(true)}
                            onMouseLeave={() => setShowMegaMenu(false)}
                        >
                            <Link
                                to="/accesorios"
                                className="inline-flex items-center h-20 px-1 text-sm font-bold uppercase tracking-wider hover:text-gray-600 transition-colors relative z-50"
                            >
                                Accesorios
                            </Link>

                            {/* Mega Menu Container */}
                            <div className={`transition-opacity duration-200 ${showMegaMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                {showMegaMenu && <MegaMenu type="accessories" onMouseLeave={() => setShowMegaMenu(false)} />}
                            </div>
                        </div>

                    </nav>

                    {/* Utilities */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <button className="flex items-center text-xs font-bold uppercase tracking-wider hover:text-gray-600">
                            <Globe className="w-4 h-4 mr-1" />
                            ES
                        </button>
                        <a
                            href="https://www.google.com/maps/place/Proo+MTB+%26+Road/@18.472833,-69.9625717,17z/data=!3m1!4b1!4m6!3m5!1s0x8eaf8bf63c6292a5:0xeba7934faeefcc3a!8m2!3d18.4728279!4d-69.9599914!16s%2Fg%2F11rffl73cy?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 hover:text-gray-600"
                        >
                            <MapPin className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-gray-900 hover:text-gray-600"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Admin Dashboard Link */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-xs font-bold uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleUserClick}
                            className="text-gray-900 hover:text-gray-600 relative"
                        >
                            <User className={`w-5 h-5 ${user ? 'text-black fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-900 hover:text-gray-600 relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center ml-auto gap-4">
                        <button
                            onClick={handleUserClick}
                            className="text-gray-900 hover:text-gray-600 relative"
                        >
                            <User className={`w-5 h-5 ${user ? 'text-black fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-900 hover:text-gray-600 relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-900 hover:text-gray-600 p-2"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isAdmin={isAdmin} />

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
};

export default Header;
