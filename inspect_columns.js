const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const inspectColumns = async () => {
    try {
        console.log('--- Inspecting Product Table Columns ---');
        // We can't directly list columns with Supabase JS easily without RPC or standard SQL,
        // but we can fetch one row and see all its keys.
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (error) throw error;

        if (data && data[0]) {
            console.log('Columns in products table:', Object.keys(data[0]));
            console.log('Sample product data:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('No products found in the database.');
        }

        console.log('\n--- Checking for a "category" column specifically ---');
        const { data: categoryColumnSample, error: colError } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null)
            .limit(5);

        if (colError) {
            console.log('Error or "category" column does not exist:', colError.message);
        } else {
            console.log('Sample "category" column values:', categoryColumnSample);
        }

    } catch (e) {
        console.error(e);
    }
};

inspectColumns();
