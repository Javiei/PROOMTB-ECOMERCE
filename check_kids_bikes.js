const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const checkBikes = async () => {
    try {
        console.log('--- Checking for bikes in series 21 and 22 ---');
        const { data, error } = await supabase
            .from('bicicletas')
            .select('modelo, serie_id')
            .in('serie_id', [21, 22]);

        if (error) throw error;
        console.log('Bikes found:', data);

    } catch (e) {
        console.error(e);
    }
};

checkBikes();
