import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import proomtbLogo from '../assets/LOGO PRO MTB AND ROAD VECTORES CORREGIDOS.pdf.png';
import proomtbLogoWhite from '../assets/proomtb_logo_white.png';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, Mail, CreditCard, ArrowRight, Loader2, ClipboardCheck, Bike, Calendar, Award } from 'lucide-react';
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
                <div className="flex items-center justify-center mb-12">
                    <motion.img
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        src={proomtbLogoWhite}
                        alt="ProoMTB"
                        className="h-12 md:h-16 w-auto object-contain"
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
                        Paseos Nocturnos
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
                            MARTES
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
                            DE RUTA
                        </motion.span>
                    </div>
                </div>

                {/* Icon Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="flex justify-center gap-8 mb-12"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Bike className="text-white" size={24} />
                        </div>
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Ciclismo</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Calendar className="text-white" size={24} />
                        </div>
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Martes</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <ClipboardCheck className="text-white" size={24} />
                        </div>
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Registro</span>
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
                        Registrarme <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 2.8 }}
                    className="mt-12 text-white/20 text-[10px] uppercase font-black tracking-[0.5em]"
                >
                    DOMINICAN REPUBLIC
                </motion.p>
            </div>
        </motion.div>
    );
};

const TuesdayRegistration = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        email: '',
        waiver_accepted: false
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [attendanceCount, setAttendanceCount] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.waiver_accepted) {
            setError('Debes aceptar el descargo de responsabilidad para registrarte.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Check if already registered today
            const today = new Date().toISOString().split('T')[0];
            const { data: existing, error: checkError } = await supabase
                .from('tuesday_registrations')
                .select('id')
                .eq('cedula', formData.cedula)
                .eq('registration_date', today);

            if (checkError) throw checkError;
            if (existing && existing.length > 0) {
                setError('Ya te has registrado para el recorrido de hoy.');
                setLoading(false);
                return;
            }

            // Insert registration
            const { error: insertError } = await supabase
                .from('tuesday_registrations')
                .insert([{
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    cedula: formData.cedula,
                    email: formData.email,
                    waiver_accepted: formData.waiver_accepted,
                    registration_date: today
                }]);

            if (insertError) throw insertError;

            // Count total attendances
            const { count, error: countError } = await supabase
                .from('tuesday_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('cedula', formData.cedula);

            if (countError) throw countError;
            setAttendanceCount(count);
            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting registration:', err);
            setError('Hubo un error al procesar tu registro. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
            <Helmet>
                <title>Registro Martes de Ruta - ProoMTB</title>
                <meta name="description" content="Registro y descargo de responsabilidad para los paseos nocturnos de los martes." />
            </Helmet>

            <AnimatePresence>
                {showSplash && (
                    <WelcomeSplash onEnter={() => setShowSplash(false)} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: !showSplash ? 1 : 0, y: !showSplash ? 0 : 20 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-white p-8 text-center relative overflow-hidden border-b border-gray-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <img
                            src={proomtbLogo}
                            alt="ProoMTB Logo"
                            className="h-12 md:h-16 w-auto mx-auto mb-4 object-contain"
                        />
                        <h1 className="text-black text-3xl font-black uppercase tracking-tighter">
                            Registro de Participante
                        </h1>
                        <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-[0.2em]">
                            Paseos Nocturnos Martes de Ruta
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-full">
                            <Award className="text-yellow-600" size={16} />
                            <span className="text-[10px] font-black uppercase text-yellow-700 tracking-wider">
                                ¡Regístrate y participa en la gran rifa!
                            </span>
                        </div>
                    </motion.div>
                    
                    {/* Decorative Blobs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50"></div>
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
                                className="space-y-6"
                            >
                                {/* Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nombre</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="first_name"
                                                required
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                                                placeholder="Ej. Juan"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Apellido</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="last_name"
                                                required
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                                                placeholder="Ej. Pérez"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Cédula</label>
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
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                                                placeholder="000-0000000-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Email</label>
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
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium text-black placeholder:text-gray-400"
                                                placeholder="usuario@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Waiver Section */}
                                <div className="mt-8 space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar">
                                        <h3 className="text-sm font-black uppercase mb-4 sticky top-0 bg-gray-50 py-1">DESCARGO DE RESPONSABILIDAD CIVIL O PENAL</h3>
                                        <div className="text-[11px] text-gray-600 space-y-4 leading-relaxed font-medium text-justify uppercase">
                                            <p>Por medio del presente documento, los abajo firmantes, quienes participamos voluntariamente en los paseos nocturnos de los martes de manera activa y en las rutas y eventos de ciclismo organizadas por PROO MTB, S.R.L., y su gerente Lic. Albel Corlione Luciano Fragoso; por medio del presente documento declaramos lo siguiente:</p>
                                            <p>1. Reconocemos y aceptamos que la participación en actividades de ciclismo conlleva riesgos inherentes, incluyendo pero no limitándose a: caídas, colisiones, accidentes con vehículos motorizados, condiciones climáticas adversas, y otros peligros asociados con la práctica de este deporte.</p>
                                            <p>2. Manifestamos que participamos por nuestra propia voluntad y riesgo, eximiendo a la tienda PROO MTB, S.R.L., y a su gerente Albel Luciano, así como a cualquier persona asociada a la organización del evento, de toda responsabilidad civil o penal por cualquier daño, lesión, pérdida, accidente, o consecuencia que pudiera surgir durante o después de la actividad.</p>
                                            <p>3. Nos comprometemos a cumplir con los requisitos básicos de seguridad, tales como: 
                                                a) Uso obligatorio de casco. 
                                                b) Luces delanteras y traseras en condiciones de funcionamiento. 
                                                c) Ropa y equipo de protección adecuado. 
                                                d) Mantenernos dentro del grupo durante el recorrido, evitando conductas que pongan en riesgo nuestra integridad o la de los demás participantes.
                                            </p>
                                            <p>4. Declaramos que no ocultamos ninguna condición médica, física o psicológica que pudiera comprometer nuestra capacidad para participar en esta actividad, y en caso de padecer alguna, asumimos plenamente la responsabilidad de los riesgos que esto conlleve.</p>
                                            <p>Por lo que a partir de la firma del presente acto, LE OTORGAMOS EL DESCARGO FORMAL, a la razón social PROO MTB, S.R.L., constituida de conformidad con las leyes de la República Dominicana, con su Registro Nacional de Contribuyente (RNC) No. 1-32-32671-7, con su domicilio social y establecido en la calle Eugenio Dechamps esquina Max Henriquez Ureña, Plaza Ysaclar No. 42, sector Los Prados, en esta ciudad de Santo Domingo de Guzmán, Distrito Nacional, Capital de la República Dominicana, debidamente representada para los fines del presente acto por su Gerente el señor Lic. Albel Corlione Luciano Fragoso.</p>
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors group border border-transparent hover:border-black/5">
                                        <div className="relative flex items-center h-5 mt-1">
                                            <input
                                                type="checkbox"
                                                name="waiver_accepted"
                                                checked={formData.waiver_accepted}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 leading-tight">
                                            Acepto los términos y condiciones del descargo de responsabilidad civil y penal. Declaro que la información proporcionada es verídica.
                                        </span>
                                    </label>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Registrar Mi Participación <ArrowRight size={20} />
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
                                <div className="relative inline-block mb-8">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle size={48} />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -inset-4 bg-black/5 rounded-full -z-10"
                                    />
                                </div>
                                
                                <h2 className="text-4xl font-black uppercase tracking-tight mb-4 text-black">¡Registro Exitoso!</h2>
                                <p className="text-gray-500 font-bold uppercase tracking-widest mb-8 text-sm">
                                    ¡Gracias por unirte, {formData.first_name}!
                                </p>

                                {/* Attendance Progress */}
                                <div className="max-w-sm mx-auto bg-black text-white p-6 rounded-[2rem] mb-12 shadow-2xl">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/40">Progreso de Asistencia</h4>
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        {[1, 2, 3].map((num) => (
                                            <div 
                                                key={num}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                                    num <= attendanceCount 
                                                    ? 'bg-white text-black scale-110' 
                                                    : 'bg-white/10 text-white/30'
                                                }`}
                                            >
                                                {num <= attendanceCount ? <CheckCircle size={20} /> : <Calendar size={20} />}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed text-balance">
                                        {attendanceCount >= 3 
                                            ? "🏆 ¡Felicidades! Has completado 3 carreras. ¡Ya estás participando en la gran rifa de los Martes!" 
                                            : `Llevas ${attendanceCount} de 3 carreras registradas para participar en la gran rifa.`}
                                    </p>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={() => setSubmitted(false)}
                                    className="text-black text-[10px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-2 hover:opacity-50 transition-all"
                                >
                                    Nuevo Registro
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    PROO MTB & ROAD © 2026 • Santo Domingo, RD
                </p>
            </motion.div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default TuesdayRegistration;
