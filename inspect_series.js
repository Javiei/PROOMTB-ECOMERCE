const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSeries() {
    const { data: series, error } = await supabase
        .from('series')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    let output = '';
    series.forEach(s => {
        output += `ID: ${s.id}, Name: ${s.nombre}, Cat ID: ${s.categoria_id}\n`;
    });
    fs.writeFileSync('all_series.txt', output);
    console.log('Results written to all_series.txt');
}

inspectSeries();
