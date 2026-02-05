const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const BASE_URL = 'https://proomtb.com';
const BUILD_DIR = path.join(__dirname, '..', 'build');
const INDEX_PATH = path.join(BUILD_DIR, 'index.html');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to match the app's slugify logic
function slugify(text) {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function injectMetadata() {
    console.log('--- Starting Static Metadata Injection ---');

    if (!fs.existsSync(INDEX_PATH)) {
        console.error('Error: build/index.html not found. Run npm run build first.');
        process.exit(1);
    }

    const template = fs.readFileSync(INDEX_PATH, 'utf8');

    try {
        // 1. Fetch Bikes
        const { data: bikes } = await supabase.from('bicicletas').select('*');
        // 2. Fetch Accessories
        const { data: accessories } = await supabase.from('products').select('*');

        const allProducts = [
            ...(bikes || []).map(b => ({
                id: b.id,
                slug: slugify(b.modelo),
                name: b.modelo,
                description: b.description || `Descubre el ${b.modelo} en PROOMTB & ROAD.`,
                image: b.imagenes_urls?.[0] || 'https://proomtb.com/LOGO.ico',
                price: Array.isArray(b.precio_eur) ? b.precio_eur[0] : b.precio_eur
            })),
            ...(accessories || []).map(a => ({
                id: a.id,
                slug: slugify(a.name),
                name: a.name,
                description: a.description || `Consigue tu ${a.name} en nuestra tienda oficial.`,
                image: a.image_url || 'https://proomtb.com/LOGO.ico',
                price: a.price
            }))
        ];

        console.log(`Processing ${allProducts.length} products...`);

        for (const product of allProducts) {
            const productDir = path.join(BUILD_DIR, 'product', product.slug);
            if (!fs.existsSync(productDir)) {
                fs.mkdirSync(productDir, { recursive: true });
            }

            let html = template;

            // Simple replace of meta tags (matching the ones in index.html)
            // Replace Title
            html = html.replace(/<title>.*?<\/title>/g, `<title>${product.name} | PROOMTB</title>`);

            // Replace OG Tags
            html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${product.name} | PROOMTB" />`);
            html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${product.description.substring(0, 200)}" />`);
            html = html.replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${product.image}" />`);
            html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${BASE_URL}/product/${product.slug}" />`);

            // Replace Twitter Tags
            html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${product.name} | PROOMTB" />`);
            html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${product.description.substring(0, 200)}" />`);
            html = html.replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${product.image}" />`);

            // Add Product Price (Optional injection at the end of head)
            const priceMeta = `\n  <meta property="product:price:amount" content="${product.price}" />\n  <meta property="product:price:currency" content="DOP" />\n</head>`;
            html = html.replace(/<\/head>/, priceMeta);

            fs.writeFileSync(path.join(productDir, 'index.html'), html);
        }

        console.log('✅ Metadata injection completed successfully.');

    } catch (error) {
        console.error('Error during metadata injection:', error);
        process.exit(1);
    }
}

injectMetadata();
