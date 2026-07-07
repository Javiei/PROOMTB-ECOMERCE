import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import proomtbLogoWhite from '../assets/proomtb_logo_white.png';
import flyerImage from '../assets/flyer-proomtb-1920x1080.jpg.jpeg';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, Mail, CreditCard, ArrowRight, Loader2, Upload, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const WelcomeSplash = ({ onEnter, isGuest }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#00e5ff_0%,_transparent_50%)]"
                />
            </div>

            <div className="relative z-10 max-w-lg w-full">
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

                <div className="mb-6 overflow-hidden">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.6 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-white text-md font-black uppercase tracking-[0.3em] mb-2"
                    >
                        Inscripciones Abiertas
                    </motion.h2>
                    <div className="flex flex-col items-center justify-center">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 1.2 }}
                            className="text-[#00e5ff] text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none"
                        >
                            6TO ANIVERSARIO
                        </motion.h1>
                        <motion.span
                            initial={{ y: 50, opacity: 0, skewX: 20 }}
                            animate={{ y: 0, opacity: 1, skewX: -10 }}
                            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 1.4 }}
                            className="text-white text-4xl md:text-5xl mt-4 font-black uppercase italic tracking-tighter leading-none block relative"
                        >
                            PROO MTB
                        </motion.span>
                    </div>
                </div>

                <motion.button
                    initial={{ y: 30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 10, delay: 2.2 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEnter}
                    className="group relative px-12 py-4 mt-8 bg-[#00e5ff] text-black font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:bg-[#00cce6]"
                >
                    <span className="relative z-10 flex items-center gap-3 font-black">
                        {isGuest ? 'Registrarme como Invitado' : 'Inscribirme Ahora'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
};

const FlyerSplash = ({ onEnter }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4 overflow-hidden"
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <motion.img 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    src={flyerImage} 
                    alt="Flyer Aniversario" 
                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
                <motion.button
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEnter}
                    className="mt-6 px-10 py-3 bg-[#00e5ff] text-black font-black uppercase tracking-widest rounded-full transition-all hover:bg-[#00cce6] flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                    Continuar <ArrowRight size={20} />
                </motion.button>
            </div>
        </motion.div>
    );
};

const AnniversaryRegistration = ({ isGuest = false }) => {
    const [showFlyer, setShowFlyer] = useState(true);
    const [showSplash, setShowSplash] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        email: '',
        phone: '',
        jersey_size: isGuest ? 'N/A' : '',
        registration_type: isGuest ? 'invitado' : 'full',
        waiver_accepted: false
    });
    
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Por favor sube solo imágenes (JPG, PNG, etc).');
                return;
            }
            setReceiptFile(file);
            setReceiptPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isGuest && formData.registration_type === 'full' && !formData.jersey_size) {
            setError('Por favor selecciona tu talla de jersey.');
            return;
        }

        if (!isGuest && !receiptFile) {
            setError('Debes subir la foto de tu comprobante de pago.');
            return;
        }

        if (!formData.waiver_accepted) {
            setError('Debes aceptar el descargo de responsabilidad para registrarte.');
            return;
        }

        setLoading(true);
        setError(null);
        setUploadProgress(10);

        try {
            let publicUrl = 'invitado';

            if (!isGuest && receiptFile) {
                // 1. Upload Receipt Image
                const fileExt = receiptFile.name.split('.').pop();
                const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
                
                setUploadProgress(30);
                
                const { error: uploadError } = await supabase.storage
                    .from('activity_photos') // using existing bucket
                    .upload(`anniversary/${fileName}`, receiptFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;
                
                setUploadProgress(70);

                // 2. Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from('activity_photos')
                    .getPublicUrl(`anniversary/${fileName}`);

                publicUrl = publicUrlData.publicUrl;
            }

            setUploadProgress(85);

            // 3. Save to Database
            const { error: insertError } = await supabase
                .from('anniversary_registrations')
                .insert([{
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    cedula: formData.cedula,
                    email: formData.email,
                    phone: formData.phone,
                    jersey_size: isGuest ? 'N/A' : (formData.registration_type === 'basico' ? 'N/A' : formData.jersey_size),
                    registration_type: isGuest ? 'invitado' : formData.registration_type,
                    receipt_url: publicUrl,
                    status: 'pending'
                }]);

            if (insertError) throw insertError;

            setUploadProgress(100);
            setSubmitted(true);
        } catch (err) {
            console.error('Registration Error:', err);
            setError('Hubo un error al enviar tu inscripción. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
            <Helmet>
                <title>Inscripción 6to Aniversario - ProoMTB</title>
            </Helmet>

            <AnimatePresence>
                {showFlyer && (
                    <FlyerSplash onEnter={() => { setShowFlyer(false); setShowSplash(true); }} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSplash && (
                    <WelcomeSplash onEnter={() => setShowSplash(false)} isGuest={isGuest} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: (!showSplash && !showFlyer) ? 1 : 0, y: (!showSplash && !showFlyer) ? 0 : 20 }}
                className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Left Side - Info & Bank Details */}
                <div className="bg-[#111] text-white p-8 lg:p-12 lg:w-5/12 flex flex-col justify-between relative overflow-hidden">
                    {/* Background accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff] rounded-full blur-[100px] opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-5"></div>
                    
                    <div className="relative z-10">
                        <img src={proomtbLogoWhite} alt="ProoMTB" className="h-10 mb-8" />
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-[#00e5ff] mb-2">
                            6to Aniversario
                        </h2>
                        <p className="text-white/60 text-sm font-medium mb-8 uppercase tracking-widest">
                            Proo MTB & Road
                        </p>
                        
                        {isGuest ? (
                            <div className="space-y-6 mt-6">
                                <div className="bg-[#00e5ff]/10 rounded-2xl p-6 border-2 border-[#00e5ff] backdrop-blur-sm">
                                    <h3 className="text-sm font-black uppercase text-[#00e5ff] tracking-wider mb-2">Pase de Invitado Especial</h3>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                                        Este enlace es exclusivo para invitados de honor del 6to Aniversario de ProoMTB.
                                    </p>
                                </div>
                                
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm space-y-3">
                                    <h4 className="text-xs font-black uppercase text-[#00e5ff] tracking-widest border-b border-white/10 pb-1">Beneficios</h4>
                                    <ul className="text-xs text-white/70 space-y-2 font-medium list-disc list-inside">
                                        <li>Acceso completo al evento</li>
                                        <li>Participación en rifas y dinámicas</li>
                                        <li>Asistencia mecánica en ruta</li>
                                        <li>Fotografías oficiales</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Nota</h4>
                                    <p className="text-[11px] text-white/50 leading-normal font-medium">
                                        Esta modalidad de registro no incluye Jersey del evento ni requiere pago de inscripción.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/10 rounded-2xl p-5 border border-[#00e5ff]/20 backdrop-blur-sm">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xs font-black uppercase text-[#00e5ff]">Kit Full</h3>
                                            <span className="text-[10px] font-black bg-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded uppercase tracking-wider">Jersey Incluido</span>
                                        </div>
                                        <p className="text-2xl font-black text-white mt-1">RD$ 2,950</p>
                                        <p className="text-[11px] text-white/60 mt-1 font-medium leading-snug">Incluye Jersey oficial del evento, kit completo y regalos.</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xs font-black uppercase text-gray-400">Inscripción Básica</h3>
                                            <span className="text-[10px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase tracking-wider">Sin Jersey</span>
                                        </div>
                                        <p className="text-2xl font-black text-white mt-1">RD$ 1,500</p>
                                        <p className="text-[11px] text-white/60 mt-1 font-medium leading-snug">Sólo inscripción al evento, soporte, fotos y rifa. No incluye Jersey.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase text-[#00e5ff] tracking-widest border-b border-white/10 pb-2">
                                        Cuentas Bancarias
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs font-bold text-white uppercase">Banco Popular</p>
                                            <p className="text-lg font-black text-[#00e5ff] font-mono mt-1">823658349</p>
                                            <p className="text-[10px] text-white/60 uppercase mt-1">PROO MTB SRL (Corriente)</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs font-bold text-white uppercase">Banreservas</p>
                                            <p className="text-lg font-black text-[#00e5ff] font-mono mt-1">9609123095</p>
                                            <p className="text-[10px] text-white/60 uppercase mt-1">PROO MTB SRL (Ahorro)</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs font-bold text-white uppercase">Banco Santa Cruz</p>
                                            <p className="text-lg font-black text-[#00e5ff] font-mono mt-1">11312100000638</p>
                                            <p className="text-[10px] text-white/60 uppercase mt-1">PROO MTB SRL (Ahorro)</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs font-bold text-white uppercase">Banco BHD</p>
                                            <p className="text-lg font-black text-[#00e5ff] font-mono mt-1">12831830011</p>
                                            <p className="text-[10px] text-white/60 uppercase mt-1">Albel Luciano (Ahorros)</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 lg:p-12 lg:w-7/12">
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
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black uppercase text-black">Tus Datos</h2>
                                    <p className="text-gray-500 text-sm mt-1">Completa el formulario y sube tu pago para asegurar tu cupo.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nombre</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                                                <User size={18} />
                                            </div>
                                            <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium" placeholder="Juan" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Apellido</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                                                <User size={18} />
                                            </div>
                                            <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium" placeholder="Pérez" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Cédula</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                                                <CreditCard size={18} />
                                            </div>
                                            <input type="text" name="cedula" required value={formData.cedula} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium" placeholder="000-0000000-0" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Teléfono / WhatsApp</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                                                <Phone size={18} />
                                            </div>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium" placeholder="809-000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Correo Electrónico</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                                                <Mail size={18} />
                                            </div>
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium" placeholder="correo@ejemplo.com" />
                                        </div>
                                    </div>
                                    
                                    {!isGuest && (
                                        <>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Tipo de Inscripción</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.registration_type === 'full' ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-black uppercase">Kit Full</span>
                                                            <input
                                                                type="radio"
                                                                name="registration_type"
                                                                value="full"
                                                                checked={formData.registration_type === 'full'}
                                                                onChange={handleChange}
                                                                className="text-black focus:ring-black"
                                                            />
                                                        </div>
                                                        <span className="text-lg font-black text-black mt-1">RD$ 2,950</span>
                                                        <span className="text-xs text-gray-500 mt-1 leading-snug">Incluye Jersey oficial del evento y kit oficial.</span>
                                                    </label>
                                                    <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.registration_type === 'basico' ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-black uppercase">Básico</span>
                                                            <input
                                                                type="radio"
                                                                name="registration_type"
                                                                value="basico"
                                                                checked={formData.registration_type === 'basico'}
                                                                onChange={handleChange}
                                                                className="text-black focus:ring-black"
                                                            />
                                                        </div>
                                                        <span className="text-lg font-black text-black mt-1">RD$ 1,500</span>
                                                        <span className="text-xs text-gray-500 mt-1 leading-snug">Sólo inscripción al evento. No incluye Jersey.</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {formData.registration_type === 'full' && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-1.5 md:col-span-2 overflow-hidden"
                                                    >
                                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Talla de Jersey</label>
                                                        <select 
                                                            name="jersey_size" 
                                                            required={formData.registration_type === 'full'} 
                                                            value={formData.jersey_size} 
                                                            onChange={handleChange} 
                                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm font-medium cursor-pointer"
                                                        >
                                                            <option value="" disabled>Selecciona tu talla</option>
                                                            <option value="XS">XS - Extra Pequeño</option>
                                                            <option value="S">S - Pequeño</option>
                                                            <option value="M">M - Mediano</option>
                                                            <option value="L">L - Grande</option>
                                                            <option value="XL">XL - Extra Grande</option>
                                                            <option value="XXL">XXL</option>
                                                        </select>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}
                                </div>

                                {/* File Upload */}
                                {!isGuest && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-black uppercase mb-4">Comprobante de Transferencia</h3>
                                        <div 
                                            onClick={triggerFileInput}
                                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${receiptPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            
                                            {receiptPreview ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md mb-3">
                                                        <img src={receiptPreview} alt="Comprobante" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs font-bold uppercase">Cambiar</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-green-600 font-bold text-sm flex items-center gap-1"><CheckCircle size={16}/> Comprobante adjuntado</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center py-4">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                                        <Upload className="text-gray-400" size={24} />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-700">Toca para subir la foto del recibo</p>
                                                    <p className="text-xs text-gray-500 mt-1">Solo imágenes (JPG, PNG)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Waiver Section */}
                                <div className="mt-8 space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar">
                                        <h3 className="text-sm font-black uppercase mb-4 sticky top-0 bg-gray-50 py-1">DESCARGO DE RESPONSABILIDAD CIVIL O PENAL</h3>
                                        <div className="text-[11px] text-gray-600 space-y-4 leading-relaxed font-medium text-justify uppercase">
                                            <p>Por medio del presente documento, los abajo firmantes, quienes participamos voluntariamente en el evento 6to Aniversario organizado por PROO MTB, S.R.L., y su gerente Lic. Albel Corlione Luciano Fragoso; por medio del presente documento declaramos lo siguiente:</p>
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
                                    <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Procesando... {uploadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            Enviar Inscripción <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 flex flex-col items-center justify-center h-full"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-2">
                                    {isGuest ? '¡Registro Recibido!' : '¡Inscripción Recibida!'}
                                </h2>
                                <p className="text-gray-500 font-medium text-sm max-w-md mx-auto leading-relaxed">
                                    {isGuest 
                                        ? 'Hemos recibido tus datos de registro como Invitado Especial.' 
                                        : 'Hemos recibido tus datos y tu comprobante de pago. Nuestro equipo validará la información pronto.'
                                    }
                                </p>
                                
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mt-8 max-w-sm w-full">
                                    <h4 className="text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">¿Qué Sigue?</h4>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {isGuest 
                                            ? <>Una vez aprobado, recibirás un correo electrónico oficial con tu código especial <span className="font-mono bg-cyan-100 text-cyan-800 px-1 rounded">PRO-XXX</span> para la rifa y acceso al evento.</>
                                            : <>Una vez aprobado, recibirás un correo electrónico oficial con tu código especial <span className="font-mono bg-cyan-100 text-cyan-800 px-1 rounded">PRO-XXX</span> para la rifa y la bicicleta.</>
                                        }
                                    </p>
                                </div>
                                
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="mt-8 text-black text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-all"
                                >
                                    Volver al Inicio
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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

export default AnniversaryRegistration;
