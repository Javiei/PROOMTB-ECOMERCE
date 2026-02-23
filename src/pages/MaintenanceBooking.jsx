import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import proomtbLogo from '../assets/proomtb_logo_white.png';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Phone, Mail, User, ArrowRight, Loader2, MapPin, Calendar, CreditCard, ClipboardList, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const MaintenanceBooking = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        cedula: '',
        address: '',
        booking_date: '',
        maintenance_type: 'Full',
        notes: '',
        user_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                user_id: user.id
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First attempt to insert into maintenance_bookings
            // If the table doesn't exist, this will fail. 
            // In a real scenario, we'd ensure the table exists or use a more generic way if allowed.
            const { error: submitError } = await supabase
                .from('maintenance_bookings')
                .insert([formData]);

            if (submitError) {
                console.error('Database submission error:', submitError);
                // If it's a "table not found" error or similar, we might want to inform the user nicely
                if (submitError.code === '42P01') {
                    throw new Error('La tabla de base de datos no está configurada aún. Por favor, contacta al administrador.');
                }
                throw submitError;
            }

            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting booking:', err);
            setError(err.message || 'Hubo un error al agendar tu mantenimiento. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
            <Helmet>
                <title>Agendar Mantenimiento - ProoMTB & Road</title>
                <meta name="description" content="Agenda tu mantenimiento de bicicleta profesional en ProoMTB & Road" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-black p-8 md:p-12 text-center relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center justify-center space-x-6 mb-6">
                            <img
                                src={proomtbLogo}
                                alt="ProoMTB Logo"
                                className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
                            />
                            <div className="h-10 w-px bg-white/20"></div>
                            <img
                                src={raymonLogo}
                                alt="Raymon Logo"
                                className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
                            />
                        </div>

                        <h1 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
                            Agendar Mantenimiento
                        </h1>
                        <p className="text-gray-400 text-xs mt-3 font-bold uppercase tracking-[0.3em]">
                            Servicio Técnico Profesional
                        </p>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] -ml-24 -mb-24"></div>
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {!user ? (
                            <motion.div
                                key="login-required"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock size={32} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Inicia Sesión para Agendar</h2>
                                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                                    Para vincular el mantenimiento a tu cuenta y poder verlo en tu perfil, es necesario que inicies sesión.
                                </p>
                                <motion.a
                                    href="/profile"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-black/20 transition-all"
                                >
                                    Iniciar Sesión <ArrowRight size={20} />
                                </motion.a>
                            </motion.div>
                        ) : !submitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Input */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre Completo</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="full_name"
                                                required
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                placeholder="Tu nombre completo"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Correo Electrónico</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="ejemplo@correo.com"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Teléfono</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="809-000-0000"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Cedula Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cédula</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <CreditCard size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="cedula"
                                                required
                                                value={formData.cedula}
                                                onChange={handleChange}
                                                placeholder="000-0000000-0"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Booking Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Fecha Preferida</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <input
                                                type="date"
                                                name="booking_date"
                                                required
                                                value={formData.booking_date}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black appearance-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Input */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Dirección de Residencia</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <MapPin size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Calle, Número, Sector, Ciudad"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Maintenance Type */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tipo de Mantenimiento</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, maintenance_type: 'Basic' }))}
                                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.maintenance_type === 'Basic' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <span className="font-black uppercase tracking-widest text-sm">Básico</span>
                                                <span className={`text-[10px] font-bold ${formData.maintenance_type === 'Basic' ? 'text-gray-400' : 'text-gray-400'}`}>RD$700</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, maintenance_type: 'Full' }))}
                                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.maintenance_type === 'Full' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <span className="font-black uppercase tracking-widest text-sm">Full</span>
                                                <span className={`text-[10px] font-bold ${formData.maintenance_type === 'Full' ? 'text-gray-400' : 'text-gray-400'}`}>RD$1,200</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Notas adicionales (Modelo de bicicleta, problemas específicos)</label>
                                        <div className="relative group">
                                            <div className="absolute top-4 left-4 text-gray-400 group-focus-within:text-black transition-colors">
                                                <ClipboardList size={18} />
                                            </div>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                placeholder="Ej: Raymon TrailRay 160, ajuste de frenos..."
                                                rows="3"
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all font-bold text-black placeholder:text-gray-400"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-red-500 text-sm font-bold text-center bg-red-50 p-4 rounded-2xl border border-red-100"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            Agendar Ahora <ArrowRight size={24} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle size={56} />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">¡Cita Agendada!</h2>
                                <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">
                                    Gracias {formData.full_name.split(' ')[0]}, hemos recibido tu solicitud para el día {formData.booking_date}. Nos pondremos en contacto contigo pronto.
                                </p>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => setSubmitted(false)}
                                    className="mt-12 text-black text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
                                >
                                    Volver al formulario
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Link back to home */}
            <motion.a
                href="/"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-black transition-colors"
            >
                ← Volver a Inicio
            </motion.a>
        </div>
    );
};

export default MaintenanceBooking;
