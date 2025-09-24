import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandsStrip from './components/BrandsStrip';
import BestSellers from './components/BestSellers';
import Featured from './components/Featured';
import Recommended from './components/Recommended';
import Newsletter from './components/Newsletter';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import ProductDetail from './components/ProductDetail';
import LegalFooter from './components/LegalFooter';
// Importar páginas de políticas
import Devoluciones from './pages/policies/Devoluciones';
import Reembolsos from './pages/policies/Reembolsos';
import Cancelaciones from './pages/policies/Cancelaciones';
import Entregas from './pages/policies/Entregas';
import AdminProductsPanel from './components/AdminProductsPanel';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import WhatsAppButton from './components/WhatsAppButton';

// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/iniciar-sesion" replace />;
};

// Componente de ruta para invitados (no autenticados)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  
  return !user ? children : <Navigate to="/perfil" replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <div className="App">
          {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
          <div className={`transition-all duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={
                  <>
                    <Featured />
                    <BestSellers />
                    <Hero />
                    <BrandsStrip />
                    <Home />
                    <Recommended />
                    <Footer />
                    <LegalFooter />
                    <WhatsAppButton />
                  </>
                } />
                <Route path="/tienda" element={<Shop />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/test" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">Test Route Working!</h1></div>} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<AdminProductsPanel />} />
                <Route path="/checkout" element={<div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1><p>Página de pago en construcción</p></div>} />
                
                {/* Rutas de Políticas */}
                <Route path="/politicas/devoluciones" element={<Devoluciones />} />
                <Route path="/politicas/reembolsos" element={<Reembolsos />} />
                <Route path="/politicas/cancelaciones" element={<Cancelaciones />} />
                <Route path="/politicas/entregas" element={<Entregas />} />
                
                {/* Rutas de autenticación */}
                <Route
                  path="/iniciar-sesion"
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/registro"
                  element={
                    <GuestRoute>
                      <Signup />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/olvide-contrasena"
                  element={<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Restablecer contraseña</h2>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                      </p>
                      <form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <label htmlFor="email-address" className="sr-only">
                              Correo electrónico
                            </label>
                            <input
                              id="email-address"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                              placeholder="Correo electrónico"
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Enviar enlace
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>}
                />
                <Route
                  path="/restablecer-contrasena"
                  element={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                      <div className="max-w-md w-full space-y-8">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Nueva contraseña</h2>
                        <form className="mt-8 space-y-6">
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <label htmlFor="password" className="sr-only">
                                Nueva contraseña
                              </label>
                              <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Nueva contraseña"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirm-password" className="sr-only">
                                Confirmar contraseña
                              </label>
                              <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Confirmar contraseña"
                              />
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Restablecer contraseña
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  }
                />
                
                {/* Rutas protegidas */}
                <Route
                  path="/perfil"
                  element={
                    <PrivateRoute>
                      <Profile />
                      <LegalFooter />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/perfil/editar"
                  element={
                    <PrivateRoute>
                      <EditProfile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
