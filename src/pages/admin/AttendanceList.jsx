import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, Mail, Phone, Calendar, Search, Download, Trash2, Loader2 } from 'lucide-react';

const AttendanceList = () => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAttendees();
    }, []);

    const fetchAttendees = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('event_attendance')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAttendees(data || []);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAttendee = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) return;

        try {
            const { error } = await supabase
                .from('event_attendance')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAttendees(attendees.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting attendee:', error);
            alert('Error al eliminar el registro');
        }
    };

    const exportToCSV = () => {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Acompañantes', 'Evento', 'Fecha'];
        const rows = attendees.map(a => [
            a.name,
            a.email,
            a.phone,
            a.companions,
            a.event_name,
            new Date(a.created_at).toLocaleString()
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `asistencia_evento_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAttendees = attendees.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.phone && a.phone.includes(searchTerm))
    );

    const totalGuests = attendees.reduce((acc, curr) => acc + (curr.companions || 0), 0);
    const totalPeople = attendees.length + totalGuests;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Lista de Asistencia</h2>
                    <p className="text-gray-500 text-sm font-medium">
                        Total: {attendees.length} confirmados + {totalGuests} acompañantes = <span className="text-black font-bold">{totalPeople} personas</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o tel..."
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
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asistente</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Acompañantes</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAttendees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                        No se encontraron asistentes.
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendees.map((attendee) => (
                                    <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-sm text-black uppercase">{attendee.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{attendee.event_name}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                {attendee.email}
                                            </div>
                                            {attendee.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {attendee.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${attendee.companions > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                <Users size={12} />
                                                {attendee.companions === 0 ? 'Solo' : `+${attendee.companions}`}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(attendee.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => deleteAttendee(attendee.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
    );
};

export default AttendanceList;
