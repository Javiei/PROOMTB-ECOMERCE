import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Globe, MapPin, X } from 'lucide-react';
import { menuData } from '../../config/menuConfig';
import useSeriesData from '../../hooks/useSeriesData';

const MobileMenu = ({ isOpen, onClose, isAdmin }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const { dbItems } = useSeriesData(isOpen);

    if (!isOpen) return null;

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
        setExpandedCategory(null); // Reset category when switching sections
    };

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const renderAccordion = (type, label) => {
        const data = menuData[type];
        const isExpanded = expandedSection === type;

        return (
            <div className="border-b border-gray-100">
                <button
                    onClick={() => toggleSection(type)}
                    className="flex items-center justify-between w-full px-4 py-4 text-lg font-bold uppercase"
                >
                    {label}
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {isExpanded && (
                    <div className="bg-gray-50 pb-4">
                        {data.categories.map((cat) => {
                            const isCatExpanded = expandedCategory === cat.id;
                            // Filter items from dbItems based on categoryId
                            const items = dbItems.filter(item => item.categoryId === cat.id);

                            return (
                                <div key={cat.id}>
                                    <button
                                        onClick={() => toggleCategory(cat.id)}
                                        className="flex items-center justify-between w-full px-8 py-3 text-sm font-bold uppercase text-gray-700 hover:text-black"
                                    >
                                        {cat.label}
                                        {isCatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>

                                    {isCatExpanded && (
                                        <div className="bg-gray-100 py-2">
                                            {items.length > 0 ? (
                                                items.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        to={item.link}
                                                        onClick={onClose}
                                                        className="block px-12 py-2 text-sm text-gray-600 hover:text-black"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-12 py-2 text-xs text-gray-500 italic">
                                                    No models available
                                                </div>
                                            )}
                                            <Link
                                                to={`/category/${cat.id}`}
                                                onClick={onClose}
                                                className="block px-12 py-2 text-xs font-bold uppercase text-black mt-2"
                                            >
                                                Ver todas {cat.label}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="px-8 pt-4">
                            <Link
                                to={data.viewAllLink}
                                onClick={onClose}
                                className="text-xs font-bold uppercase tracking-widest text-black flex items-center"
                            >
                                {data.viewAllLabel} <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="lg:hidden bg-white absolute top-20 left-0 w-full border-t border-gray-100 h-[calc(100vh-80px)] overflow-y-auto z-40">
            <div className="flex flex-col">
                {renderAccordion('ebikes', 'E-Bikes')}
                {renderAccordion('bikes', 'Bicicletas')}

                <Link
                    to="/accesorios"
                    onClick={onClose}
                    className="block px-4 py-4 text-lg font-bold uppercase border-b border-gray-100"
                >
                    Accesorios
                </Link>

                {isAdmin && (
                    <Link
                        to="/admin"
                        onClick={onClose}
                        className="block px-4 py-4 text-lg font-bold uppercase border-b border-gray-100 bg-gray-50 text-black"
                    >
                        Admin Dashboard
                    </Link>
                )}
            </div>

            <div className="px-4 py-8 space-y-4">
                <button className="flex items-center text-sm font-bold uppercase">
                    <Globe className="w-4 h-4 mr-2" />
                    ES
                </button>
                <a
                    href="https://www.google.com/maps/place/Proo+MTB+%26+Road/@18.472833,-69.9625717,17z/data=!3m1!4b1!4m6!3m5!1s0x8eaf8bf63c6292a5:0xeba7934faeefcc3a!8m2!3d18.4728279!4d-69.9599914!16s%2Fg%2F11rffl73cy?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-bold uppercase"
                >
                    <MapPin className="w-4 h-4 mr-2" />
                    Concesionarios
                </a>
            </div>
        </div>
    );
};

export default MobileMenu;
