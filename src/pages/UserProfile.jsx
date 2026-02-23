import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, User, Mail, Shield, Wrench, Calendar, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const { data, error } = await supabase
                .from('maintenance_bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('booking_date', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white">
                        <span className="text-3xl font-black uppercase tracking-widest">
                            {user.email?.[0]}
                        </span>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Mi Perfil</h1>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wide text-gray-600 flex items-center gap-1">
                                <Shield size={12} />
                                Rider Account
                            </span>
                        </div>
                    </div>
                </div>

                {/* Maintenance Bookings Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                            <Wrench size={18} className="text-gray-400" />
                            Mis Mantenimientos
                        </h2>
                        <Link
                            to="/agendar-mantenimiento"
                            className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Agendar Nuevo
                        </Link>
                    </div>
                    <div className="p-6">
                        {loadingBookings ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Calendar size={20} className="text-black" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm uppercase">Mantenimiento {booking.maintenance_type}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(booking.booking_date).toLocaleDateString()}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Agendado</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Wrench size={32} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium mb-4">No tienes mantenimientos agendados.</p>
                                <Link
                                    to="/agendar-mantenimiento"
                                    className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-all"
                                >
                                    Agendar primero ahora
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold uppercase tracking-wide">Detalles de la Cuenta</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                                    <Mail size={12} />
                                    Correo Electrónico
                                </label>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                                    <User size={12} />
                                    ID de Usuario
                                </label>
                                <p className="font-mono text-sm text-gray-500 bg-gray-50 p-2 rounded-lg truncate">
                                    {user.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSignOut}
                        className="bg-white text-red-500 border border-red-100 hover:bg-red-50 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
