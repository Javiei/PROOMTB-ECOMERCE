import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
    Search,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Wrench,
    Clock,
    MoreVertical,
    Download,
    Filter,
    RefreshCw,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const MaintenanceList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('maintenance_bookings')
                .select('*')
                .order('booking_date', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching maintenance bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.cedula.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter could be added if you add a status column to the table
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black">Mantenimientos</h1>
                    <p className="text-gray-500 text-sm font-medium">Gestiona las solicitudes de servicio técnico</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchBookings}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black transition-colors"
                        title="Actualizar"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20">
                        <Download size={18} />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Filter size={18} />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-11 pr-10 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all font-medium text-black appearance-none"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="completed">Completados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Cliente</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Identificación</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Servicio</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Fecha Cita</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Dirección</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6 border-b border-gray-50">
                                            <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <motion.tr
                                        key={booking.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm uppercase">
                                                    {booking.full_name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 group-hover:text-black transition-colors">{booking.full_name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={10} /> {booking.email}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Phone size={10} /> {booking.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="text-xs font-black uppercase text-gray-400 mb-1">Cédula</div>
                                                <div className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md inline-block w-fit">
                                                    {booking.cedula}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.maintenance_type === 'Full'
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <Wrench size={12} />
                                                {booking.maintenance_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                <Calendar size={16} className="text-gray-400" />
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div className="text-xs text-gray-500 line-clamp-2">{booking.address}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No se encontraron agendamientos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                <div>Mostrando {filteredBookings.length} de {bookings.length} registros</div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Conexión con Supabase activa</span>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceList;
