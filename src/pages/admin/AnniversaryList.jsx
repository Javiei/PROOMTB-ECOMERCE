import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Search, ExternalLink, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AnniversaryList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('anniversary_registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching anniversary registrations:', error);
            toast.error('Error al cargar los registros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleApprove = async (id, email) => {
        if (!window.confirm(`¿Estás seguro de que deseas aprobar el registro de ${email}? Se enviará un correo automáticamente.`)) {
            return;
        }

        setProcessingId(id);
        try {
            // Invocar la Edge Function para aprobar, generar código y enviar correo
            const { data, error } = await supabase.functions.invoke('anniversary-approval', {
                body: { registrationId: id }
            });

            if (error) throw error;
            
            toast.success(`Registro aprobado. Código asignado: ${data?.code || 'OK'}`);
            fetchRegistrations(); // recargar
        } catch (err) {
            console.error('Error approving registration:', err);
            toast.error('Error al aprobar el registro. Asegúrate de que la Edge Function esté desplegada.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas rechazar este registro?')) {
            return;
        }
        
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from('anniversary_registrations')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) throw error;
            toast.success('Registro rechazado.');
            fetchRegistrations();
        } catch (err) {
            console.error('Error rejecting:', err);
            toast.error('Error al rechazar');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.cedula?.includes(searchTerm) ||
        reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.special_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Aprobado</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">Rechazado</span>;
            default:
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">Pendiente</span>;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase text-gray-900">Inscripciones 6to Aniversario</h1>
                    <p className="text-sm text-gray-500 mt-1">Valida los pagos y genera los códigos de participación.</p>
                </div>
                
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Participante</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Talla</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Comprobante</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Estado / Código</th>
                                <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-sm font-medium">Cargando registros...</p>
                                    </td>
                                </tr>
                            ) : filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{reg.first_name} {reg.last_name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{reg.cedula}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{reg.email}</div>
                                            <div className="text-xs text-gray-500">{reg.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-gray-100 text-black font-black text-xs rounded border border-gray-200">
                                                {reg.jersey_size}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {reg.receipt_url ? (
                                                <a 
                                                    href={reg.receipt_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <ImageIcon size={14} /> Ver Recibo
                                                </a>
                                            ) : (
                                                <span className="text-xs text-red-500 font-bold">Sin comprobante</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-start gap-1">
                                                {getStatusBadge(reg.status)}
                                                {reg.special_code && (
                                                    <span className="text-xs font-mono font-black bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                                                        {reg.special_code}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {reg.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(reg.id, reg.email)}
                                                        disabled={processingId === reg.id}
                                                        className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                                                        title="Aprobar y generar código"
                                                    >
                                                        {processingId === reg.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(reg.id)}
                                                        disabled={processingId === reg.id}
                                                        className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                                                        title="Rechazar"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnniversaryList;
