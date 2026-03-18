import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Camera, Download, Trash2, ExternalLink, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';

const PhotoList = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

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
            // 1. Delete from storage
            if (storagePath) {
                const { error: storageError } = await supabase.storage
                    .from('activity_photos')
                    .remove([storagePath]);
                
                if (storageError) console.error("Error al borrar del bucket, procediendo con la BD.", storageError);
            }

            // 2. Delete from database
            const { error: dbError } = await supabase
                .from('activity_photos')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // Update UI
            setPhotos(photos.filter(photo => photo.id !== id));
            
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Hubo un error al eliminar la foto.');
        } finally {
            setDeletingId(null);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                        <Camera className="w-8 h-8 text-black" />
                        Fotos de la Actividad
                    </h1>
                    <p className="text-gray-500 mt-1">Fotos compartidas por los asistentes ({photos.length} en total)</p>
                </div>
                
                <button 
                    onClick={fetchPhotos}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
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
                    {photos.map((photo) => (
                        <div key={photo.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                            <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                                <img 
                                    src={photo.photo_url} 
                                    alt="Activity upload" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                {/* Actions Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                    <div className="flex gap-2">
                                        <a 
                                            href={photo.photo_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg shadow backdrop-blur-sm transition-colors"
                                            title="Abrir original"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                        <button 
                                            onClick={() => handleDelete(photo.id, photo.storage_path)}
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
                            <div className="p-4 border-t border-gray-50">
                                <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                    {new Date(photo.uploaded_at).toLocaleString('es-ES', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoList;
