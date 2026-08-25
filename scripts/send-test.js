const fetch = require('node-fetch');

const SUPABASE_URL = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';

async function sendTest() {
  console.log('Invocando Edge Function "anniversary-countdown" de prueba...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/anniversary-countdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ testEmail: 'herrerajaviersoto@gmail.com' })
    });

    if (response.status === 404) {
      console.log('❌ Error: La Edge Function "anniversary-countdown" no está desplegada en Supabase.');
      console.log('Por favor ejecuta el comando de despliegue antes de continuar:');
      console.log('supabase functions deploy anniversary-countdown --project-ref rwbxersfwgmkixulhnxp');
      return;
    }

    const data = await response.text();
    console.log('Respuesta recibida:', data);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

sendTest();
