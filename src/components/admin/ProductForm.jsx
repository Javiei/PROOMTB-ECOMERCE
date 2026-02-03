import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure path is correct relative to where you save this
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X, Loader2, Trash2 } from 'lucide-react';
import { SERIES_CONFIG } from '../../config/menuConfig';

const ProductForm = ({ type }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const tableName = type === 'bikes' ? 'bicicletas' : 'products';

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State matching your DB schema usage
    const [formData, setFormData] = useState({
        name: '',
        modelo: '',
        description: '',
        price: '', // Accessories
        precio_eur: '', // Bikes
        category_id: type === 'bikes' ? 'e-mtb' : 'accessories',
        serie_id: '',
        image_url: '',
        imagenes_urls: [],
        sizes: [], // Array of { size: 'M', price: 1200 }
        colores: [],
        tipos_marco: [],
        specs: {},
        // Individual spec fields for easier form handling
        cuadro_material: '',
        horquilla: '',
        shock: '',
        motor_modelo: '',
        bateria_wh: '',
        charger: '',
        display: '',
        frenos_modelo: '',
        brake_discs: '',
        transmision_modelo: '',
        shifter: '',
        cassette: '',
        chain: '',
        crank_arm: '',
        chainring: '',
        wheelset: '',
        tire_f: '',
        tire_r: '',
        handlebar: '',
        stem: '',
        saddle: '',
        tija_telescopica: '',
        pedals: '',
        peso_kg: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            // Handle Sizes and Prices zipping for Bikes
            let mappedSizes = [];
            if (type === 'bikes') {
                const dbSizes = Array.isArray(data.sizes) ? data.sizes : [];
                const dbPrices = Array.isArray(data.precio_eur) ? data.precio_eur : [];

                // Zip parallel arrays
                mappedSizes = dbSizes.map((s, i) => ({
                    size: s || '',
                    price: dbPrices[i] || ''
                }));
            } else {
                // Logic for accessories (objects or arrays of objects)
                let rawSizes = data.sizes || [];
                if (typeof rawSizes === 'string') {
                    try { rawSizes = JSON.parse(rawSizes); } catch (e) { rawSizes = []; }
                }
                if (!Array.isArray(rawSizes)) rawSizes = [];
                mappedSizes = rawSizes.map(s => ({
                    size: s.size || s.talla || s.Size || '',
                    price: s.price ?? s.precio ?? s.precio_eur ?? s.Price ?? ''
                }));
            }

            // Get global price (normalize to string/number from potential array)
            const rawGlobalPrice = type === 'bikes' ? data.precio_eur : data.price;
            const dbPriceValue = Array.isArray(rawGlobalPrice) ? rawGlobalPrice[0] : rawGlobalPrice;
            const finalGlobalPrice = dbPriceValue || (mappedSizes.length > 0 ? mappedSizes[0].price : '');

            setFormData({
                ...data,
                name: data.name || data.modelo || '',
                precio_eur: type === 'bikes' ? finalGlobalPrice : data.precio_eur,
                price: type !== 'bikes' ? finalGlobalPrice : data.price,
                // Ensure arrays/objects are initialized if null
                imagenes_urls: data.imagenes_urls || [],
                sizes: mappedSizes,
                colores: data.colores || [],
                tipos_marco: data.tipos_marco || [],
                specs: data.specs || {},
                // Map flat fields from DB
                cuadro_material: data.cuadro_material || '',
                horquilla: data.horquilla || '',
                shock: data.shock || '',
                motor_modelo: data.motor_modelo || '',
                bateria_wh: data.bateria_wh || '',
                charger: data.charger || '',
                display: data.display || '',
                frenos_modelo: data.frenos_modelo || '',
                brake_discs: data.brake_discs || '',
                transmision_modelo: data.transmision_modelo || '',
                shifter: data.shifter || '',
                cassette: data.cassette || '',
                chain: data.chain || '',
                crank_arm: data.crank_arm || '',
                chainring: data.chainring || '',
                wheelset: data.wheelset || '',
                tire_f: data.tire_f || '',
                tire_r: data.tire_r || '',
                handlebar: data.handlebar || '',
                stem: data.stem || '',
                saddle: data.saddle || '',
                tija_telescopica: data.tija_telescopica || '',
                pedals: data.pedals || '',
                peso_kg: data.peso_kg || ''
            });
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode && id) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEditMode, tableName]);

    // Sync Global Price with the first variant's price
    useEffect(() => {
        const globalPriceKey = type === 'bikes' ? 'precio_eur' : 'price';
        if (formData.sizes?.length > 0) {
            const firstVariantPrice = formData.sizes[0].price;

            if (firstVariantPrice && firstVariantPrice !== formData[globalPriceKey]) {
                setFormData(prev => ({
                    ...prev,
                    [globalPriceKey]: firstVariantPrice
                }));
            }
        }
    }, [formData.sizes, type, formData.precio_eur, formData.price]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-set category_id if serie_id changes for bikes
            if (name === 'serie_id' && type === 'bikes') {
                // Find the series key based on the selected ID (value)
                // NOTE: SERIES_CONFIG keys are the IDs. simpler lookup.
                // Wait, in the dropdown mapped value is the KEY of SERIES_CONFIG? 
                // Previous code: value={Object.keys(SERIES_CONFIG).find(key => SERIES_CONFIG[key].id === series.id)}
                // Wait, SERIES_CONFIG keys are integers '1', '2'. SERIES_CONFIG[1].id is 'ravor'.
                // The option value in previous step was complex. Let's simplifiy/verify the option value.
                // If the option value is the KEY (e.g. '1', '2'), we can look up directly.

                const seriesConfig = SERIES_CONFIG[value];
                if (seriesConfig) {
                    newData.category_id = seriesConfig.categoryId;
                }
            }
            return newData;
        });
    };

    // Handle Image Upload to Supabase Storage
    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('bicicletas')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('bicicletas')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const newPublicUrls = await Promise.all(uploadPromises);

            if (type !== 'bikes') {
                setFormData(prev => ({ ...prev, image_url: newPublicUrls[0] }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    imagenes_urls: [...prev.imagenes_urls, ...newPublicUrls]
                }));
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            imagenes_urls: prev.imagenes_urls.filter((_, index) => index !== indexToRemove)
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...(prev.sizes || []), { size: '', price: '' }]
        }));
    };

    const updateVariant = (index, field, value) => {
        setFormData(prev => {
            const newSizes = [...prev.sizes];
            newSizes[index] = { ...newSizes[index], [field]: value };
            return { ...prev, sizes: newSizes };
        });
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    // Generic Array Handlers for Colors and Frames
    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), '']
        }));
    };

    const updateArrayItem = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Construct payload based on table columns
            let payload = {};

            if (type === 'bikes') {
                // Table: bicicletas
                payload = {
                    modelo: formData.name || formData.modelo,
                    description: formData.description,
                    image_url: formData.imagenes_urls[0] || null, // Primary legacy field
                    imagenes_urls: formData.imagenes_urls,
                    // Unzip parallel arrays for Bikes
                    sizes: formData.sizes.map(v => v.size),
                    precio_eur: formData.sizes.map(v => v.price),
                    serie_id: formData.serie_id ? parseInt(formData.serie_id) : null,
                    colores: formData.colores,
                    tipos_marco: formData.tipos_marco,
                    // Flat fields for DB
                    cuadro_material: formData.cuadro_material,
                    horquilla: formData.horquilla,
                    shock: formData.shock,
                    motor_modelo: formData.motor_modelo,
                    bateria_wh: formData.bateria_wh ? parseInt(formData.bateria_wh) : null,
                    charger: formData.charger,
                    display: formData.display,
                    frenos_modelo: formData.frenos_modelo,
                    brake_discs: formData.brake_discs,
                    transmision_modelo: formData.transmision_modelo,
                    shifter: formData.shifter,
                    cassette: formData.cassette,
                    chain: formData.chain,
                    crank_arm: formData.crank_arm,
                    chainring: formData.chainring,
                    wheelset: formData.wheelset,
                    tire_f: formData.tire_f,
                    tire_r: formData.tire_r,
                    handlebar: formData.handlebar,
                    stem: formData.stem,
                    saddle: formData.saddle,
                    tija_telescopica: formData.tija_telescopica,
                    pedals: formData.pedals,
                    peso_kg: formData.peso_kg ? parseFloat(formData.peso_kg) : null,
                    specs: formData.specs, // Keep original specs object if still used
                    category_id: formData.category_id // Mapped from series 
                };
            } else {
                // Table: products
                payload = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price) || 0,
                    category_id: formData.category_id,
                    image_url: formData.image_url,
                    sizes: (formData.sizes || []).map(s => ({
                        size: s.size,
                        price: parseFloat(s.price) || 0
                    }))
                };
            }

            let error;
            if (isEditMode) {
                const { error: updateError } = await supabase
                    .from(tableName)
                    .update(payload)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from(tableName)
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            navigate(type === 'bikes' ? '/admin/bikes' : '/admin/accessories');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'accessories', label: 'Accessories' },
        { id: 'e-mtb', label: 'E-MTB' },
        { id: 'e-city', label: 'E-City' },
        { id: 'e-trekking', label: 'E-Trekking' },
        { id: 'road', label: 'Road' },
        { id: 'gravel', label: 'Gravel' },
        { id: 'kids', label: 'Kids' },
    ];

    if (loading && isEditMode && (!formData.name && !formData.modelo)) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(type === 'bikes' ? '/admin/bikes' : '/admin/accessories')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                    {isEditMode ? 'Edit Product' : 'New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-black border-b border-gray-50 pb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Name / Model</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">
                                Global Price ({type === 'bikes' ? 'USD' : 'RD$'})
                            </label>
                            <input
                                type="number"
                                name={type === 'bikes' ? 'precio_eur' : 'price'}
                                step="0.01"
                                value={(type === 'bikes' ? formData.precio_eur : formData.price) || ''}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {type === 'bikes' ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Series</label>
                                <select
                                    name="serie_id"
                                    value={formData.serie_id || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all"
                                >
                                    <option value="">Select Series</option>
                                    {Object.entries(SERIES_CONFIG).map(([key, series]) => (
                                        <option key={key} value={key}>
                                            {series.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id || 'accessories'}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all"
                                >
                                    {categories
                                        .filter(cat => cat.id === 'accessories')
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Weight (kg)</label>
                            <input
                                type="number"
                                name="peso_kg"
                                step="0.1"
                                value={formData.peso_kg || ''}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all"
                                placeholder="e.g. 24.5"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black resize-none transition-all"
                        />
                    </div>
                </div>

                {/* Variants & Colors Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sizes & Prices Variants */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <h2 className="text-lg font-bold uppercase tracking-wider text-black">Sizes & Prices</h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="text-[10px] font-black uppercase bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                + Add Variant
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.sizes?.map((variant, idx) => (
                                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Size (S, M, 42...)"
                                            value={variant.size}
                                            onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                                            className="w-full bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                            className="w-full bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!formData.sizes || formData.sizes.length === 0) && (
                                <div className="text-center py-6 text-gray-400 text-xs italic">
                                    No variants added. Global price will be used.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Colors & Frames */}
                    <div className="space-y-8">
                        {/* Colors */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                <h2 className="text-lg font-bold uppercase tracking-wider text-black">Colors</h2>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('colores')}
                                    className="text-[10px] font-black uppercase bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
                                >
                                    + Add Color
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.colores?.map((color, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={color}
                                            placeholder="Color name..."
                                            onChange={(e) => updateArrayItem('colores', idx, e.target.value)}
                                            className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                        />
                                        <button type="button" onClick={() => removeArrayItem('colores', idx)} className="text-red-400 p-2"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Frames */}
                        {type === 'bikes' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    <h2 className="text-lg font-bold uppercase tracking-wider text-black">Frame Types</h2>
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('tipos_marco')}
                                        className="text-[10px] font-black uppercase bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
                                    >
                                        + Add Frame
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.tipos_marco?.map((frame, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={frame}
                                                placeholder="Frame type..."
                                                onChange={(e) => updateArrayItem('tipos_marco', idx, e.target.value)}
                                                className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                            />
                                            <button type="button" onClick={() => removeArrayItem('tipos_marco', idx)} className="text-red-400 p-2"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Technical Specifications Section (Bikes Only) */}
                {type === 'bikes' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-black border-b border-gray-50 pb-4">Technical Specifications</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                            {[
                                { label: 'Frame Material', name: 'cuadro_material' },
                                { label: 'Fork (Horquilla)', name: 'horquilla' },
                                { label: 'Shock', name: 'shock' },
                                { label: 'Motor', name: 'motor_modelo' },
                                { label: 'Battery (Wh)', name: 'bateria_wh', type: 'number' },
                                { label: 'Charger', name: 'charger' },
                                { label: 'Display', name: 'display' },
                                { label: 'Brakes', name: 'frenos_modelo' },
                                { label: 'Brake Discs', name: 'brake_discs' },
                                { label: 'Rear Derailleur', name: 'transmision_modelo' },
                                { label: 'Shifter', name: 'shifter' },
                                { label: 'Cassette', name: 'cassette' },
                                { label: 'Chain', name: 'chain' },
                                { label: 'Crank Arm', name: 'crank_arm' },
                                { label: 'Chainring', name: 'chainring' },
                                { label: 'Wheelset', name: 'wheelset' },
                                { label: 'Tire (Front)', name: 'tire_f' },
                                { label: 'Tire (Rear)', name: 'tire_r' },
                                { label: 'Handlebar', name: 'handlebar' },
                                { label: 'Stem', name: 'stem' },
                                { label: 'Saddle', name: 'saddle' },
                                { label: 'Dropper Post', name: 'tija_telescopica' },
                                { label: 'Pedals', name: 'pedals' },
                            ].map((spec) => (
                                <div key={spec.name} className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">{spec.label}</label>
                                    <input
                                        type={spec.type || "text"}
                                        name={spec.name}
                                        value={formData[spec.name] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2.5 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Images Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-black border-b border-gray-50 pb-4">Product Images ({type === 'bikes' ? 'Multiple allowed' : 'Single image'})</h2>

                    <div className="flex flex-wrap gap-4">
                        {type !== 'bikes' && formData.image_url && (
                            <div className="relative group w-40 h-40 bg-gray-50 rounded-2xl border border-gray-100 p-2 overflow-hidden">
                                <img src={formData.image_url} alt="Main" className="w-full h-full object-contain mix-blend-multiply" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        )}

                        {type === 'bikes' && formData.imagenes_urls?.map((url, idx) => (
                            <div key={idx} className="relative group w-40 h-40 bg-gray-50 rounded-2xl border border-gray-100 p-2 overflow-hidden">
                                <img src={url} alt={`View ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                >
                                    <Trash2 size={24} />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    #{idx + 1}
                                </div>
                            </div>
                        ))}

                        <label className="w-40 h-40 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-black hover:bg-gray-100 transition-all">
                            {uploading ? (
                                <Loader2 className="animate-spin text-gray-400" />
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center mb-2">
                                        <Upload size={20} className="text-gray-400" />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase">Upload Images</span>
                                </>
                            )}
                            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" disabled={uploading} multiple={type === 'bikes'} />
                        </label>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl hover:shadow-black/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
