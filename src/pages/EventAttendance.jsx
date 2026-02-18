import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import proomtbLogo from '../assets/LOGO PRO MTB AND ROAD VECTORES CORREGIDOS.pdf.png';
import proomtbLogoWhite from '../assets/proomtb_logo_white.png';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';


import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, Phone, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const WelcomeSplash = ({ onEnter }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_50%)]"
                />
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* Logos */}
                <div className="flex items-center justify-center space-x-6 mb-12">
                    <motion.img
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        src={proomtbLogoWhite}
                        alt="ProoMTB"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                    <motion.div
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-8 w-px bg-white/20 origin-center"
                    />
                    <motion.img
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                        src={raymonLogo}
                        alt="Raymon"
                        className="h-6 md:h-8 w-auto brightness-0 invert"
                    />
                </div>

                {/* Title */}
                <div className="mb-6 overflow-hidden">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.6 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-white text-md font-black uppercase tracking-[0.3em] mb-2"
                    >
                        Raymon Dominicana
                    </motion.h2>
                    <div className="flex flex-col items-center justify-center">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 20,
                                delay: 1.2
                            }}
                            className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                        >
                            Gran
                        </motion.h1>
                        <motion.span
                            initial={{ y: 50, opacity: 0, skewX: 20 }}
                            animate={{ y: 0, opacity: 1, skewX: -10 }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 15,
                                delay: 1.4
                            }}
                            className="text-white text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none block relative"
                        >
                            Opening
                            {/* Subtle Shimmer Effect */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                        </motion.span>
                    </div>
                </div>

                {/* Event Details */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 1.8 }}
                    className="space-y-6 mb-12 relative"
                >
                    <div className="flex flex-col items-center relative">
                        {/* Pulsing Glow behind date */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-white/20 blur-3xl rounded-full"
                        />
                        <span className="text-white font-black text-4xl mb-1 relative z-10">18 MARZO</span>
                        <span className="text-white/60 uppercase tracking-widest text-xs font-bold relative z-10">Miércoles, 5:30 PM</span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-white font-bold uppercase tracking-tight">Showroom Raymon ProoMTB</p>
                        <p className="text-white/40 text-xs max-w-[250px] mx-auto leading-relaxed">
                            Calle Eliseo Grullón #26, Los Prados, Santo Domingo, Rep. Dom.
                        </p>
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.button
                    initial={{ y: 30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 10,
                        delay: 2.2
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEnter}
                    className="group relative px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:bg-gray-100"
                >
                    <span className="relative z-10 flex items-center gap-3 font-black">
                        Confirmar Asistencia <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 2.8 }}
                    className="mt-12 text-white/20 text-[10px] uppercase font-black tracking-[0.5em]"
                >
                    Stay Tuned
                </motion.p>


            </div>
        </motion.div>
    );
};

const EventAttendance = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companions: 0,
        event_name: 'Gran Opening Raymon ProoMTB' // Updated event name
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
                <title>Gran Opening - Raymon ProoMTB</title>
                <meta name="description" content="Confirma tu asistencia al Gran Opening de Raymon ProoMTB" />
            </Helmet>

            <AnimatePresence>
                {showSplash && (
                    <WelcomeSplash onEnter={() => setShowSplash(false)} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: !showSplash ? 1 : 0, y: !showSplash ? 0 : 20 }}
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
                            GRAN OPENING
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
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400 font-sans"
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
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400 font-sans"
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
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400 font-sans"
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
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black appearance-none font-sans"
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
                                        className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg font-sans"
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
                                <p className="text-gray-500 font-medium font-sans">
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
            {!showSplash && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                        ProoMTB & Road © 2026
                    </p>
                </motion.div>
            )}
        </div>
    );
};


export default EventAttendance;
