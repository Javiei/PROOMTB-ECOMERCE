import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
    Search, 
    Check, 
    X, 
    Loader2, 
    Plus, 
    Download, 
    Bike, 
    Users, 
    Trash2, 
    CheckCircle2, 
    Phone, 
    Mail, 
    Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';

const AguinaldoList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, checked_in, not_checked_in
    const [processingId, setProcessingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const [newParticipant, setNewParticipant] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        email: '',
        phone: ''
    });

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('aguinaldo_registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching aguinaldo registrations:', error);
                if (error.code === '42P01') {
                    toast.error('Recuerda ejecutar el script setup_aguinaldo_db.sql en Supabase SQL Editor.', { duration: 6000 });
                } else {
                    toast.error('Error al cargar la lista de inscritos');
                }
            } else {
                setRegistrations(data || []);
            }
        } catch (error) {
            console.error('Error in fetchRegistrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Toggle Check-in status
    const handleToggleCheckIn = async (id, currentVal) => {
        setProcessingId(id);
        const newVal = !currentVal;
        try {
            const { error } = await supabase
                .from('aguinaldo_registrations')
                .update({ 
                    checked_in: newVal,
                    checked_in_at: newVal ? new Date().toISOString() : null
                })
                .eq('id', id);

            if (error) throw error;
            
            setRegistrations(prev => prev.map(item => item.id === id ? { 
                ...item, 
                checked_in: newVal, 
                checked_in_at: newVal ? new Date().toISOString() : null 
            } : item));
            
            toast.success(newVal ? '¡Asistencia marcada! 🚴' : 'Asistencia desmarcada');
        } catch (err) {
            console.error('Error updating check-in:', err);
            toast.error('Error al actualizar la asistencia');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el registro de ${name}?`)) return;

        try {
            const { error } = await supabase
                .from('aguinaldo_registrations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRegistrations(prev => prev.filter(r => r.id !== id));
            toast.success('Registro eliminado');
        } catch (err) {
            console.error('Error deleting participant:', err);
            toast.error('Error al eliminar');
        }
    };

    const handleAddManual = async (e) => {
        e.preventDefault();
        if (!newParticipant.first_name || !newParticipant.last_name || !newParticipant.cedula || !newParticipant.phone) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setModalLoading(true);
        try {
            const { count } = await supabase
                .from('aguinaldo_registrations')
                .select('*', { count: 'exact', head: true });

            const nextNumber = (count || 0) + 1;
            const ticket_code = `AGU-${nextNumber.toString().padStart(3, '0')}`;

            const { data, error } = await supabase
                .from('aguinaldo_registrations')
                .insert([{
                    first_name: newParticipant.first_name.trim(),
                    last_name: newParticipant.last_name.trim(),
                    cedula: newParticipant.cedula.trim(),
                    email: newParticipant.email.trim() || 'presencial@proomtb.com',
                    phone: newParticipant.phone.trim(),
                    ticket_code: ticket_code,
                    status: 'registered',
                    checked_in: true, // Si se agrega en tienda, marcado como presente
                    checked_in_at: new Date().toISOString(),
                    waiver_accepted: true,
                    notes: 'Registro Manual en Tienda'
                }])
                .select()
                .single();

            if (error) throw error;

            toast.success(`¡Inscrito agregado con éxito! Código: ${ticket_code}`);
            setShowAddModal(false);
            setNewParticipant({
                first_name: '',
                last_name: '',
                cedula: '',
                email: '',
                phone: ''
            });
            fetchRegistrations();
        } catch (err) {
            console.error('Error adding participant:', err);
            toast.error('Error al registrar al participante');
        } finally {
            setModalLoading(false);
        }
    };

    const exportToCSV = () => {
        if (registrations.length === 0) {
            toast.error('No hay registros para exportar');
            return;
        }

        const headers = ['Boleto Rifa', 'Nombre', 'Apellido', 'Cédula', 'Teléfono', 'Email', 'Asistencia', 'Fecha Registro', 'Notas'];
        const rows = filteredRegistrations.map(r => [
            `"${r.ticket_code || ''}"`,
            `"${r.first_name || ''}"`,
            `"${r.last_name || ''}"`,
            `"${r.cedula || ''}"`,
            `"${r.phone || ''}"`,
            `"${r.email || ''}"`,
            r.checked_in ? 'SÍ' : 'NO',
            `"${new Date(r.created_at).toLocaleString()}"`,
            `"${r.notes || ''}"`
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `inscripciones_aguinaldo_navideno_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('¡Listado CSV descargado con éxito!');
    };

    // Filter registrations
    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = 
            reg.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.phone?.includes(searchTerm) ||
            reg.ticket_code?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterStatus === 'checked_in') return reg.checked_in;
        if (filterStatus === 'not_checked_in') return !reg.checked_in;

        return true;
    });

    const totalCount = registrations.length;
    const checkedInCount = registrations.filter(r => r.checked_in).length;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎄</span>
                        <h1 className="text-2xl font-black uppercase text-gray-900 tracking-tight">
                            Águinaldo Navideño 2026
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Control de inscritos y asistencia para la ruta ciclista del Águinaldo Navideño.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={exportToCSV}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl transition-all shadow-sm"
                    >
                        <Download size={16} /> Exportar CSV / Rifa
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-black uppercase rounded-xl transition-all shadow-sm"
                    >
                        <Plus size={16} /> Registro Manual
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Inscritos</p>
                        <p className="text-4xl font-black text-gray-900 mt-1">{totalCount}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Participantes con boleto de rifa</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                        <Users size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asistencias Confirmadas</p>
                        <p className="text-4xl font-black text-emerald-600 mt-1">{checkedInCount}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            {totalCount > 0 ? `${Math.round((checkedInCount / totalCount) * 100)}% de asistencia en ruta` : '0%'}
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                        <Bike size={28} />
                    </div>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula, código (AGU-001)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors whitespace-nowrap ${filterStatus === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Todos ({totalCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('checked_in')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors whitespace-nowrap ${filterStatus === 'checked_in' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Presentes ({checkedInCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('not_checked_in')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors whitespace-nowrap ${filterStatus === 'not_checked_in' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Por Llegar ({totalCount - checkedInCount})
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-3 text-black" size={32} />
                        <p className="text-xs font-bold uppercase tracking-wider">Cargando inscripciones...</p>
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        <p className="text-base font-bold text-gray-600">No se encontraron registros</p>
                        <p className="text-xs mt-1">Intenta con otro término de búsqueda o registra un participante.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                    <th className="py-4 px-6">Boleto Rifa</th>
                                    <th className="py-4 px-6">Participante</th>
                                    <th className="py-4 px-6">Contacto</th>
                                    <th className="py-4 px-6 text-center">Asistencia Ruta</th>
                                    <th className="py-4 px-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50/60 transition-colors">
                                        {/* Boleto Code */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 font-mono font-black rounded-lg text-xs border border-red-200">
                                                <Ticket size={14} className="text-red-500" />
                                                {reg.ticket_code || 'S/C'}
                                            </div>
                                            <span className="block text-[10px] text-gray-400 font-mono mt-1">
                                                {new Date(reg.created_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </td>

                                        {/* Name & Cedula */}
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-gray-900 leading-snug">
                                                {reg.first_name} {reg.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500 font-mono">
                                                {reg.cedula}
                                            </p>
                                            {reg.notes && (
                                                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">
                                                    {reg.notes}
                                                </span>
                                            )}
                                        </td>

                                        {/* Contact */}
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <a 
                                                    href={`https://wa.me/${reg.phone.replace(/[^0-9]/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                                                >
                                                    <Phone size={13} />
                                                    {reg.phone}
                                                </a>
                                                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    <Mail size={13} />
                                                    {reg.email}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Check-in Action Button */}
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleCheckIn(reg.id, reg.checked_in)}
                                                disabled={processingId === reg.id}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase inline-flex items-center gap-1.5 transition-all shadow-sm ${
                                                    reg.checked_in 
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                                }`}
                                            >
                                                {reg.checked_in ? (
                                                    <>
                                                        <CheckCircle2 size={14} className="text-emerald-600" />
                                                        <span>Presente</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Check-in</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(reg.id, `${reg.first_name} ${reg.last_name}`)}
                                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Eliminar registro"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal: Manual Registration */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-black uppercase text-gray-900 flex items-center gap-2">
                                🎄 Inscripción Manual
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Registra a un ciclista presencialmente en tienda. Se generará su código correlativo y se marcará como presente.
                            </p>
                        </div>

                        <form onSubmit={handleAddManual} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={newParticipant.first_name}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, first_name: e.target.value })}
                                        placeholder="Juan"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        value={newParticipant.last_name}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, last_name: e.target.value })}
                                        placeholder="Pérez"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cédula</label>
                                <input
                                    type="text"
                                    required
                                    value={newParticipant.cedula}
                                    onChange={(e) => setNewParticipant({ ...newParticipant, cedula: e.target.value })}
                                    placeholder="000-0000000-0"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Teléfono / WhatsApp</label>
                                <input
                                    type="tel"
                                    required
                                    value={newParticipant.phone}
                                    onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                                    placeholder="809-000-0000"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Correo Electrónico (Opcional)</label>
                                <input
                                    type="email"
                                    value={newParticipant.email}
                                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                                    placeholder="cliente@correo.com"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={modalLoading}
                                className="w-full py-3.5 bg-black text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {modalLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                Guardar e Inscribir
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AguinaldoList;
