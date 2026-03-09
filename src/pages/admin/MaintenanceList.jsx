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
    CreditCard,
    ClipboardList,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenanceList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [activeDropdown, setActiveDropdown] = useState(null);

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

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            // Optimistic update
            const updatedBookings = bookings.map(booking =>
                booking.id === id ? { ...booking, status: newStatus } : booking
            );
            setBookings(updatedBookings);
            setActiveDropdown(null);

            const { error } = await supabase
                .from('maintenance_bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) {
                // Revert optimistic update on error
                console.error('Error updating status:', error);
                fetchBookings();
                alert('Hubo un error al actualizar el estado.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            fetchBookings();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.notes && booking.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        // Manejar el estado: si es null o undefined, asumimos 'pending' (para registros antiguos)
        const currentStatus = booking.status || 'pending';

        const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

        return matchesSearch && matchesStatus;
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
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Notas</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-6 border-b border-gray-50">
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
                                        className={`transition-colors group ${(booking.status || 'pending') === 'completed'
                                                ? 'bg-gray-50/50 opacity-70 hover:opacity-100 hover:bg-gray-50'
                                                : 'hover:bg-gray-50'
                                            }`}
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
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div className="text-xs text-gray-500 line-clamp-2">
                                                    {booking.notes || <span className="italic text-gray-400">Sin notas</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === booking.id ? null : booking.id);
                                                }}
                                                className={`p-2 rounded-lg transition-all ${activeDropdown === booking.id
                                                        ? 'bg-black text-white'
                                                        : 'text-gray-400 hover:text-black hover:bg-gray-100'
                                                    }`}
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            <AnimatePresence>
                                                {activeDropdown === booking.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute right-6 top-14 z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="p-1">
                                                            {(booking.status || 'pending') === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                                                    className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-black hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Marcar Atendido
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, 'pending')}
                                                                    className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <XCircle size={16} className="text-gray-400" />
                                                                    Marcar Pendiente
                                                                </button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">
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
