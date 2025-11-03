import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/Diseño sin título (17) (1).png';
import CartIcon from './CartIcon';
import UserMenu from './UserMenu';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const location = useLocation();
  let dynamicTitle = '';
  // Detectar si estamos en la ruta de producto y extraer el nombre
  const productoMatch = location.pathname.match(/\/producto\/([^/]+)/);
  const navidadMatch = location.pathname.match(/\/navidad\/[^/]+\/([^/]+)/);
  // Obtener el nombre real del producto si está en el state de navegación
  const [resolvedTitle, setResolvedTitle] = React.useState('');
  let productNameFromState = location.state && location.state.productName;
  let fallbackSlug = '';
  let productId = null;
  if (productoMatch) {
    fallbackSlug = decodeURIComponent(productoMatch[1].replace(/-/g, ' '));
    // Buscar el ID del producto si está en la URL (por ejemplo, /producto/:slug?id=123)
    const searchParams = new URLSearchParams(location.search);
    productId = searchParams.get('id');
  } else if (navidadMatch) {
    fallbackSlug = decodeURIComponent(navidadMatch[1].replace(/-/g, ' '));
    // Para navidad, el ID está en la URL
    const navidadIdMatch = location.pathname.match(/\/navidad\/([^/]+)/);
    if (navidadIdMatch) productId = navidadIdMatch[1];
  }

  React.useEffect(() => {
    let isMounted = true;
    if (productNameFromState) {
      setResolvedTitle(productNameFromState);
    } else if (productId) {
      // Detectar tabla según la ruta
      let table = 'products';
      let nameField = 'name';
      if (location.pathname.startsWith('/navidad/')) {
        table = 'bikes_navidad_2025';
        nameField = 'nombre';
      }
      import('../supabaseClient').then(({ supabase }) => {
        supabase
          .from(table)
          .select(nameField)
          .eq('id', productId)
          .single()
          .then(({ data }) => {
            if (isMounted) setResolvedTitle(data?.[nameField] || fallbackSlug);
          })
          .catch(() => {
            if (isMounted) setResolvedTitle(fallbackSlug);
          });
      });
    } else {
      setResolvedTitle(fallbackSlug);
    }
    return () => { isMounted = false; };
  }, [productNameFromState, productId, fallbackSlug]);

  React.useEffect(() => {
    // Títulos personalizados por ruta
    let pageTitle = 'PROOMTB';
    
    // Si estamos en una página de detalle de producto navideño
    if (navidadMatch) {
      // Usar el nombre del producto directamente del estado de navegación
      if (location.state?.product) {
        pageTitle = `${location.state.product.nombre} | PROOMTB`;
      } else if (resolvedTitle) {
        // Si no hay estado, usar el título resuelto
        pageTitle = `${resolvedTitle} | PROOMTB`;
      }
    } 
    // Si es un producto normal
    else if (productoMatch) {
      if (location.state?.product) {
        pageTitle = `${location.state.product.name} | PROOMTB`;
      } else if (resolvedTitle) {
        pageTitle = `${resolvedTitle} | PROOMTB`;
      }
    }
    // Otras rutas
    else if (location.pathname.startsWith('/tienda')) {
      pageTitle = 'TIENDA | PROOMTB';
    } else if (location.pathname.startsWith('/ofertas-navidad')) {
      pageTitle = 'OFERTAS DE NAVIDAD | PROOMTB';
    } else if (location.pathname.startsWith('/nosotros')) {
      pageTitle = 'NOSOTROS | PROOMTB';
    } else if (location.pathname.startsWith('/admin')) {
      pageTitle = 'ADMIN | PROOMTB';
    } else if (location.pathname.startsWith('/checkout')) {
      pageTitle = 'CHECKOUT | PROOMTB';
    }
    
    document.title = pageTitle;
  }, [resolvedTitle, location.pathname, location.state, productoMatch, navidadMatch]);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sincronizar el término de búsqueda con la URL
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    // Actualizar el estado solo si el parámetro de búsqueda en la URL es diferente al estado actual
    // y no estamos en medio de una edición del usuario
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]); // Eliminamos searchTerm de las dependencias

  const handleCategoryClick = (category) => {
    // Navegar a la tienda con el filtro de categoría
    navigate(`/tienda?category=${encodeURIComponent(category)}`);
    setActiveDropdown(null); // Cerrar el dropdown después de hacer clic
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    // Usar navigate para actualizar la URL sin recargar la página
    if (trimmedSearch) {
      // Si ya estamos en la página de tienda, usa replace: false para permitir la navegación hacia atrás
      navigate(`/tienda?search=${encodeURIComponent(trimmedSearch)}`, { 
        replace: window.location.pathname === '/tienda' 
      });
    } else {
      navigate('/tienda', { 
        replace: window.location.pathname === '/tienda' 
      });
    }
    
    setShowSearch(false);
  };
  
  // Manejar la tecla Enter en el input de búsqueda
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };
  
  // Manejar el clic en el botón de búsqueda
  const handleSearchClick = (e) => {
    e.preventDefault();
    handleSearch(e);
  };

  const bikeCategories = [
    { name: 'MTB', category: 'MTB' },
    { name: 'Ruta', category: 'Ruta' },
    { name: 'Urbana', category: 'Urbana' },
    { name: 'Eléctrica', category: 'Eléctrica' }
  ];

  const accessoryCategories = [
    // Cuidado y Mantenimiento
    { name: 'Lavado', category: 'Lavado' },
    { name: 'Rolos', category: 'Rolos' },
    { name: 'Cremas', category: 'Cremas' },
    { name: 'Bombas y CO2', category: 'Bombas y CO2' },
    { name: 'Herramientas y Aceites', category: 'Herramientas y Aceites' },
    { name: 'Cintas de Timón', category: 'Cintas de Timón' },
    { name: 'Protectores de Bicicletas', category: 'Protectores de Bicicletas' },
    { name: 'Guardalodos', category: 'Guardalodos' },
    
    // Electrónicos
    { name: 'Milleros', category: 'Milleros' },
    { name: 'Ciclo Computadoras GPS', category: 'Ciclo Computadoras GPS' },
    { name: 'Relojes GPS', category: 'Relojes GPS' },
    { name: 'Sensores', category: 'Sensores' },
    { name: 'Luces', category: 'Luces' },
    
    // Protección y Ropa
    { name: 'Cascos', category: 'Cascos' },
    { name: 'Guantillas', category: 'Guantillas' },
    { name: 'Gafas', category: 'Gafas' },
    { name: 'Protecciones', category: 'Protecciones' },
    
    // Accesorios
    { name: 'Nutrición', category: 'Nutrición' },
    { name: 'Bulticos y Mochilas', category: 'Bulticos y Mochilas' },
    { name: 'Termeras', category: 'Termeras' },
    { name: 'Termos', category: 'Termos' },
    { name: 'Puños', category: 'Puños' },
    { name: 'Porta Bicicletas y Burros', category: 'Porta Bicicletas y Burros' }
  ];

  const messages = [
    "DESCUENTO DE EL 10%",
    "ENVÍO DESDE LOS 500 RD$",
    "PROOMTB BIKE & ROAD",
    "DESCUENTO DE EL 10%",
    "ENVÍO DESDE LOS 500 RD$",
    "PROOMTB BIKE & ROAD",
    "DESCUENTO DE EL 10%",
    "ENVÍO DESDE LOS 500 RD$",
    "PROOMTB BIKE & ROAD"
    
  ];

  // Create a continuous loop of all messages for the marquee
  const allMessages = [...messages, ...messages]; // Duplicate messages for smooth looping

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top marquee message bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-2 overflow-hidden">
        <div className="relative">
          <div className="animate-marquee whitespace-nowrap">
            {allMessages.map((message, index) => (
              <span key={index} className="inline-block mx-8 text-sm font-medium text-white">
                {message}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add custom animation for marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main header */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8" ref={dropdownRef}>
              <Link to="/tienda" className="text-white hover:text-purple-400 transition-colors font-medium">TIENDA</Link>
              

              {/* Christmas Offers */}
              <Link 
                to="/ofertas-navidad" 
                className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-md text-white font-bold text-sm flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2 text-yellow-300 animate-pulse">🎄</span>
                  <span className="relative">
                    OFERTAS NAVIDEÑAS
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </span>
                <span className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <span className="absolute -inset-1 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></span>
              </Link>

              {/* Bikes Dropdown */}
              <div className="relative group">
                <button 
                  className="text-white hover:text-purple-400 transition-colors font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('bikes')}
                >
                  BIKES
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'bikes' && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {bikeCategories.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(item.category)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Accessories Dropdown */}
              <div className="relative group">
                <button 
                  className="text-white hover:text-purple-400 transition-colors font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('accessories')}
                >
                  ACCESORIES
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'accessories' && (
                  <div 
                    className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 overflow-hidden"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 text-sm">Cuidado y Mantenimiento</h4>
                      </div>
                      {accessoryCategories.slice(0, 8).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategoryClick(item.category)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                        >
                          {item.name}
                        </button>
                      ))}
                      
                      <div className="bg-gray-50 px-4 py-2 border-b border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 text-sm">Electrónicos</h4>
                      </div>
                      {accessoryCategories.slice(8, 13).map((item, index) => (
                        <button
                          key={index + 8}
                          onClick={() => handleCategoryClick(item.category)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                        >
                          {item.name}
                        </button>
                      ))}
                      
                      <div className="bg-gray-50 px-4 py-2 border-b border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 text-sm">Protección y Ropa</h4>
                      </div>
                      {accessoryCategories.slice(13, 17).map((item, index) => (
                        <button
                          key={index + 13}
                          onClick={() => handleCategoryClick(item.category)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                        >
                          {item.name}
                        </button>
                      ))}
                      
                      <div className="bg-gray-50 px-4 py-2 border-b border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 text-sm">Accesorios</h4>
                      </div>
                      {accessoryCategories.slice(17).map((item, index) => (
                        <button
                          key={index + 17}
                          onClick={() => handleCategoryClick(item.category)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right side navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/nosotros" className="text-white hover:text-purple-400 transition-colors font-medium">NOSOTROS</Link>
              
              {/* WhatsApp Contact */}
              <div className="flex items-center space-x-2">
                <a 
                  href="https://wa.me/18297163555"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center group"
                  aria-label="Contactar por WhatsApp"
                  title="Contáctanos por WhatsApp"
                >
                  <div className="bg-green-500 rounded-full p-1.5 group-hover:bg-green-600 transition-colors flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      fill="currentColor" 
                      className="bi bi-whatsapp text-white" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                  </div>
                  <div className="ml-2 text-left">
                    <div className="text-white text-xs font-medium">CONTACTO</div>
                    <div className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                      +1 (829) 716-3555
                    </div>
                  </div>
                </a>
              </div>
              
              {/* Search Icon and Input */}
              <div className="relative">
                <button
                  className="text-white hover:text-purple-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSearch(prev => !prev);
                  }}
                  aria-label="Buscar"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {showSearch && (
                  <form
                    className="absolute right-0 mt-2 bg-white rounded shadow-lg flex items-center z-50 p-2"
                    onSubmit={handleSearch}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="border border-gray-300 rounded px-3 py-1 text-gray-900 focus:outline-none focus:ring focus:border-blue-400 text-sm w-64 min-w-0"
                      placeholder="Buscar productos..."
                      onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                    />
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                      onClick={handleSearchClick}
                    >
                      Buscar
                    </button>
                  </form>
                )}
              </div>
              
              {/* Cart Icon */}
              <CartIcon onUnauthorized={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }} />
              
              {/* User Menu or Login Icon */}
              <div className="ml-4 relative">
                <button
                  onClick={() => {
                    if (user) {
                      // User is logged in, UserMenu will handle the click
                      return;
                    }
                    // Show login/signup modal when not logged in
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-white hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center"
                  aria-label={user ? 'Ver perfil' : 'Iniciar sesión'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </button>
                {user && <UserMenu />}
                
                {/* Auth Modal */}
                <AuthModal 
                  isOpen={isAuthModalOpen}
                  onClose={() => {
                    setIsAuthModalOpen(false);
                    setAuthModalTab('login');
                  }}
                  initialTab={authModalTab}
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-4">
              {/* Search Icon - Mobile */}
              <div className="md:hidden relative">
                <form
                  className="bg-white rounded flex items-center p-1 w-48"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-0 rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-0 text-sm w-full"
                    placeholder="Buscar..."
                  />
                  <button
                    type="button"
                    onClick={handleSearchClick}
                    className="ml-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
              
              <button 
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

            {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
              <div className="flex flex-col space-y-3">
                <Link to="/tienda" className="text-white hover:text-purple-400 transition-colors font-medium">TIENDA</Link>
                
                {/* Mobile Bikes Dropdown */}
                <div className="pl-4">
                  <button 
                    className="text-white hover:text-purple-400 transition-colors font-medium flex items-center"
                    onClick={() => setActiveDropdown(activeDropdown === 'mobile-bikes' ? null : 'mobile-bikes')}
                  >
                    BIKES
                    <svg className={`w-4 h-4 ml-1 transform transition-transform ${activeDropdown === 'mobile-bikes' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'mobile-bikes' && (
                    <div className="mt-2 ml-4 space-y-2">
                      {bikeCategories.map((item, index) => (
                        <a 
                          key={index} 
                          href={item.href}
                          className="block text-gray-300 hover:text-purple-400 text-sm py-1"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Mobile Accessories Dropdown */}
                <div className="pl-4">
                  <button 
                    className="text-white hover:text-purple-400 transition-colors font-medium flex items-center"
                    onClick={() => setActiveDropdown(activeDropdown === 'mobile-accessories' ? null : 'mobile-accessories')}
                  >
                    ACCESORIES
                    <svg className={`w-4 h-4 ml-1 transform transition-transform ${activeDropdown === 'mobile-accessories' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'mobile-accessories' && (
                    <div className="mt-2 ml-4 space-y-2">
                      {accessoryCategories.map((item, index) => (
                        <a 
                          key={index} 
                          href={item.href}
                          className="block text-gray-300 hover:text-purple-400 text-sm py-1"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link to="/nosotros" className="text-white hover:text-purple-400 transition-colors font-medium">NOSOTROS</Link>
                <div className="pt-4 border-t border-gray-700">
                  <CartIcon onUnauthorized={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }} />
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
