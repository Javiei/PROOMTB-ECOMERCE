import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaBicycle, FaFlagCheckered, FaRedo, FaChevronRight } from 'react-icons/fa';

const PRIZES = [
    { id: 1, name: "Termo", icon: "💧", color: "#06b6d4" }, // Cyan-500
    { id: 2, name: "Gorras", icon: "🧢", color: "black" },  // Keep black for stark contrast on white
    { id: 3, name: "Mantenimiento Full", icon: "🔧", color: "black" },
    { id: 4, name: "Llaveros", icon: "🔑", color: "black" },
    { id: 5, name: "Tshirt", icon: "👕", color: "#06b6d4" } // Cyan-500
];

const Giveaway = () => {
    const [isRacing, setIsRacing] = useState(false);
    const [result, setResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [progresses, setProgresses] = useState([0, 0, 0, 0, 0]);
    const [winnerIndex, setWinnerIndex] = useState(null);

    const handleReset = () => {
        setShowModal(false);
        setResult(null);
        setProgresses([0, 0, 0, 0, 0]);
        setWinnerIndex(null);
    };

    const startRace = () => {
        if (isRacing) return;

        setIsRacing(true);
        setShowModal(false);
        setResult(null);
        setProgresses([0, 0, 0, 0, 0]);

        const targetWinner = Math.floor(Math.random() * PRIZES.length);
        setWinnerIndex(targetWinner);

        let startTime = null;
        const raceDuration = 4000;

        const profiles = PRIZES.map((_, i) => {
            if (i === targetWinner) {
                return { targetDuration: raceDuration, curve: Math.random() * 0.5 + 0.8 };
            } else {
                return { targetDuration: raceDuration + 600 + Math.random() * 1200, curve: Math.random() * 0.5 + 0.8 };
            }
        });

        const animateRace = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            let winnerFinished = false;

            const newProgresses = profiles.map((p, i) => {
                let t = Math.min(elapsed / p.targetDuration, 1);
                t = Math.pow(t, p.curve); // slight ease
                const currentProgress = t * 100;

                if (i === targetWinner && currentProgress >= 100) {
                    winnerFinished = true;
                }
                return currentProgress;
            });

            setProgresses(newProgresses);

            if (winnerFinished) {
                setTimeout(() => {
                    setResult(PRIZES[targetWinner]);
                    setIsRacing(false);
                    setShowModal(true);
                }, 800);
            } else {
                requestAnimationFrame(animateRace);
            }
        };

        requestAnimationFrame(animateRace);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 py-12 px-4 md:px-8 flex flex-col items-center overflow-hidden">
            <Helmet>
                <title>Sorteo Premium | PRO MTB & ROAD</title>
            </Helmet>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 max-w-3xl mx-auto"
            >
                <span className="text-cyan-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Experiencia Premium</span>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black leading-none">
                    El Sprint Final
                </h1>
                <p className="text-gray-600 text-lg md:text-xl font-light">
                    Alta competencia por accesorios exclusivos. Da inicio a la carrera y asegura tu premio en el podio.
                </p>
            </motion.div>

            {/* The Race Track Container - Light Premium Mode */}
            <div className="w-full max-w-5xl bg-gray-50 border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 md:p-8 mb-12 relative rounded-2xl overflow-hidden">
                {/* Finish Line Checkered Strip with Glow */}
                <div className="absolute right-4 md:right-16 top-0 bottom-0 w-8 md:w-16 bg-black z-0 flex items-center justify-center shadow-[-20px_0_30px_rgba(230,57,70,0.1)] border-l-2 border-red-500"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px', opacity: 0.9 }}>

                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent pointer-events-none" />

                    <div className="bg-black/90 px-2 py-4 rounded font-black text-xs uppercase rotate-90 tracking-[0.3em] text-white whitespace-nowrap hidden md:block border border-gray-800 shadow-xl">
                        Línea de Meta
                    </div>
                </div>

                <div className="flex flex-col gap-3 md:gap-5 relative z-10 w-full pr-12 md:pr-24">
                    {PRIZES.map((prize, i) => (
                        <div key={i} className="flex relative items-center h-16 md:h-24 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group">

                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none" />

                            {/* Track line dashes */}
                            <div className="absolute inset-x-0 bottom-0 h-[2px] opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 40px, transparent 40px, transparent 80px)' }}></div>

                            {/* Starting Block / Rider Identity */}
                            <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gray-100 border-r border-gray-200 flex items-center justify-center transition-opacity duration-500 z-10 ${isRacing ? 'opacity-30' : 'opacity-100'}`}>
                                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                                    {prize.icon}
                                </span>
                            </div>

                            {/* The Bicycle Rider */}
                            <div
                                className="absolute z-20 transition-transform flex flex-col items-center justify-center h-full"
                                style={{
                                    left: `${progresses[i]}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="relative flex flex-col items-center">
                                    <FaBicycle
                                        className="text-4xl md:text-6xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.1)]"
                                        style={{ color: prize.color }}
                                    />
                                    {/* Custom Wind/Speed effect if racing */}
                                    {isRacing && progresses[i] > 0 && progresses[i] < 100 && (
                                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-cyan-600/30 rounded-full animate-pulse blur-[1px]"></div>
                                    )}

                                    {/* Winner indication effect if finished */}
                                    {winnerIndex === i && progresses[i] >= 100 && (
                                        <div className="absolute inset-[-10px] animate-ping rounded-full border border-cyan-500 opacity-60"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Start Button */}
            {!isRacing && !result && (
                <button
                    onClick={startRace}
                    className="group relative flex items-center justify-center gap-4 bg-black text-white px-12 py-5 rounded-none hover:bg-cyan-600 font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.4)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-[-15deg] group-hover:animate-[shine_1s_forwards]" />
                    <FaFlagCheckered className="text-2xl" />
                    <span className="text-lg">COMENZAR SPRINT</span>
                </button>
            )}

            {/* High-End Prize Modal */}
            <AnimatePresence>
                {showModal && result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white p-10 md:p-14 max-w-lg w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative border border-gray-200"
                        >
                            {/* Subtle accent line matching brand */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-cyan-600"></div>

                            <div className="text-7xl md:text-8xl mb-8 filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.1)] scale-110">
                                🏆
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.1em] mb-2 text-black leading-tight">
                                PRIMER LUGAR
                            </h2>
                            <p className="text-gray-500 mb-8 font-light text-lg">
                                El ciclista portando el <strong className="text-black font-bold">{result.name}</strong> cruzó la meta.
                            </p>

                            <div className="flex items-center justify-center gap-6 p-6 bg-gray-50 border border-gray-200 mb-10 transition-transform hover:scale-105 duration-300 rounded shadow-sm">
                                <span className="text-4xl">{result.icon}</span>
                                <span className="text-2xl font-black uppercase tracking-wider text-black">{result.name}</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleReset}
                                    className="w-full py-4 bg-black hover:bg-gray-800 text-white font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                                >
                                    RECLAMAR RECOMPENSA
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-full py-3 text-gray-400 hover:text-black font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 text-xs"
                                >
                                    <FaRedo className="text-xs" /> VOLVER A COMPETIR
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 text-center text-[#555] text-xs font-semibold max-w-md uppercase tracking-[0.15em] leading-relaxed">
                <p>Promoción exclusiva. Los premios están sujetos a disponibilidad e inventario. Aplican Términos y Condiciones PRO MTB & ROAD.</p>
            </div>

            <style jsx>{`
        @keyframes shine {
          100% { transform: translateX(200%) skew(-15deg); }
        }
      `}</style>
        </div>
    );
};

export default Giveaway;
