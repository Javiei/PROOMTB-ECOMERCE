import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Camera, Download, Trash2, ExternalLink, RefreshCw, Loader2, Image as ImageIcon, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

const PhotoList = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchPhotos = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('activity_photos')
                .select('*')
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            setPhotos(data || []);
        } catch (err) {
            console.error('Error fetching photos:', err);
            setError('Error al cargar las fotos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = async (id, storagePath) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta foto?')) return;
        
        setDeletingId(id);
        try {
            if (storagePath) {
                const { error: storageError } = await supabase.storage
                    .from('activity_photos')
                    .remove([storagePath]);
                
                if (storageError) console.error("Error al borrar del bucket, procediendo con la BD.", storageError);
            }

            const { error: dbError } = await supabase
                .from('activity_photos')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            setPhotos(photos.filter(photo => photo.id !== id));
            // Remove from selection if deleted
            setSelectedPhotos(prev => prev.filter(pId => pId !== id));
            
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Hubo un error al eliminar la foto.');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleSelection = (id) => {
        setSelectedPhotos(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedPhotos.length === photos.length) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(photos.map(p => p.id));
        }
    };

    const triggerDownload = async (storagePath, fallbackUrl) => {
        try {
            // Intenta descargar el Blob para evitar problemas de CORS de fetch normal
            const { data, error } = await supabase.storage.from('activity_photos').download(storagePath);
            if (error) throw error;
            
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = storagePath.split('/').pop() || `foto-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading blob, using fallback link:', err);
            // Fallback approach (abre link en nueva pestaña / fza descarga)
            const link = document.createElement('a');
            link.href = fallbackUrl;
            link.download = `foto-${Date.now()}.jpg`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedPhotos.length === 0) return;
        
        setIsDownloading(true);
        try {
            const selectedFiles = photos.filter(p => selectedPhotos.includes(p.id));
            
            for (let i = 0; i < selectedFiles.length; i++) {
                const photo = selectedFiles[i];
                // Descargar una a una con un pequeño delay para no colapsar el navegador
                await triggerDownload(photo.storage_path, photo.photo_url);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } finally {
            setIsDownloading(false);
            setSelectedPhotos([]);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                        <Camera className="w-8 h-8 text-black" />
                        Fotos de la Actividad
                    </h1>
                    <p className="text-gray-500 mt-1">Fotos compartidas por los asistentes ({photos.length} en total)</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {photos.length > 0 && (
                        <>
                            <button 
                                onClick={toggleAll}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold transition-colors text-sm"
                            >
                                {selectedPhotos.length === photos.length && photos.length > 0 ? (
                                    <><CheckSquare className="w-4 h-4" /> Deseleccionar Todas</>
                                ) : (
                                    <><Square className="w-4 h-4" /> Seleccionar Todas</>
                                )}
                            </button>
                            
                            {selectedPhotos.length > 0 && (
                                <button 
                                    onClick={handleDownloadSelected}
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-bold transition-transform transform hover:-translate-y-1 text-sm shadow-md"
                                >
                                    {isDownloading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Descargando...</>
                                    ) : (
                                        <><Download className="w-4 h-4" /> Descargar ({selectedPhotos.length})</>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                    
                    <button 
                        onClick={fetchPhotos}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold transition-colors ml-auto xl:ml-0 text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Actualizar
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium border border-red-200">
                    {error}
                </div>
            )}

            {photos.length === 0 && !error ? (
                <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay fotos</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Las fotos que los usuarios envíen a través de la página de subida aparecerán aquí.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {photos.map((photo) => {
                        const isSelected = selectedPhotos.includes(photo.id);
                        return (
                            <div 
                                key={photo.id} 
                                onClick={() => toggleSelection(photo.id)}
                                className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all cursor-pointer group hover:shadow-md relative
                                ${isSelected ? 'border-black ring-2 ring-black ring-opacity-50' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                                    <img 
                                        src={photo.photo_url} 
                                        alt="Activity upload" 
                                        className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105 filter brightness-90' : 'group-hover:scale-105'}`}
                                        loading="lazy"
                                    />
                                    
                                    {/* Selection Checkmark */}
                                    <div className="absolute top-3 left-3 z-10 transition-opacity">
                                        {isSelected ? (
                                            <div className="bg-white rounded-full shadow-md text-black">
                                                <CheckCircle2 className="w-6 h-6 fill-current text-black bg-white rounded-full" />
                                            </div>
                                        ) : (
                                            <div className="bg-white/80 rounded border shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 text-gray-400">
                                                <Square className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                    
                                    {/* Actions Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end items-end transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300 z-20">
                                        <div className="flex gap-2">
                                            <a 
                                                href={photo.photo_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg shadow backdrop-blur-sm transition-colors"
                                                title="Abrir original"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(photo.id, photo.storage_path); }}
                                                disabled={deletingId === photo.id}
                                                className="bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-lg shadow backdrop-blur-sm transition-colors disabled:opacity-50"
                                                title="Eliminar foto"
                                            >
                                                {deletingId === photo.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-gray-50 flex justify-between items-center">
                                    <p className="text-[11px] text-gray-500 font-medium">
                                        {new Date(photo.uploaded_at).toLocaleString('es-ES', {
                                            day: '2-digit', month: 'short', 
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PhotoList;
