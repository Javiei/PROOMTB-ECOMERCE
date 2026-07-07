import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Search, Check, X, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AnniversaryList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [autoApprove, setAutoApprove] = useState(true);
    const [newGuest, setNewGuest] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        email: '',
        phone: ''
    });

    const handleAddGuest = async (e) => {
        e.preventDefault();
        if (!newGuest.first_name || !newGuest.last_name || !newGuest.cedula || !newGuest.email || !newGuest.phone) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        setModalLoading(true);
        try {
            // 1. Insert Guest into anniversary_registrations
            const { data, error } = await supabase
                .from('anniversary_registrations')
                .insert([{
                    first_name: newGuest.first_name,
                    last_name: newGuest.last_name,
                    cedula: newGuest.cedula,
                    email: newGuest.email,
                    phone: newGuest.phone,
                    jersey_size: 'N/A',
                    registration_type: 'invitado',
                    receipt_url: 'invitado',
                    status: 'pending' // Insert as pending to allow standard approval sequence
                }])
                .select()
                .single();

            if (error) throw error;

            toast.success('Invitado registrado exitosamente.');
            
            // 2. Auto-approve if selected
            if (autoApprove && data?.id) {
                toast.loading('Generando código y enviando correo de confirmación...', { id: 'approval-toast' });
                const { data: approvalData, error: approvalError } = await supabase.functions.invoke('anniversary-approval', {
                    body: { registrationId: data.id }
                });

                if (approvalError) {
                    console.error('Approval Error:', approvalError);
                    toast.error('Invitado creado pero falló la aprobación automática.', { id: 'approval-toast' });
                } else {
                    toast.success(`Invitado aprobado. Código: ${approvalData?.code}`, { id: 'approval-toast' });
                }
            }

            // Reset Form and State
            setNewGuest({
                first_name: '',
                last_name: '',
                cedula: '',
                email: '',
                phone: ''
            });
            setShowAddModal(false);
            fetchRegistrations();
        } catch (err) {
            console.error('Error adding guest:', err);
            toast.error('Error al registrar al invitado.');
        } finally {
            setModalLoading(false);
        }
    };

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
        reg.registration_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold uppercase rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Agregar Invitado
                    </button>
                    
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
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Participante</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-500">Plan</th>
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
                                            <span className={`px-2.5 py-1 font-black text-xs rounded border ${
                                                reg.registration_type === 'invitado'
                                                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                                                    : reg.registration_type === 'basico' 
                                                        ? 'bg-neutral-150 text-neutral-700 border-neutral-300' 
                                                        : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                            }`}>
                                                {reg.registration_type === 'invitado' ? 'INVITADO' : reg.registration_type === 'basico' ? 'BÁSICO' : 'FULL'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-gray-100 text-black font-black text-xs rounded border border-gray-200">
                                                {reg.jersey_size}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {reg.receipt_url && reg.receipt_url !== 'invitado' && reg.receipt_url !== 'N/A' ? (
                                                <a 
                                                    href={reg.receipt_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <ImageIcon size={14} /> Ver Recibo
                                                </a>
                                            ) : reg.registration_type === 'invitado' ? (
                                                <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">No requiere pago</span>
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

            {/* Modal para Agregar Invitado */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-150">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase text-gray-900">Agregar Invitado Especial</h3>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddGuest} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={newGuest.first_name}
                                        onChange={(e) => setNewGuest(prev => ({ ...prev, first_name: e.target.value }))}
                                        placeholder="Juan"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        value={newGuest.last_name}
                                        onChange={(e) => setNewGuest(prev => ({ ...prev, last_name: e.target.value }))}
                                        placeholder="Pérez"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Cédula</label>
                                <input
                                    type="text"
                                    required
                                    value={newGuest.cedula}
                                    onChange={(e) => setNewGuest(prev => ({ ...prev, cedula: e.target.value }))}
                                    placeholder="000-0000000-0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={newGuest.email}
                                    onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Teléfono / WhatsApp</label>
                                <input
                                    type="tel"
                                    required
                                    value={newGuest.phone}
                                    onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="809-000-0000"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors mt-2">
                                <input
                                    type="checkbox"
                                    checked={autoApprove}
                                    onChange={(e) => setAutoApprove(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer mt-0.5"
                                />
                                <div className="text-xs">
                                    <span className="font-bold text-gray-800 block">Aprobar automáticamente</span>
                                    <span className="text-gray-500">Asigna código PRO-XXX y envía correo al guardar.</span>
                                </div>
                            </label>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-bold uppercase rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className="flex-1 px-4 py-2 bg-black text-white text-sm font-bold uppercase rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {modalLoading ? <Loader2 size={16} className="animate-spin" /> : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnniversaryList;
