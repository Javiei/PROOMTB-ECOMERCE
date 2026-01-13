import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import { Link } from 'react-router-dom';
import LoadingScreen from './components/common/LoadingScreen';
import Home from './pages/Home';
import Accessories from './pages/Accessories';
import AllEBikes from './pages/AllEBikes';
import ProductDetail from './pages/ProductDetail';
import SeriesDetail from './pages/series-details/SeriesDetail';
import SeriesDetailRavor from './pages/series-details/SeriesDetailRavor';
import SeriesDetailVantor from './pages/series-details/SeriesDetailVantor';
import SeriesDetailTrailray from './pages/series-details/SeriesDetailTrailray';
import SeriesDetailHardRay from './pages/series-details/SeriesDetailHardRay';
import SeriesDetailVamok from './pages/series-details/SeriesDetailVamok';
import SeriesDetailKorak from './pages/series-details/SeriesDetailKorak';
import SeriesDetailAirok from './pages/series-details/SeriesDetailAirok';
import SeriesDetailNorza from './pages/series-details/SeriesDetailNorza';
import SeriesDetailTavano from './pages/series-details/SeriesDetailTavano';
import SeriesDetailTahona from './pages/series-details/SeriesDetailTahona'; // Tahona Series
import SeriesDetailMetmo from './pages/series-details/SeriesDetailMetmo'; // Metmo Series
import SeriesDetailArva from './pages/series-details/SeriesDetailArva';
import SeriesDetailKirana from './pages/series-details/SeriesDetailKirana';
import SeriesDetailSoreno from './pages/series-details/SeriesDetailSoreno';
import SeriesDetailTerrit from './pages/series-details/SeriesDetailTerrit';
import SeriesDetailZayn from './pages/series-details/SeriesDetailZayn';
import SeriesDetailRokua from './pages/series-details/SeriesDetailRokua';
import SeriesDetailYara from './pages/series-details/SeriesDetailYara';
import SeriesDetailArid from './pages/series-details/SeriesDetailArid';
import SeriesDetailNayta from './pages/series-details/SeriesDetailNayta';

// Admin Components
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './components/admin/ProductForm';

// User Components
import PrivateRoute from './components/auth/PrivateRoute';
import UserProfile from './pages/UserProfile';

import ScrollToTop from './components/common/ScrollToTop';
import PageTitleUpdater from './components/common/PageTitleUpdater';
import SearchResults from './pages/SearchResults';

function App() {
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Simulate initial loading or wait for resources
  const handleLoadingComplete = () => {
    setIsFading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700); // Match duration with CSS transition
  };



  // ...

  return (
    <HelmetProvider>
      <Router>
        <PageTitleUpdater />
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-white">
              {loading && (
                <LoadingScreen
                  onComplete={handleLoadingComplete}
                  isFading={isFading}
                />
              )}

              <Header />
              <div className="flex-grow pt-20"> {/* Add padding for fixed header */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/accesorios" element={<Accessories />} />
                  <Route path="/catalogo" element={<AllEBikes />} />
                  <Route path="/ebikes" element={<AllEBikes />} />
                  <Route path="/category/:categorySlug" element={<AllEBikes />} />
                  <Route path="/serie/:serieId" element={<SeriesDetail />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/series/ravor" element={<SeriesDetailRavor />} />
                  <Route path="/series/vantor" element={<SeriesDetailVantor />} />
                  <Route path="/series/trailray" element={<SeriesDetailTrailray />} />
                  <Route path="/series/hardray" element={<SeriesDetailHardRay />} />
                  <Route path="/series/vamok" element={<SeriesDetailVamok />} />
                  <Route path="/series/korak" element={<SeriesDetailKorak />} />
                  <Route path="/series/airok" element={<SeriesDetailAirok />} />
                  <Route path="/series/norza" element={<SeriesDetailNorza />} />
                  <Route path="/series/tavano" element={<SeriesDetailTavano />} />
                  <Route path="/series/tahona" element={<SeriesDetailTahona />} />
                  <Route path="/series/metmo" element={<SeriesDetailMetmo />} />
                  <Route path="/series/arva" element={<SeriesDetailArva />} />
                  <Route path="/series/kirana" element={<SeriesDetailKirana />} />
                  <Route path="/series/soreno" element={<SeriesDetailSoreno />} />
                  <Route path="/series/territ" element={<SeriesDetailTerrit />} />
                  <Route path="/series/zayn" element={<SeriesDetailZayn />} />
                  <Route path="/series/rokua" element={<SeriesDetailRokua />} />
                  <Route path="/series/yara" element={<SeriesDetailYara />} />
                  <Route path="/series/arid" element={<SeriesDetailArid />} />
                  <Route path="/series/arid" element={<SeriesDetailArid />} />
                  <Route path="/series/nayta" element={<SeriesDetailNayta />} />
                  <Route path="/search" element={<SearchResults />} />

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="bikes" element={<ProductList type="bikes" />} />
                      <Route path="bikes/new" element={<ProductForm type="bikes" />} />
                      <Route path="bikes/edit/:id" element={<ProductForm type="bikes" />} />

                      <Route path="accessories" element={<ProductList type="accessories" />} />
                      <Route path="accessories/new" element={<ProductForm type="accessories" />} />
                      <Route path="accessories/edit/:id" element={<ProductForm type="accessories" />} />

                      <Route path="products" element={<ProductList />} /> {/* Fallback */}
                    </Route>
                  </Route>

                  {/* User Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<UserProfile />} />
                  </Route>
                </Routes>
              </div>
              <Footer />
            </div >
          </CartProvider>
        </AuthProvider>
        <WhatsAppButton />
      </Router>
    </HelmetProvider>
  );
}

export default App;
