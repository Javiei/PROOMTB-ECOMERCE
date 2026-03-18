const fetch = require('node-fetch');

// Configuración
const SUPABASE_URL = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';

async function sendReminders(type) {
  if (type !== 'tomorrow' && type !== 'today') {
    console.error('Error: El tipo debe ser "tomorrow" o "today"');
    return;
  }

  console.log(`Enviando recordatorios tipo: ${type}...`);

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/event-reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ reminder_type: type })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Éxito:', data.message);
      console.log('Detalles:', data.details);
    } else {
      console.error('❌ Error:', data.error || data);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Ejecución basada en argumentos: node trigger-reminders.js [tomorrow|today]
const typeArg = process.argv[2];
if (!typeArg) {
  console.log('Uso: node trigger-reminders.js [tomorrow|today]');
} else {
  sendReminders(typeArg);
}
