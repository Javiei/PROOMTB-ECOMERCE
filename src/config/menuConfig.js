
export const SERIES_CONFIG = {
    1: { id: 'ravor', label: 'Ravor', link: '/series/ravor', sub: 'Full Suspension', categoryId: 'e-mtb' },
    2: { id: 'vantor', label: 'Vantor', link: '/series/vantor', sub: 'All Mountain', categoryId: 'e-mtb' },
    3: { id: 'trailray', label: 'Trailray', link: '/series/trailray', sub: 'All Rounder', categoryId: 'e-mtb' },
    4: { id: 'hardray', label: 'HardRay', link: '/series/hardray', sub: 'Hardtail', categoryId: 'e-mtb' },
    5: { id: 'vamok', label: 'Vamok', link: '/series/vamok', sub: 'Light E-MTB', categoryId: 'e-mtb' },
    6: { id: 'korak', label: 'Korak', link: '/series/korak', sub: 'E-SUV', categoryId: 'e-mtb' },
    7: { id: 'airok', label: 'Airok', link: '/series/airok', sub: 'Light E-MTB', categoryId: 'e-mtb' },
    8: { id: 'norza', label: 'Norza', link: '/series/norza', sub: 'E-Gravel', categoryId: 'e-gravel' },
    9: { id: 'tavano', label: 'Tavano', link: '/series/tavano', sub: 'E-Trekking', categoryId: 'e-trekking' },
    10: { id: 'tahona', label: 'Tahona', link: '/series/tahona', sub: 'E-Trekking', categoryId: 'e-trekking' },
    11: { id: 'metmo', label: 'Metmo', link: '/series/metmo', sub: 'E-City', categoryId: 'e-city' },
    12: { id: 'arva', label: 'Arva', link: '/series/arva', sub: 'Road', categoryId: 'road' },
    13: { id: 'kirana', label: 'Kirana', link: '/series/kirana', sub: 'Road', categoryId: 'road' },
    14: { id: 'soreno', label: 'Soreno', link: '/series/soreno', sub: 'Gravel', categoryId: 'gravel' },
    15: { id: 'territ', label: 'Territ', link: '/series/territ', sub: 'Trekking', categoryId: 'trekking' },
    16: { id: 'zayn', label: 'Zayn', link: '/series/zayn', sub: 'Trekking', categoryId: 'trekking' },
    17: { id: 'rokua', label: 'Rokua', link: '/series/rokua', sub: 'MTB', categoryId: 'mtb' },
    18: { id: 'yara', label: 'Yara', link: '/series/yara', sub: 'MTB', categoryId: 'mtb' },
    19: { id: 'arid', label: 'Arid', link: '/series/arid', sub: 'MTB', categoryId: 'mtb' },
    20: { id: 'nayta', label: 'Nayta', link: '/series/nayta', sub: 'MTB', categoryId: 'mtb' }
};

export const menuData = {
    accessories: {
        categories: [
            { id: 'accessories', label: 'Accesorios', products: [] }
        ],
        bgImage: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800",
        promoTitle: "Los mejores accesorios para ti",
        promoText: "Consiguelos aqui.",
        promoLinkText: "Ver todos los Accesorios",
        viewAllLink: "/accesorios",
        viewAllLabel: "Ver todos los Accesorios"
    },
    ebikes: {
        categories: [
            {
                id: 'e-mtb',
                label: 'E-MTB',
                desc: 'Domina cualquier terreno con nuestras E-MTB.',
                items: [] // Populated from DB via SERIES_CONFIG
            },
            {
                id: 'e-gravel',
                label: 'E-Gravel',
                desc: 'Velocidad y versatilidad en cualquier camino.',
                items: []
            },
            {
                id: 'e-trekking',
                label: 'E-Trekking',
                desc: 'Comodidad y autonomía para largas distancias.',
                items: []
            },
            {
                id: 'e-city',
                label: 'E-City',
                desc: 'La mejor opción para moverte por la ciudad.',
                items: []
            },
        ],
        bgImage: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&q=80&w=1920",
        promoTitle: "Nueva Colección 2025",
        promoText: "Descubre la última tecnología en E-Bikes.",
        promoLinkText: "Descubrir más",
        viewAllLink: "/ebikes",
        viewAllLabel: "Ver todas las E-Bikes"
    },
    bikes: {
        categories: [
            {
                id: 'road',
                label: 'Road',
                desc: 'Velocidad y eficiencia para el asfalto.',
                items: []
            },
            {
                id: 'gravel',
                label: 'Gravel',
                desc: 'Libertad para explorar cualquier superficie.',
                items: []
            },
            {
                id: 'mtb',
                label: 'MTB',
                desc: 'Aventura pura en senderos y montañas.',
                items: []
            },
            {
                id: 'trekking',
                label: 'Trekking',
                desc: 'Versatilidad para tus viajes y el día a día.',
                items: []
            },
            {
                id: 'kids',
                label: 'Kids',
                desc: 'Diversión y seguridad para los más pequeños.',
                items: []
            },
        ],
        bgImage: "https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Assetes%20web%20page/Raymon-2024-nauders-1874.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL0Fzc2V0ZXMgd2ViIHBhZ2UvUmF5bW9uLTIwMjQtbmF1ZGVycy0xODc0LmpwZyIsImlhdCI6MTc2NzgxODQ3MywiZXhwIjo4ODE2NzczMjA3M30.Xux1DNkIGQuR-4kWxK9GzmurZ4-Pxs8BiPgLjqsOi_A",
        promoTitle: "Bicicletas Convencionales",
        promoText: "Siente la conexión pura con el camino.",
        promoLinkText: "Ver colección",
        viewAllLink: "/category/bikes",
        viewAllLabel: "Ver todas las Bicicletas"
    }
};
