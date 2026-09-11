import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import proomtbLogoWhite from '../assets/proomtb_logo_white.png';
import flyerImage from '../assets/flyer-aguinaldo-navideno.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, 
    User, 
    Mail, 
    CreditCard, 
    ArrowRight, 
    Loader2, 
    Phone, 
    Bike, 
    Coffee, 
    Music, 
    Gift, 
    Calendar, 
    Share2, 
    Sparkles, 
    Ticket, 
    MapPin, 
    ShieldCheck, 
    X,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Snowflakes background effect
const SnowEffect = () => {
    const flakes = Array.from({ length: 30 });
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
            {flakes.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: -20,
                        x: `${(i * 3.3 + Math.random() * 2)}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                        scale: Math.random() * 0.6 + 0.4
                    }}
                    animate={{
                        y: ['0vh', '105vh'],
                        x: [
                            `${(i * 3.3)}%`,
                            `${(i * 3.3 + (i % 2 === 0 ? 3 : -3))}%`,
                            `${(i * 3.3)}%`
                        ]
                    }}
                    transition={{
                        duration: 8 + (i % 7) * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: (i % 5) * 1.2
                    }}
                    className="absolute top-0 text-white/30 text-xs select-none"
                >
                    ❄
                </motion.div>
            ))}
        </div>
    );
};

// Flyer Splash Modal
const FlyerSplash = ({ onEnter }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-hidden"
        >
            <SnowEffect />
            <div className="relative z-30 w-full h-full max-w-lg flex flex-col items-center justify-center">
                {/* Festive Glow Behind Flyer */}
                <div className="absolute w-72 h-72 bg-red-600/30 rounded-full blur-[100px] pointer-events-none -top-10"></div>
                <div className="absolute w-72 h-72 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none -bottom-10"></div>

                <div className="relative group max-h-[75vh] flex items-center justify-center">
                    <motion.img 
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                        src={flyerImage} 
                        alt="Flyer Oficial Águinaldo Navideño ProoMTB x Raymon" 
                        className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] border border-white/10"
                    />
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-xs"
                >
                    <button
                        onClick={onEnter}
                        className="w-full py-4 px-8 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white font-black uppercase tracking-widest rounded-full transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] text-sm"
                    >
                        <span>Inscribirme Gratis</span>
                        <ArrowRight size={18} />
                    </button>
                </motion.div>

                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-3">
                    Cupos Limitados • Registro Obligatorio
                </p>
            </div>
        </motion.div>
    );
};

const AguinaldoRegistration = () => {
    const [showFlyer, setShowFlyer] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        email: '',
        phone: '',
        waiver_accepted: false
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ticketCode, setTicketCode] = useState('');
    const [error, setError] = useState(null);

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
            // 1. Check if user already registered by Cedula
            const { data: existing, error: checkError } = await supabase
                .from('aguinaldo_registrations')
                .select('id, ticket_code')
                .eq('cedula', formData.cedula);

            if (checkError && checkError.code !== '42P01') {
                // Ignore if table doesn't exist yet in development, but log
                console.warn('Check error:', checkError);
            }

            if (existing && existing.length > 0) {
                setError(`Esta cédula ya está registrada para el Águinaldo Navideño con el boleto: ${existing[0].ticket_code}`);
                setLoading(false);
                return;
            }

            // 2. Obtener el conteo actual para generar el código secuencial (AGU-001, AGU-002, etc.)
            const { count } = await supabase
                .from('aguinaldo_registrations')
                .select('*', { count: 'exact', head: true });

            const nextNumber = (count || 0) + 1;
            const generatedCode = `AGU-${nextNumber.toString().padStart(3, '0')}`;

            const { data: insertedData, error: insertError } = await supabase
                .from('aguinaldo_registrations')
                .insert([{
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    cedula: formData.cedula.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    ticket_code: generatedCode,
                    status: 'registered',
                    checked_in: false,
                    chocolate_claimed: false,
                    waiver_accepted: true
                }])
                .select()
                .single();

            if (insertError) {
                console.error('Insert error in aguinaldo_registrations:', insertError);
            }

            const finalCode = insertedData?.ticket_code || generatedCode;
            setTicketCode(finalCode);
            setSubmitted(true);
        } catch (err) {
            console.error('Registration Error:', err);
            setError('Hubo un inconveniente al procesar tu registro. Por favor inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleShareWhatsApp = () => {
        const message = encodeURIComponent(
            `🚴‍♂️🎄 ¡Ya me inscribí al Águinaldo Navideño de ProoMTB & Raymon para este Martes 1 de Diciembre! 🎉\n\n` +
            `Incluye: Ruta Ciclista + Chocolate Caliente + Música en Vivo + Gran Rifa navideña 🎁☕\n\n` +
            `¡Es 100% Gratis! Inscríbete aquí antes de que se agoten los cupos:\n${window.location.origin}/registro-aguinaldo`
        );
        window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
    };

    const handleAddToCalendar = () => {
        const title = encodeURIComponent("Águinaldo Navideño 🎄 - ProoMTB & Raymon");
        const details = encodeURIComponent(
            `Águinaldo Navideño ProoMTB & RAYMON.\nBoleto: ${ticketCode}\nIncluye: Ruta Ciclista, Chocolate Caliente gratis, Música en vivo y Gran Rifa.\nLugar: Proo MTB & Road, Plaza Ysaclar, Los Prados, Santo Domingo.`
        );
        const location = encodeURIComponent("Proo MTB & Road, Calle Eugenio Deschamps esq. Max Henríquez Ureña, Plaza Ysaclar #42, Los Prados, Santo Domingo");
        // Martes 1 de Diciembre
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261201T230000Z/20261202T030000Z`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
            <Helmet>
                <title>Inscripción Águinaldo Navideño - ProoMTB & Raymon</title>
                <meta name="description" content="Inscripción Gratuita al Águinaldo Navideño: Ruta Ciclista, Chocolate Caliente, Música en Vivo y Gran Rifa este Martes 1 de Diciembre con ProoMTB y Raymon." />
                <meta property="og:title" content="Águinaldo Navideño - ProoMTB & Raymon" />
                <meta property="og:description" content="Martes 1 de Diciembre. ¡Totalmente Gratis! Ruta Ciclista, Chocolate Caliente, Música en Vivo y Rifa. ¡Cupos Limitados!" />
            </Helmet>

            <SnowEffect />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Flyer Splash Modal */}
            <AnimatePresence>
                {showFlyer && (
                    <FlyerSplash onEnter={() => setShowFlyer(false)} />
                )}
            </AnimatePresence>

            {/* Main Registration Card */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: !showFlyer ? 1 : 0, y: !showFlyer ? 0 : 25 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl bg-[#121318]/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col lg:flex-row relative z-30"
            >
                {/* Left Column - Event Details & Festive Branding */}
                <div className="bg-gradient-to-br from-[#161720] via-[#101116] to-[#0c0d11] p-8 lg:p-12 lg:w-5/12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
                    {/* Corner Festive Holly decoration */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-80">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Edición Navideña</span>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Logos Header */}
                        <div>
                            <img src={proomtbLogoWhite} alt="ProoMTB" className="h-9 w-auto object-contain mb-3" />
                            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                <span>PRO MTB & ROAD</span>
                                <span className="text-red-500">✕</span>
                                <span>RAYMON</span>
                            </div>
                        </div>

                        {/* Title Display */}
                        <div className="space-y-2 pt-2">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-2">
                                <Sparkles size={14} /> Paseo Especial
                            </h3>
                            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                                ÁGUINALDO <br />
                                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                                    Navideño
                                </span>
                            </h1>
                        </div>

                        {/* Date & Free Badge */}
                        <div className="bg-gradient-to-r from-red-600/20 to-red-900/10 border border-red-500/30 rounded-2xl p-4 space-y-1 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-red-300 flex items-center gap-1.5">
                                    <Calendar size={14} /> Martes 1 de Diciembre
                                </span>
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md">
                                    GRATIS
                                </span>
                            </div>
                            <p className="text-2xl font-black text-white tracking-tight">¡Totalmente Gratis!</p>
                            <p className="text-[11px] text-gray-400 font-medium">Cupos limitados • Registro previo obligatorio</p>
                        </div>

                        {/* 4 Feature Highlights */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest border-b border-white/10 pb-2">
                                ¿Qué te espera en el Águinaldo?
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                                    <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                                        <Bike size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase text-white">Ruta Ciclista</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">Recorrido nocturno con asistencia</span>
                                </div>

                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                        <Coffee size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase text-white">Chocolate Caliente</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">Tradicional chocolate caliente gratis</span>
                                </div>

                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                        <Music size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase text-white">Música en Vivo</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">Ambiente y animación festiva</span>
                                </div>

                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Gift size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase text-white">Gran Rifa</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">Sorteo de premios de temporada</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="flex items-start gap-2.5 pt-2 text-gray-400 text-xs">
                            <MapPin size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="leading-snug">
                                <b className="text-white">Punto de Encuentro:</b> Proo MTB & Road, Plaza Ysaclar #42, Los Prados, Santo Domingo.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Flyer Preview Button */}
                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setShowFlyer(true)}
                            className="text-xs text-red-400 font-black uppercase tracking-wider hover:text-red-300 transition-colors flex items-center gap-1.5"
                        >
                            <Sparkles size={14} /> Ver Flyer Oficial
                        </button>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            proomtb.com
                        </span>
                    </div>
                </div>

                {/* Right Column - Registration Form or Confirmation Ticket */}
                <div className="p-8 lg:p-12 lg:w-7/12 flex flex-col justify-center bg-[#13141a]">
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
                                <div>
                                    <h2 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                                        Formulario de Inscripción
                                    </h2>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Completa tus datos para asegurar tu cupo y obtener tu boleto para el chocolate caliente y la rifa.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Nombre */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                            Nombre
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                                                <User size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                name="first_name"
                                                required
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder="Ej. Juan"
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm font-medium transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Apellido */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                            Apellido
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                                                <User size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                name="last_name"
                                                required
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                placeholder="Ej. Pérez"
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm font-medium transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Cédula */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                            Cédula de Identidad
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                                                <CreditCard size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                name="cedula"
                                                required
                                                value={formData.cedula}
                                                onChange={handleChange}
                                                placeholder="000-0000000-0"
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm font-medium transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono / WhatsApp */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                            Teléfono / WhatsApp
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                                                <Phone size={16} />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="809-000-0000"
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm font-medium transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Correo Electrónico */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="tu.correo@ejemplo.com"
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm font-medium transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Waiver Accordion */}
                                <div className="space-y-3 pt-2">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 max-h-40 overflow-y-auto text-[11px] text-gray-400 space-y-2 leading-relaxed text-justify">
                                        <p className="font-bold text-white uppercase text-[11px] sticky top-0 bg-[#171821] py-0.5">
                                            Descargo de Responsabilidad Civil o Penal - Águinaldo Navideño
                                        </p>
                                        <p>
                                            Por medio del presente documento, los abajo firmantes, quienes participamos voluntariamente en el evento especial <b>ÁGUINALDO NAVIDEÑO (Martes 1 de Diciembre)</b> organizado por <b>PROO MTB, S.R.L.</b> y su marca aliada <b>RAYMON</b>, declaramos que:
                                        </p>
                                        <p>
                                            1. Reconocemos los riesgos inherentes a la práctica del ciclismo en vías públicas y asumimos voluntariamente la responsabilidad de nuestra participación.
                                        </p>
                                        <p>
                                            2. Eximimos a PROO MTB, S.R.L., sus directivos, patrocinadores y equipo de apoyo de toda responsabilidad civil o penal por cualquier contingencia durante la actividad.
                                        </p>
                                        <p>
                                            3. Nos comprometemos a portar obligatoriamente <b>casco protector y luces delanteras y traseras operativas</b>.
                                        </p>
                                    </div>

                                    <label className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-colors cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="waiver_accepted"
                                            checked={formData.waiver_accepted}
                                            onChange={handleChange}
                                            className="mt-0.5 w-4 h-4 rounded border-gray-600 text-red-600 focus:ring-red-500 bg-black/40 cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-300 font-medium leading-snug group-hover:text-white transition-colors">
                                            Acepto los términos del descargo de responsabilidad y confirmo mi compromiso con las normas de seguridad del Águinaldo Navideño.
                                        </span>
                                    </label>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2"
                                    >
                                        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:brightness-110 active:scale-[0.98] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Generando tu Pase Gratuito...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Completar Registro Gratuito</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            /* Success Confirmation Ticket Screen */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-6 flex flex-col items-center text-center"
                            >
                                {/* Success Icon with Pulse */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                        <CheckCircle size={44} />
                                    </div>
                                    <span className="absolute -top-1 -right-1 text-2xl">🎄</span>
                                </div>

                                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                                    ¡Registro Confirmado!
                                </h2>
                                <p className="text-gray-400 text-xs max-w-md mb-6 font-medium leading-relaxed">
                                    ¡Todo listo, <b className="text-white">{formData.first_name}</b>! Ya tienes tu lugar asegurado para el <b className="text-red-400">Águinaldo Navideño</b> este Martes 1 de Diciembre.
                                </p>

                                {/* Digital Christmas Ticket */}
                                <div className="w-full max-w-md bg-gradient-to-b from-[#1c1d27] to-[#14151e] border-2 border-red-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden text-left mb-6">
                                    {/* Top Ticket Notch / Ribbon */}
                                    <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                                                <Ticket size={12} /> Pase Oficial del Evento
                                            </span>
                                            <h4 className="text-lg font-black uppercase text-white tracking-tight">ÁGUINALDO NAVIDEÑO</h4>
                                            <p className="text-[11px] text-gray-400">Martes 1 de Diciembre • ProoMTB & Raymon</p>
                                        </div>
                                        <div className="bg-red-600/20 border border-red-500/50 px-3 py-1.5 rounded-xl text-center">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-red-300 block">Boleto Rifa</span>
                                            <span className="text-lg font-mono font-black text-white">{ticketCode}</span>
                                        </div>
                                    </div>

                                    {/* Participant Info */}
                                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                                        <div>
                                            <span className="text-[10px] uppercase text-gray-500 font-bold block">Participante</span>
                                            <span className="text-white font-bold">{formData.first_name} {formData.last_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase text-gray-500 font-bold block">Cédula</span>
                                            <span className="text-white font-mono">{formData.cedula}</span>
                                        </div>
                                    </div>

                                    {/* Included Benefits Badges */}
                                    <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1.5">
                                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                                            <Gift size={12} /> Beneficios Incluidos con tu Pase:
                                        </span>
                                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-300 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-emerald-400">✓</span> Ruta Nocturna Guiada
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-emerald-400">✓</span> 1x Chocolate Caliente
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-emerald-400">✓</span> Música en Vivo
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-emerald-400">✓</span> 1x Boleto de Rifa ({ticketCode})
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-center text-gray-500 mt-3 uppercase tracking-wider font-bold">
                                        Presenta tu cédula o este código al llegar a la tienda
                                    </p>
                                </div>

                                {/* Share & Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                                    <button
                                        type="button"
                                        onClick={handleShareWhatsApp}
                                        className="w-full sm:w-1/2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/20"
                                    >
                                        <Share2 size={16} />
                                        <span>Invitar Amigos</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAddToCalendar}
                                        className="w-full sm:w-1/2 py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-xs border border-white/10"
                                    >
                                        <Calendar size={16} />
                                        <span>Agendar en Google</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmitted(false);
                                        setFormData({
                                            first_name: '',
                                            last_name: '',
                                            cedula: '',
                                            email: '',
                                            phone: '',
                                            waiver_accepted: false
                                        });
                                    }}
                                    className="mt-6 text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-widest border-b border-gray-600 pb-1 transition-colors"
                                >
                                    Inscribir a otra persona
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Bottom Footer Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest relative z-30 flex items-center justify-center gap-2"
            >
                <span>PROO MTB & ROAD</span>
                <span>•</span>
                <span>RAYMON</span>
                <span>•</span>
                <span>SANTO DOMINGO, RD</span>
            </motion.div>
        </div>
    );
};

export default AguinaldoRegistration;
