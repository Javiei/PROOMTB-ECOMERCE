import React from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 1,
        title: 'E-MTB',
        subtitle: 'Rendimiento Extremo',
        image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&q=80&w=800',
        link: '/category/e-mtb'
    },
    {
        id: 2,
        title: 'E-Trekking',
        subtitle: 'Explora sin límites',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
        link: '/category/e-trekking'
    },
    {
        id: 3,
        title: 'E-City',
        subtitle: 'Movilidad Urbana',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
        link: '/category/e-city'
    }
];

const CategoryGrid = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        ¿Cuál es tu estilo?
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Desde senderos técnicos hasta las calles de la ciudad. Encuentra la bicicleta perfecta para tu próxima aventura.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <a
                            key={cat.id}
                            href={cat.link}
                            className="group relative h-[600px] overflow-hidden block"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2 block">{cat.subtitle}</span>
                                <h3 className="text-4xl font-black text-white uppercase italic mb-6">{cat.title}</h3>
                                <span className="inline-flex items-center text-white font-bold uppercase text-sm group-hover:underline decoration-2 underline-offset-4">
                                    Ver Modelos <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
