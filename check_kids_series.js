const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const checkSeries = async () => {
    try {
        console.log('--- Checking for Yanga and Nayta Kids series ---');
        const { data, error } = await supabase
            .from('series')
            .select('*')
            .or('nombre.ilike.%yanga%,nombre.ilike.%nayta%');

        if (error) throw error;
        console.log('Series data:', JSON.stringify(data, null, 2));

    } catch (e) {
        console.error(e);
    }
};

checkSeries();
