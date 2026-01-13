const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const check = async () => {
    try {
        const { data: series } = await supabase
            .from('series')
            .select('id, nombre, categoria_id')
            .ilike('nombre', '%tahona%');

        console.log('Series:', series);

        if (series && series[0]) {
            const { data: bikes } = await supabase
                .from('bicicletas')
                .select('modelo, tipos_marco, imagenes_urls')
                .eq('serie_id', series[0].id)
                .limit(1);

            if (bikes && bikes[0]) {
                console.log('Model:', bikes[0].modelo);
                console.log('Frames:', bikes[0].tipos_marco);
                console.log('Img Count:', bikes[0].imagenes_urls ? bikes[0].imagenes_urls.length : 0);
            }
        }
    } catch (e) {
        console.error(e);
    }
};

check();
