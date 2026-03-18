import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, Image as ImageIcon, X, CheckCircle, Camera, Loader2 } from 'lucide-react';

const PhotoUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
            
            // Generate previews
            const newFiles = selectedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                id: Math.random().toString(36).substring(7)
            }));

            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (id) => {
        setFiles(prev => {
            const filtered = prev.filter(f => f.id !== id);
            // Cleanup object URLs
            const toRemove = prev.find(f => f.id === id);
            if (toRemove) URL.revokeObjectURL(toRemove.preview);
            return filtered;
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        
        setUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            let uploadedCount = 0;
            
            for (const item of files) {
                const file = item.file;
                // Create a unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                
                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('activity_photos')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from('activity_photos')
                    .getPublicUrl(fileName);

                const publicUrl = publicUrlData.publicUrl;

                // 3. Insert into Database
                const { error: dbError } = await supabase
                    .from('activity_photos')
                    .insert([
                        { 
                            photo_url: publicUrl, 
                            storage_path: fileName 
                        }
                    ]);

                if (dbError) throw dbError;

                uploadedCount++;
                setUploadProgress(Math.round((uploadedCount / files.length) * 100));
            }

            setUploadSuccess(true);
            setFiles([]); // Clear form on success
            
        } catch (err) {
            console.error('Error uploading photos:', err);
            setError('Ocurrió un error al subir las fotos. Por favor intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (uploadSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase text-gray-900 mb-4">¡Gracias!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Tus fotos han sido enviadas exitosamente. Apreciamos mucho que compartas tus recuerdos con nosotros.
                    </p>
                    <button
                        onClick={() => setUploadSuccess(false)}
                        className="w-full bg-black text-white hover:bg-gray-800 py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Subir más fotos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-2xl shadow-lg mb-6">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-4">
                        Comparte tus fotos
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        ¿Tomaste fotos increíbles en la actividad de hoy? Súbelas aquí para guardarlas en nuestra galería oficial de PROOMTB.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        {/* Drag and drop zone / Upload Button */}
                        <div 
                            onClick={triggerFileInput}
                            className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300
                                ${files.length === 0 ? 'border-red-300 bg-red-50 hover:bg-red-100' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${files.length === 0 ? 'text-red-500' : 'text-gray-400'}`} />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Toca para seleccionar fotos
                            </h3>
                            <p className="text-sm text-gray-500">
                                Puedes seleccionar múltiples imágenes a la vez. (Solo imágenes)
                            </p>
                        </div>

                        {/* Image Previews */}
                        {files.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                                    Fotos seleccionadas ({files.length})
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {files.map((item) => (
                                        <div key={item.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                            <img
                                                src={item.preview}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(item.id);
                                                    }}
                                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transform hover:scale-110 transition-transform"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Action Area */}
                        {files.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className={`w-full py-4 px-6 rounded-xl font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center
                                        ${uploading 
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                            : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                            Subiendo ({uploadProgress}%)
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-5 w-5" />
                                            Enviar {files.length} {files.length === 1 ? 'Foto' : 'Fotos'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} PROOMTB. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default PhotoUpload;
