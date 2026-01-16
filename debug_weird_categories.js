const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const debug = async () => {
    try {
        console.log('--- Checking for the specific object shape ---');
        const { data, error } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null)
            .limit(10);

        if (error) throw error;
        console.log('Data:', JSON.stringify(data, null, 2));

        // Check if ANY category is an object
        const weirdies = data.filter(item => typeof item.category === 'object' && item.category !== null);
        console.log('Weird categories (objects):', weirdies);

    } catch (e) {
        console.error(e);
    }
};

debug();
