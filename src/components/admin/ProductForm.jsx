import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure path is correct relative to where you save this
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
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
        specs: {}
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
            if (data) {
                setFormData({
                    ...data,
                    // Ensure arrays/objects are initialized if null
                    imagenes_urls: data.imagenes_urls || [],
                    sizes: data.sizes || [],
                    specs: data.specs || {}
                });
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

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
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to 'bicicletas' bucket inside 'products' folder or root
            const { error: uploadError } = await supabase.storage
                .from('bicicletas') // Keeping bucket same for now unless specified
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('bicicletas')
                .getPublicUrl(filePath);

            // Update State: If accessory, set image_url. If bike, append to array.
            if (type !== 'bikes') {
                setFormData(prev => ({ ...prev, image_url: publicUrl }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    imagenes_urls: [...prev.imagenes_urls, publicUrl]
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
                    precio_eur: parseFloat(formData.precio_eur),
                    serie_id: formData.serie_id ? parseInt(formData.serie_id) : null,
                    imagenes_urls: formData.imagenes_urls,
                    sizes: (formData.sizes || []).map(s => ({
                        size: s.size,
                        price: parseFloat(s.price) || 0
                    })),
                    specs: formData.specs,
                    category_id: formData.category_id // Mapped from series 
                };
            } else {
                // Table: products
                payload = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
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

    if (loading && isEditMode && !formData.name) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(type === 'bikes' ? '/admin/bikes' : '/admin/accessories')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                    {isEditMode ? 'Edit Product' : 'New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Name / Model</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || formData.modelo || ''}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>
                    {/* Only show explicit 'Model' field if separate from Name and needed? 
                        For simplicity, let's treat the 'Name' input as 'modelo' for bikes. 
                        We can hide this secondary field or use it for something else. */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">
                            Price ({type === 'bikes' ? 'USD' : 'RD$'})
                        </label>
                        <input
                            type="number"
                            name={type === 'bikes' ? 'precio_eur' : 'price'}
                            step="0.01"
                            value={(type === 'bikes' ? formData.precio_eur : formData.price) || ''}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    {type === 'bikes' ? (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Series</label>
                            <select
                                name="serie_id"
                                value={formData.serie_id || ''}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black"
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
                            <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id || 'accessories'}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black"
                            >
                                {categories
                                    .filter(cat => cat.id === 'accessories')
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black resize-none"
                    />
                </div>

                {/* Sizes and Prices Variants */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-gray-500">Sizes & Prices Variants</label>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="text-xs font-bold uppercase bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            + Add Variant
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.sizes?.map((variant, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl relative group">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Size</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. M, L, 42..."
                                        value={variant.size}
                                        onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                                        className="w-full bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Price ({type === 'bikes' ? 'USD' : 'RD$'})</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                        className="w-full bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeVariant(idx)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                        {(!formData.sizes || formData.sizes.length === 0) && (
                            <div className="text-center py-4 text-gray-400 text-sm italic">
                                No variants added. The main price will be used.
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-gray-500">Images {type === 'bikes' ? '(Multiple)' : '(Single)'}</label>
                    <div className="flex flex-wrap gap-4">
                        {/* Display existing images */}
                        {type !== 'bikes' && formData.image_url && (
                            <div className="relative w-32 h-32 bg-gray-50 rounded-xl border border-gray-100 p-2">
                                <img src={formData.image_url} alt="Main" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        {type === 'bikes' && formData.imagenes_urls?.map((url, idx) => (
                            <div key={idx} className="relative w-32 h-32 bg-gray-50 rounded-xl border border-gray-100 p-2">
                                <img src={url} alt={`View ${idx}`} className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        <label className="w-32 h-32 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-black hover:bg-gray-100 transition-colors">
                            {uploading ? (
                                <Loader2 className="animate-spin text-gray-400" />
                            ) : (
                                <>
                                    <Upload className="text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500 font-bold uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" disabled={uploading} />
                        </label>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        Save Product
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProductForm;
