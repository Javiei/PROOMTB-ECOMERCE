
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

const SERIES_CONFIG = {
    1: { id: 'ravor', label: 'Ravor' },
    2: { id: 'vantor', label: 'Vantor' },
    3: { id: 'trailray', label: 'Trailray' },
    4: { id: 'hardray', label: 'HardRay' },
    5: { id: 'vamok', label: 'Vamok' }
};

async function testFetch() {
    console.log('Fetching bikes...');
    const { data: bikes, error } = await supabase
        .from('bicicletas')
        .select('serie_id, imagenes_urls');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    console.log(`Fetched ${bikes.length} bikes.`);

    const seriesFound = {};
    bikes.forEach(bike => {
        if (bike.serie_id && !seriesFound[bike.serie_id]) {
            seriesFound[bike.serie_id] = bike.imagenes_urls?.[0]; // Get first image
        }
    });

    console.log('Series Found Keys:', Object.keys(seriesFound));

    const newItems = Object.keys(seriesFound).map(serieId => {
        // console.log(`Checking config for serieId: ${serieId} (type: ${typeof serieId})`);
        const config = SERIES_CONFIG[serieId];
        if (!config) {
            console.log(`No config for serieId: ${serieId}`);
            return null;
        }
        return { ...config, image: seriesFound[serieId] ? 'Image Found' : 'No Image' };
    }).filter(Boolean);

    console.log('Items generated:', newItems);
}

testFetch();
