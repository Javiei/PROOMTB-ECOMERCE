const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const debug = async () => {
    try {
        console.log('--- Fetching all unique category strings ---');
        const { data, error } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null);

        if (error) throw error;

        const rawCategories = data.map(item => item.category);
        const counts = {};
        rawCategories.forEach(cat => {
            const key = JSON.stringify(cat);
            counts[key] = (counts[key] || 0) + 1;
        });

        console.log('Category mapping (JSON stringified to see hidden chars):');
        console.log(JSON.stringify(counts, null, 2));

    } catch (e) {
        console.error(e);
    }
};

debug();
