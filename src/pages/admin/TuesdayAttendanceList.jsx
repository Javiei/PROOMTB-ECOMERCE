import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, Mail, CreditCard, Calendar, Search, Download, Trash2, Loader2, CheckCircle, Award } from 'lucide-react';

const TuesdayAttendanceList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        const headers = ['Nombre', 'Apellido', 'Cédula', 'Email', 'Fecha de Registro', 'Waiver Aceptado'];
        const rows = registrations.map(r => [
            r.first_name,
            r.last_name,
            r.cedula,
            r.email,
            r.registration_date,
            r.waiver_accepted ? 'SÍ' : 'NO'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
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

    const filteredRegistrations = registrations.filter(r =>
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cedula.includes(searchTerm)
    );

    // Group by cedula to see frequency
    const attendanceFrequency = registrations.reduce((acc, curr) => {
        acc[curr.cedula] = (acc[curr.cedula] || 0) + 1;
        return acc;
    }, {});

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
                        Total: <span className="text-black font-bold">{registrations.length} registros</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
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
        </div>
    );
};

export default TuesdayAttendanceList;
