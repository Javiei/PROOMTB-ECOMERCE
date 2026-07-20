import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, Mail, CreditCard, Calendar, Search, Download, Trash2, Loader2, CheckCircle, Award, Send, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TuesdayAttendanceList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Modal para Envío Masivo del Aniversario
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState('🚴‍♂️🔥 ¡Gana una Bicicleta Raymond 0 km! Inscríbete al 6to Aniversario ProoMTB');
    const [testEmail, setTestEmail] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tuesday_registrations')
                .select('*')
                .order('registration_date', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRegistration = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) return;

        try {
            const { error } = await supabase
                .from('tuesday_registrations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRegistrations(registrations.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Error al eliminar el registro');
        }
    };

    const exportToCSV = () => {
        const headers = ['Nombre', 'Apellido', 'Cédula', 'Email', 'Fecha de Registro', 'Total Asistencias', 'Waiver Aceptado'];
        const rows = filteredRegistrations.map(r => [
            `"${r.first_name}"`,
            `"${r.last_name}"`,
            r.cedula,
            `"${r.email}"`,
            r.registration_date,
            attendanceFrequency[r.cedula],
            r.waiver_accepted ? 'SÍ' : 'NO'
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `registros_martes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const uniqueDates = [...new Set(registrations.map(r => r.registration_date))].sort((a, b) => new Date(b) - new Date(a));

    const filteredRegistrations = registrations.filter(r => {
        const matchesSearch = `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.cedula.includes(searchTerm);
        const matchesDate = filterDate ? r.registration_date === filterDate : true;
        return matchesSearch && matchesDate;
    });

    // Group by cedula to see frequency
    const attendanceFrequency = registrations.reduce((acc, curr) => {
        acc[curr.cedula] = (acc[curr.cedula] || 0) + 1;
        return acc;
    }, {});

    const handleSendAnniversaryEmails = async (isTest = false) => {
        if (isTest && !testEmail) {
            toast.error('Por favor ingresa un correo de prueba.');
            return;
        }
        if (!isTest && !window.confirm('¿Estás seguro de enviar este correo masivo a TODOS los usuarios registrados en los paseos?')) {
            return;
        }

        setSending(true);
        const toastId = toast.loading(isTest ? `Enviando prueba a ${testEmail}...` : 'Enviando invitaciones del Aniversario...');

        try {
            const { data, error } = await supabase.functions.invoke('anniversary-invitation', {
                body: {
                    customSubject: emailSubject,
                    testEmail: isTest ? testEmail : null
                }
            });

            if (error) throw error;

            if (isTest) {
                toast.success('¡Correo de prueba enviado con éxito! 📩', { id: toastId });
            } else {
                toast.success(`¡Proceso completado! Enviados: ${data?.enviados || 0} de ${data?.totalDestinatarios || 0} usuarios. 🎉`, { id: toastId, duration: 6000 });
                setShowEmailModal(false);
            }
        } catch (err) {
            console.error('Error enviando correos:', err);
            const isFetchError = err.message?.includes('Failed to send') || err.name === 'FunctionsFetchError';
            if (isFetchError) {
                toast.error('La Edge Function "anniversary-invitation" aún no está desplegada en Supabase. Por favor despliégala con Supabase CLI.', { id: toastId, duration: 8000 });
            } else {
                toast.error(`Error al enviar: ${err.message || 'Error en la Edge Function'}`, { id: toastId });
            }
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Registros Martes de Ruta</h2>
                    <p className="text-gray-500 text-sm font-medium">
                        Mostrando: <span className="text-black font-bold">{filteredRegistrations.length}</span> {filterDate ? 'registros en esta fecha' : 'registros en total'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowEmailModal(true)}
                        className="py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                        <Sparkles size={16} />
                        <span>Invitar al Aniversario (Correo)</span>
                    </button>

                    <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="py-2.5 px-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black transition-all text-sm font-medium"
                    >
                        <option value="">Todas las fechas</option>
                        {uniqueDates.map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o cédula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black transition-all text-sm w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-4"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Participante</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cédula / Email</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Asistencias</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Waiver</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha Ruta</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-sm text-black uppercase">{reg.first_name} {reg.last_name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">ID: {reg.id.split('-')[0]}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CreditCard size={14} className="text-gray-400" />
                                                {reg.cedula}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <Mail size={14} className="text-gray-400" />
                                                {reg.email}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold">
                                                {attendanceFrequency[reg.cedula] >= 3 ? <Award size={12} className="text-yellow-400" /> : <Users size={12} />}
                                                {attendanceFrequency[reg.cedula]}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {reg.waiver_accepted ? (
                                                <CheckCircle size={20} className="text-green-500 mx-auto" />
                                            ) : (
                                                <span className="text-red-500 font-bold text-xs">NO</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} className="text-gray-400" />
                                                {reg.registration_date}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => deleteRegistration(reg.id)}
                                                className="p-2 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Correo Masivo Aniversario */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Enviar Invitación Aniversario</h3>
                                    <p className="text-xs text-neutral-400 font-medium">Envío masivo a todos los registrados en los paseos con video y rifas</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Asunto del Correo</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-medium"
                                />
                            </div>

                            {/* Prueba de Envío */}
                            <div className="pt-2 border-t border-neutral-800">
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Probar Envío a tu Correo</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="tu-correo@ejemplo.com"
                                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                    />
                                    <button
                                        onClick={() => handleSendAnniversaryEmails(true)}
                                        disabled={sending}
                                        className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                    >
                                        Enviar Prueba
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleSendAnniversaryEmails(false)}
                                disabled={sending}
                                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-400/30 flex items-center gap-2 disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                <span>Enviar Masivo a Todos</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TuesdayAttendanceList;
