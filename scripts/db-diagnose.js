const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- Database Diagnostics ---');
    console.log(`Target URL: ${supabaseUrl}`);

    try {
        console.log('\n1. Testing connection (fetching "bicicletas")...');
        const { data: bikes, error: bikesError } = await supabase.from('bicicletas').select('*').limit(1);
        if (bikesError) {
            console.error('Error fetching bicicletas:', bikesError);
        } else if (bikes && bikes.length > 0) {
            console.log('Success! Sample Bike image_urls:', bikes[0].imagenes_urls);
        }

        console.log('\n2. Testing connection (fetching "series")...');
        const { data: series, error: seriesError } = await supabase.from('series').select('*').limit(1);
        if (seriesError) {
            console.error('Error fetching series:', seriesError);
        } else if (series && series.length > 0) {
            console.log('Success! Sample Series nombre:', series[0].nombre);
        }

        console.log('\n3. Testing connection (fetching "products")...');
        const { data: products, error: productsError } = await supabase.from('products').select('*').limit(1);
        if (productsError) {
            console.error('Error fetching products:', productsError);
        } else if (products && products.length > 0) {
            console.log('Success! Sample Product image_url:', products[0].image_url);
        }

    } catch (e) {
        console.error('Unexpected error during diagnostics:', e);
    }
}

diagnose();
