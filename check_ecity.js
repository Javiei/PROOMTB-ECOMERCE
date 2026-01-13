const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const check = async () => {
    try {
        const { data: ecitySeries } = await supabase
            .from('series')
            .select('id, nombre, categoria_id')
            .eq('categoria_id', 4);

        console.log('E-City Series IDs:', ecitySeries.map(s => s.id));

        if (ecitySeries.length > 0) {
            const { data: bikes } = await supabase
                .from('bicicletas')
                .select('id, modelo, serie_id, imagenes_urls')
                .in('serie_id', ecitySeries.map(s => s.id));

            console.log('Found', bikes.length, 'bikes for E-City.');
            bikes.forEach(b => {
                console.log(`- Bike: ${b.modelo}, Serie ID: ${b.serie_id}, Imgs: ${b.imagenes_urls ? b.imagenes_urls.length : 0}`);
            });
        }
    } catch (e) {
        console.error(e);
    }
};

check();
