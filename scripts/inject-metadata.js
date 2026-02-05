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

            // 1. Replace Title
            html = html.replace(/<title>.*?<\/title>/i, `<title>${product.name} | PROOMTB</title>`);

            // 2. Standard Meta Description
            html = html.replace(/<meta name="description" content=".*?" ?\/?>/i, `<meta name="description" content="${product.description.substring(0, 160)}" />`);

            // 3. Open Graph Tags (more robust regex for POST-BUILD environments)
            html = html.replace(/<meta property="og:title" content=".*?" ?\/?>/i, `<meta property="og:title" content="${product.name} | PROOMTB" />`);
            html = html.replace(/<meta property="og:description" content=".*?" ?\/?>/i, `<meta property="og:description" content="${product.description.substring(0, 200)}" />`);

            // Image handling (ensure absolute and encoded)
            const imageUrl = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;
            html = html.replace(/<meta property="og:image" content=".*?" ?\/?>/i, `<meta property="og:image" content="${imageUrl}" />`);

            // Inject secure_url and dimensions if they don't exist, or replace if they do
            if (html.includes('og:image:secure_url')) {
                html = html.replace(/<meta property="og:image:secure_url" content=".*?" ?\/?>/i, `<meta property="og:image:secure_url" content="${imageUrl}" />`);
            } else {
                html = html.replace(/<meta property="og:image" content=".*?" ?\/?>/i, `<meta property="og:image" content="${imageUrl}" />\n  <meta property="og:image:secure_url" content="${imageUrl}" />`);
            }

            html = html.replace(/<meta property="og:url" content=".*?" ?\/?>/i, `<meta property="og:url" content="${BASE_URL}/product/${product.slug}" />`);

            // 4. Twitter Tags
            html = html.replace(/<meta name="twitter:title" content=".*?" ?\/?>/i, `<meta name="twitter:title" content="${product.name} | PROOMTB" />`);
            html = html.replace(/<meta name="twitter:description" content=".*?" ?\/?>/i, `<meta name="twitter:description" content="${product.description.substring(0, 200)}" />`);
            html = html.replace(/<meta name="twitter:image" content=".*?" ?\/?>/i, `<meta name="twitter:image" content="${imageUrl}" />`);

            // 5. Cleanup generic width/height from template if present to let platforms decide or use standard 1200x630
            html = html.replace(/<meta property="og:image:width" content=".*?" ?\/?>/gi, '<meta property="og:image:width" content="1200" />');
            html = html.replace(/<meta property="og:image:height" content=".*?" ?\/?>/gi, '<meta property="og:image:height" content="630" />');

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
