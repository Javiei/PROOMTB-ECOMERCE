const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectBikesAndSeries() {
    const { data: series, error: sError } = await supabase.from('series').select('*');
    if (sError) console.error(sError);

    const { data: bikes, error: bError } = await supabase.from('bicicletas').select('serie_id');
    if (bError) console.error(bError);

    const bikeCounts = {};
    bikes.forEach(b => {
        bikeCounts[b.serie_id] = (bikeCounts[b.serie_id] || 0) + 1;
    });

    let output = '--- Normal Bike Series ---\n';
    series.filter(s => s.categoria_id >= 5).forEach(s => {
        output += `ID: ${s.id}, Name: ${s.nombre}, Cat ID: ${s.categoria_id}, Bikes: ${bikeCounts[s.id] || 0}\n`;
    });
    fs.writeFileSync('series_summary.txt', output);
    console.log('Results written to series_summary.txt');
}

inspectBikesAndSeries();
