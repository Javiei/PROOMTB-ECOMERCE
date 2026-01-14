const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const BASE_URL = 'https://proomtb.com';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    console.log('--- Generating Sitemap ---');

    const routes = [];

    // 1. Static Routes
    const staticPaths = [
        '',
        '/accesorios',
        '/catalogo',
        '/ebikes',
        '/search',
    ];
    staticPaths.forEach(p => routes.push({ url: p, priority: 1.0, changefreq: 'daily' }));

    try {
        // 2. Categories
        const categories = [
            'e-mtb', 'e-gravel', 'e-trekking', 'e-city',
            'road', 'gravel', 'mtb', 'trekking', 'kids', 'bikes'
        ];
        categories.forEach(cat => routes.push({ url: `/category/${cat}`, priority: 0.8, changefreq: 'weekly' }));

        // 3. Series
        const { data: series, error: seriesError } = await supabase.from('series').select('id, nombre');
        if (seriesError) throw seriesError;

        // Add dynamic series routes
        series.forEach(s => {
            routes.push({ url: `/serie/${s.id}`, priority: 0.7, changefreq: 'weekly' });
            // Some series have named routes (from App.js)
            const slug = s.nombre.toLowerCase().replace(/\s+/g, '-');
            routes.push({ url: `/series/${slug}`, priority: 0.7, changefreq: 'weekly' });
        });

        // 4. Products (Bikes)
        const { data: bikes, error: bikesError } = await supabase.from('bicicletas').select('id');
        if (bikesError) throw bikesError;
        bikes.forEach(b => routes.push({ url: `/product/${b.id}`, priority: 0.6, changefreq: 'monthly' }));

        // 5. Products (Accessories)
        const { data: accs, error: accsError } = await supabase.from('products').select('id');
        if (accsError) throw accsError;
        accs.forEach(a => routes.push({ url: `/product/${a.id}`, priority: 0.6, changefreq: 'monthly' }));

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(SITEMAP_PATH, xml);
        console.log(`Sitemap generated successfully at: ${SITEMAP_PATH}`);
        console.log(`Total URLs: ${routes.length}`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
