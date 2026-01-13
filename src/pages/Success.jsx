import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Success = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4">
            <Helmet>
                <title>¡Gracias por tu consulta! | PROOMTB</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="bg-green-50 p-6 rounded-full">
                        <CheckCircle className="w-20 h-20 text-[#25D366]" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6"
                >
                    ¡Consulta Enviada!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto"
                >
                    Gracias por contactar con PROOMTB. Tu consulta ha sido enviada correctamente a través de WhatsApp. Te responderemos lo antes posible.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <Link
                        to="/catalogo"
                        className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all group"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Seguir Comprando
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a
                        href="https://wa.me/8297163555"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        ¿Otra duda?
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
                >
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-2">Próximos pasos</p>
                    <p className="text-gray-600">
                        Si no recibes respuesta en unos minutos, asegúrate de haber enviado el mensaje pre-escrito que apareció en tu WhatsApp.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Success;
