import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, Check, Ruler, FileText } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/pagination';
import { slugify } from '../utils';

import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    // State Declarations
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [activeColorIndex, setActiveColorIndex] = useState(0);
    const [selectedFrame, setSelectedFrame] = useState(null);

    // Filter images based on selected color or frame
    const getDisplayedImages = () => {
        if (!product || !product.images || product.images.length === 0) return [];

        const hasFrames = product.tipos_marco && product.tipos_marco.length > 0;
        const hasColors = product.colores && product.colores.length > 0;

        // Synchronized formula based on user mapping (sets of 3)
        // Formula: (activeColorIndex * totalFrames + frameIndex) * 3
        if (hasFrames && hasColors) {
            const frameIndex = product.tipos_marco.indexOf(selectedFrame);
            const numFrames = product.tipos_marco.length;
            const start = (activeColorIndex * numFrames + (frameIndex >= 0 ? frameIndex : 0)) * 3;
            return product.images.slice(start, start + 3);
        }

        // Single factor filtering
        if (hasFrames) {
            const frameIndex = product.tipos_marco.indexOf(selectedFrame);
            const start = (frameIndex >= 0 ? frameIndex : 0) * 3;
            return product.images.slice(start, start + 3);
        }

        if (hasColors) {
            const start = activeColorIndex * 3;
            return product.images.slice(start, start + 3);
        }

        return product.images;
    };

    const displayedImages = getDisplayedImages();

    useEffect(() => {
        if (displayedImages.length > 0) {
            setActiveImage(displayedImages[0]);
        }
    }, [activeColorIndex, selectedFrame, product]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const isId = !isNaN(id);
            let matchedData = null;
            let matchedTable = '';

            // 1. Try finding in 'bicicletas'
            let queryBikes = supabase.from('bicicletas').select('*');
            if (isId) {
                queryBikes = queryBikes.eq('id', id);
            } else {
                const nameSearch = id.replace(/-/g, ' ');
                queryBikes = queryBikes.ilike('modelo', nameSearch);
            }

            const { data: bikeData } = await queryBikes.maybeSingle();

            if (bikeData) {
                matchedData = bikeData;
                matchedTable = 'bicicletas';
            } else {
                // 2. Try finding in 'products'
                let queryProds = supabase.from('products').select('*');
                if (isId) {
                    queryProds = queryProds.eq('id', id);
                } else {
                    const nameSearch = id.replace(/-/g, ' ');
                    queryProds = queryProds.ilike('name', nameSearch);
                }
                const { data: prodData } = await queryProds.maybeSingle();

                if (prodData) {
                    matchedData = prodData;
                    matchedTable = 'products';
                }
            }

            if (!matchedData) {
                setProduct(null);
            } else {
                const mappedProduct = matchedTable === 'bicicletas' ? {
                    ...matchedData,
                    name: matchedData.modelo,
                    price: matchedData.precio_eur,
                    description: matchedData.description,
                    images: matchedData.imagenes_urls || [],
                    image_url: matchedData.imagenes_urls?.[0] || null,
                    tipos_marco: matchedData.tipos_marco
                } : {
                    ...matchedData,
                    name: matchedData.name,
                    price: matchedData.price,
                    description: matchedData.description,
                    images: matchedData.image_url ? [matchedData.image_url] : [],
                    image_url: matchedData.image_url
                };

                setProduct(mappedProduct);

                if (mappedProduct.tipos_marco?.length > 0) {
                    setSelectedFrame(mappedProduct.tipos_marco[0]);
                }

                if (mappedProduct.serie_id) {
                    const { data: related } = await supabase
                        .from('bicicletas')
                        .select('id, modelo, precio_eur, imagenes_urls')
                        .eq('serie_id', mappedProduct.serie_id)
                        .neq('id', matchedData.id)
                        .limit(3);
                    if (related) setRelatedProducts(related);
                }
            }

        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div></div>;
    if (!product) return <div className="min-h-screen bg-white flex items-center justify-center">Producto no encontrado</div>;

    const mainName = product.name;
    const subName = '';

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <Helmet>
                <title>{mainName} | PROOMTB</title>
                <meta name="description" content={product?.description?.substring(0, 160) || `Descubre el ${mainName} en PROOMTB & ROAD.`} />

                {/* Open Graph / Facebook / WhatsApp */}
                <meta property="og:type" content="product" />
                <meta property="og:site_name" content="PROOMTB" />
                <meta property="og:title" content={`${mainName} | PROOMTB`} />
                <meta property="og:description" content={product?.description?.substring(0, 200) || `Consigue tu ${mainName} en nuestra tienda oficial.`} />
                <meta property="og:image" content={product?.image_url} />
                <meta property="og:image:secure_url" content={product?.image_url} />
                <meta property="og:url" content={window.location.href} />
                <meta property="product:price:amount" content={product?.price} />
                <meta property="product:price:currency" content="DOP" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${mainName} | PROOMTB`} />
                <meta name="twitter:description" content={product?.description?.substring(0, 200) || `Descubre el ${mainName} en PROOMTB.`} />
                <meta name="twitter:image" content={product?.image_url} />
            </Helmet>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">

                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link to="/accesorios" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 relative">
                        {/* Mobile Image Carousel */}
                        <div className="md:hidden w-full h-[400px] mb-8 bg-gray-50 rounded-3xl overflow-hidden relative">
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                spaceBetween={20}
                                slidesPerView={1}
                                className="w-full h-full"
                            >
                                {displayedImages.map((img, idx) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center p-8">
                                        <img
                                            src={img}
                                            alt={`${product?.name} view ${idx + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Desktop Image Gallery */}
                        <div className="hidden md:flex bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 h-[600px]">
                            {/* Thumbnails */}
                            <div className="hidden md:flex flex-col space-y-4 mr-8 overflow-y-auto max-h-full scrollbar-hide py-4">
                                {displayedImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === img ? 'border-black opacity-100' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1" loading="lazy" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <img
                                    src={activeImage || (product?.image_url)}
                                    alt={product?.name}
                                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-opacity duration-300"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-5 pt-4">
                        {/* Category / Breadcrumbs small */}
                        <div className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-medium">
                            Accesorios / {product?.category || 'General'}
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 text-black leading-none">
                            {mainName} <span className="text-gray-300">{subName}</span>
                        </h1>

                        {/* Description */}
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product?.description || "Diseñado para superar límites. Este accesorio combina funcionalidad premium con el estilo inconfundible de Raymon. Rendimiento sin compromisos."}
                        </p>

                        {/* Tech Specs Mock */}
                        <div className="flex items-center space-x-6 mb-12 text-sm text-gray-500 font-medium">
                            <div className="flex items-center"><span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2 text-xs">R</span> Original</div>
                            <div className="flex items-center"><Check className="w-4 h-4 mr-2" /> Stock disponible</div>
                        </div>

                        {/* Frame Type Selection */}
                        {product?.tipos_marco && product.tipos_marco.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Frame Type</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.tipos_marco.map((frame, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedFrame(frame)}
                                            className={`px-6 py-3 rounded-full border-2 text-sm font-bold uppercase transition-all ${selectedFrame === frame
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-black'
                                                }`}
                                        >
                                            {frame}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product?.colores && product.colores.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.colores.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveColorIndex(index)}
                                            className={`px-6 py-3 rounded-full border-2 text-sm font-bold uppercase transition-all ${activeColorIndex === index
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-black'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection Mock */}
                        <div className="mb-12">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">2. Choose Size(s)</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size
                                            ? 'border-2 border-black bg-white text-black'
                                            : 'border-gray-200 text-gray-500 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Links */}
                        <div className="flex space-x-8 mb-10 border-t border-b border-gray-100 py-6">
                            <button className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-gray-600">
                                <Ruler className="w-4 h-4 mr-2" /> Size Guide
                            </button>
                            <button className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-gray-600">
                                <FileText className="w-4 h-4 mr-2" /> Geometry
                            </button>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-black tracking-tight">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(product.price)}</div>
                            <button
                                onClick={() => addToCart({ ...product, selectedSize }, 1)}
                                className="bg-black text-white px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-transform transform hover:-translate-y-1"
                            >
                                Add to Cart
                            </button>
                        </div>

                    </div>
                </div>

                {/* Featured Large Image */}
                <div className="mt-32 w-full flex justify-center px-4">
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : product.image_url}
                        alt={product.name}
                        className="w-full max-w-7xl h-auto object-contain max-h-[800px] mix-blend-multiply"
                    />
                </div>

                {/* Technical Specifications Section */}
                <div className="mt-20 border-t border-gray-100 pt-20">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-20 text-black">
                        Especificaciones Técnicas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 max-w-6xl mx-auto">
                        {specsMapping.map((spec, index) => {
                            const value = product[spec.key];
                            if (!value) return null;

                            return (
                                <div key={index} className="flex flex-col border-b border-gray-100 pb-4">
                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-2 flex items-center gap-3">
                                        {spec.icon && <img src={spec.icon} alt="" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />}
                                        {spec.label}
                                    </span>
                                    <span className="font-bold text-lg text-black break-words">
                                        {spec.format ? spec.format(value) : value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 border-t border-gray-100 pt-20">
                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-16 text-black">
                            También te podría interesar
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {relatedProducts.map(p => (
                                <Link to={`/product/${slugify(p.modelo)}`} key={p.id} className="group block text-center" onClick={() => window.scrollTo(0, 0)}>
                                    <div className="bg-gray-50 rounded-3xl p-8 mb-6 relative aspect-[4/3] flex items-center justify-center transition-colors group-hover:bg-gray-100">
                                        <img
                                            src={p.imagenes_urls && p.imagenes_urls.length > 0 ? p.imagenes_urls[0] : p.imagen_url}
                                            alt={p.modelo}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="text-xl font-black uppercase mb-2">{p.modelo}</h4>
                                    <p className="text-gray-500 font-medium text-lg">
                                        {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(p.precio_eur)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// Specs Definition
const specsMapping = [
    { label: 'Cuadro', key: 'cuadro_material', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FRahmen.png&w=48&q=75' },
    { label: 'Horquilla', key: 'horquilla', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FFedergabel.png&w=48&q=75' },
    { label: 'Amortiguador', key: 'shock', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FD%C3%A4mpfer.png&w=48&q=75' },
    { label: 'Motor', key: 'motor_modelo', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FAntrieb.png&w=48&q=75' },
    { label: 'Batería', key: 'bateria_wh', format: (val) => `${val} Wh` },
    { label: 'Cargador', key: 'charger' },
    { label: 'Display', key: 'display' },
    { label: 'Frenos', key: 'frenos_modelo', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FBremse.png&w=48&q=75' },
    { label: 'Discos de Freno', key: 'brake_discs', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FBremsscheibe.png&w=48&q=75' },
    { label: 'Cambio', key: 'transmision_modelo', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FSchaltwerk.png&w=48&q=75' },
    { label: 'Maneta de Cambio', key: 'shifter', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FSchaltwerk.png&w=48&q=75' },
    { label: 'Cassette', key: 'cassette', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FZahnkranz.png&w=48&q=75' },
    { label: 'Cadena', key: 'chain', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FKette.png&w=48&q=75' },
    { label: 'Bielas', key: 'crank_arm' },
    { label: 'Plato', key: 'chainring' },
    { label: 'Ruedas', key: 'wheelset', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FFelge.png&w=48&q=75' },
    { label: 'Neumático Delantero', key: 'tire_f', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FReifen.png&w=48&q=75' },
    { label: 'Neumático Trasero', key: 'tire_r', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FReifen.png&w=48&q=75' },
    { label: 'Manillar', key: 'handlebar', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FLenker.png&w=48&q=75' },
    { label: 'Potencia', key: 'stem', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FVorbau.png&w=48&q=75' },
    { label: 'Sillín', key: 'saddle', icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FSattel.png&w=48&q=75' },
    { label: 'Tija', key: 'tija_telescopica' },
    { label: 'Pedales', key: 'pedals' },
    { label: 'Peso', key: 'peso_kg', format: (val) => `${val} kg`, icon: 'https://www.raymon-bicycles.com/_next/image?url=%2Ficons%2Fausstattungen%2FGewicht.png&w=48&q=75' },
];

export default ProductDetail;
