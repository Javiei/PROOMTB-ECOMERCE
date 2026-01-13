import React from 'react';
import Hero from '../components/home/Hero';
import JourneySection from '../components/home/JourneySection';

const Home = () => {
    return (
        <main>
            <Hero />
            <JourneySection />

            {/* Short Brand Statement Section (common in Raymon) */}
            <section className="bg-raymon-gray py-24">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                        German Performance.<br />
                        Global Passion.
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed overflow-hidden">
                        RAYMON es más que una marca de bicicletas. Es una invitación a explorar, a superar límites y a redescubrir el mundo sobre dos ruedas.
                        Cada modelo está diseñado con precisión alemana y un enfoque obsesivo en la calidad y el rendimiento.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Home;
