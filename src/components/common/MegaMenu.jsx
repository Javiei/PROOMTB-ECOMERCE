import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { menuData } from '../../config/menuConfig';
import useSeriesData from '../../hooks/useSeriesData';

const MegaMenu = ({ type = 'accessories', onMouseLeave }) => {
    const data = menuData[type] || menuData.accessories;
    const [activeCategory, setActiveCategory] = useState(data.categories[0].id);

    const shouldFetch = type === 'ebikes' || type === 'bikes';
    const { dbItems } = useSeriesData(shouldFetch);

    const currentCategory = data.categories.find(c => c.id === activeCategory) || data.categories[0];

    // Use DB items if available and type is ebikes or bikes, otherwise fall back to static
    // Filter DB items by current category
    const displayItems = (shouldFetch && dbItems.length > 0)
        ? dbItems.filter(item => item.categoryId === activeCategory)
        : currentCategory.items;

    return (
        <div
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transform transition-all duration-300 ease-in-out z-40"
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 min-h-[500px]">

                    {/* Sidebar / Categories */}
                    <div className="col-span-2 bg-gray-50 py-8 border-r border-gray-100">
                        <div className="flex flex-col space-y-1">
                            {data.categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onMouseEnter={() => setActiveCategory(cat.id)}
                                    className={`text-left px-8 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-between group transition-colors ${activeCategory === cat.id
                                        ? 'bg-white text-black border-l-4 border-black'
                                        : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                        }`}
                                >
                                    <span>{cat.label}</span>
                                    {activeCategory === cat.id && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 px-8">
                            <Link to={data.viewAllLink} className="text-xs font-bold uppercase tracking-widest text-black flex items-center hover:underline">
                                {data.viewAllLabel} <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="col-span-7 p-12">
                        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{currentCategory.label}</h3>
                                <p className="text-gray-500 text-sm">
                                    {currentCategory.desc || `Explora nuestra colección de ${currentCategory.label.toLowerCase()}.`}
                                </p>
                            </div>
                            <Link
                                to={`/category/${currentCategory.id}`}
                                className="text-xs font-bold uppercase tracking-widest text-black flex items-center hover:underline whitespace-nowrap ml-4 transition-all"
                                onClick={onMouseLeave}
                            >
                                Ver todas las {currentCategory.label} <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Render items if they exist (Series List) */}
                            {displayItems && displayItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.link}
                                    className="group flex flex-col items-center text-center p-4 hover:bg-gray-50 transition-all rounded-lg"
                                >
                                    <div className="relative w-full h-16 mb-2">
                                        <img
                                            src={item.image}
                                            alt={item.label}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
                                </Link>
                            ))}

                            {/* Fallback for Accessories or empty items */}
                            {!displayItems && type === 'accessories' && (
                                <div className="col-span-3 text-center py-12">
                                    <Link to={data.viewAllLink} className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                                        {data.viewAllLabel}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Promo Area */}
                    <Link to={data.viewAllLink} className="col-span-3 relative overflow-hidden group cursor-pointer block">
                        <img
                            src={data.bgImage}
                            alt="Promo"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-12 text-white">
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-2">{data.promoTitle}</h4>
                            <p className="text-sm font-medium mb-4 opacity-90">{data.promoText}</p>
                            <span className="text-xs font-bold uppercase tracking-widest flex items-center">
                                {data.promoLinkText} <ChevronRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
