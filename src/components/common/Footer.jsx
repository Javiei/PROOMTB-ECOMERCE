import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import proomtbLogo from '../../assets/LOGO PRO MTB AND ROAD VECTORES CORREGIDOS.pdf.png';
import raymonLogo from '../../assets/Raymon_logo_black schriftzug.png';

const Footer = () => {
    return (
        <footer className="bg-white text-black py-16 border-t border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-sm">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-4">
                            <img src={proomtbLogo} alt="Proomtb Logo" className="h-12 w-auto object-contain" />
                            <div className="h-8 w-px bg-gray-300"></div>
                            <img src={raymonLogo} alt="Raymon Logo" className="h-8 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-600">
                            Bicicletas diseñadas para cada camino.<br />
                            Ingeniería alemana. Pasión global.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-900 transition-colors"><Instagram className="w-5 h-5 text-gray-600 hover:text-black" /></a>
                            <a href="#" className="hover:text-gray-900 transition-colors"><Facebook className="w-5 h-5 text-gray-600 hover:text-black" /></a>
                            <a href="#" className="hover:text-gray-900 transition-colors"><Youtube className="w-5 h-5 text-gray-600 hover:text-black" /></a>
                        </div>
                    </div>

                    {/* Column 2: E-Bikes */}
                    <div>
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-black">E-Bikes</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li><Link to="/category/e-mtb" className="hover:text-black transition-colors">E-MTB</Link></li>
                            <li><Link to="/category/e-trekking" className="hover:text-black transition-colors">E-Trekking</Link></li>
                            <li><Link to="/category/e-city" className="hover:text-black transition-colors">E-City</Link></li>
                            <li><Link to="/ebikes" className="hover:text-black transition-colors">Ver todas</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Bikes */}
                    <div>
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-black">Bicicletas</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li><Link to="/category/mtb" className="hover:text-black transition-colors">Mountain Bike (MTB)</Link></li>
                            <li><Link to="/category/gravel" className="hover:text-black transition-colors">Gravel</Link></li>
                            <li><Link to="/category/trekking" className="hover:text-black transition-colors">Trekking</Link></li>
                            <li><Link to="/accesorios" className="hover:text-black transition-colors">Accesorios</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; 2025 Proomtb & Raymon Bicycles. Todos los derechos reservados.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-black">Privacidad</a>
                        <a href="#" className="hover:text-black">Imprint</a>
                        <a href="#" className="hover:text-black">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
