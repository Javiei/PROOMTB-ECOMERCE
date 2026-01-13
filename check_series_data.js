
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSeries() {
    const { data, error } = await supabase
        .from('series')
        .select('*')
        .in('id', [6, 7]);

    if (error) {
        console.error('Error fetching series:', error);
        return;
    }

    console.log('Series Data:', data);
}

checkSeries();
