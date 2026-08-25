const fetch = require('node-fetch');

const SUPABASE_URL = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';

async function sendAll() {
  console.log('🚀 Iniciando el envío MASIVO de entrega de kits...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/anniversary-kits-delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({})
    });

    if (response.status === 404) {
      console.log('❌ Error: La Edge Function "anniversary-kits-delivery" no está desplegada en Supabase.');
      console.log('Por favor ejecuta el comando de despliegue antes de continuar:');
      console.log('npx supabase functions deploy anniversary-kits-delivery --project-ref rwbxersfwgmkixulhnxp --no-verify-jwt');
      return;
    }

    const data = await response.json();
    console.log('✅ Proceso completado.');
    console.log(`Enviados con éxito: ${data.enviados} de ${data.totalDestinatarios} registrados.`);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

sendAll();
