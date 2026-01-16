const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const debug = async () => {
    try {
        console.log('--- Checking Category Counts ---');
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, name');

        if (catError) throw catError;

        for (const cat of categories) {
            const { count, error: countError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', cat.id);

            if (countError) console.log(`Error counting products for ${cat.name}:`, countError);
            else console.log(`${cat.name}: ${count} products`);
        }

        console.log('\n--- Checking Products without Category ---');
        const { count: nullCount, error: nullError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .is('category_id', null);

        if (nullError) throw nullError;
        console.log(`Products without category: ${nullCount}`);

        if (nullCount > 0) {
            const { data: nullProducts } = await supabase
                .from('products')
                .select('name')
                .is('category_id', null)
                .limit(10);
            console.log('Sample products without category:', nullProducts.map(p => p.name));
        }

    } catch (e) {
        console.error(e);
    }
};

debug();
