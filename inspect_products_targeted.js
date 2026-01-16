const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const inspect = async () => {
    try {
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*');

        if (catError) throw catError;
        console.log('Categories:', JSON.stringify(categories, null, 2));

        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, category_id')
            .limit(5);

        if (error) throw error;
        console.log('Sample Products:', JSON.stringify(products, null, 2));

    } catch (e) {
        console.error(e);
    }
};

inspect();
