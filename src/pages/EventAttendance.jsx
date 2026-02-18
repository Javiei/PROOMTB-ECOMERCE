import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import proomtbLogo from '../assets/LOGO PRO MTB AND ROAD VECTORES CORREGIDOS.pdf.png';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, Phone, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const EventAttendance = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companions: 0,
        event_name: 'Evento ProoMTB' // Default event name
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'companions' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: submitError } = await supabase
                .from('event_attendance')
                .insert([formData]);

            if (submitError) throw submitError;

            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting attendance:', err);
            setError('Hubo un error al confirmar tu asistencia. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <Helmet>
                <title>Confirmar Asistencia - ProoMTB</title>
                <meta name="description" content="Confirma tu asistencia al evento de ProoMTB" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-white p-8 text-center relative overflow-hidden border-b border-gray-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <img
                                src={proomtbLogo}
                                alt="ProoMTB Logo"
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                            <div className="h-8 w-px bg-gray-200"></div>
                            <img
                                src={raymonLogo}
                                alt="Raymon Logo"
                                className="h-6 md:h-8 w-auto object-contain"
                            />
                        </div>

                        <h1 className="text-black text-2xl font-black uppercase tracking-tighter">
                            Confirmar Asistencia
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">
                            Evento ProoMTB
                        </p>
                    </motion.div>


                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-50 rounded-full blur-2xl -ml-12 -mb-12"></div>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre Completo</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Tu nombre completo"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
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
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
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
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="809-000-0000"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Companions Select */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Acompañantes</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                            <Users size={18} />
                                        </div>
                                        <select
                                            name="companions"
                                            value={formData.companions}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black appearance-none"
                                        >
                                            <option value="0">Vengo solo/a</option>
                                            <option value="1">1 Acompañante</option>
                                            <option value="2">2 Acompañantes</option>
                                            <option value="3">3 Acompañantes</option>
                                            <option value="4">4+ Acompañantes</option>
                                        </select>
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Confirmar <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-3">¡Asistencia Confirmada!</h2>
                                <p className="text-gray-500 font-medium">
                                    Gracias por confirmar, {formData.name.split(' ')[0]}. Nos vemos en el evento.
                                </p>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-black text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
                                >
                                    Volver al formulario
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Footer Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
            >
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    ProoMTB & Road © 2026
                </p>
            </motion.div>
        </div>
    );
};

export default EventAttendance;
