const fetch = require('node-fetch'); // O usa global.fetch si tienes Node 18+

// CONFIGURACIÓN - ¡PEGA TU KEY DE RESEND AQUÍ!
const RESEND_API_KEY = 'TU_KEY_DE_RESEND_AQUÍ'; 
const SUPABASE_URL = 'https://rwbxersfwgmkixulhnxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnhlcnNmd2dta2l4dWxobnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzI5NTUsImV4cCI6MjA3MDAwODk1NX0.oJy142gYKrnJOH7bdvCoWW92dJjcqWIwxyuTwgq6FAA';

async function sendCorrection() {
    if (RESEND_API_KEY === 'TU_KEY_DE_RESEND_AQUÍ') {
        console.error('❌ ERROR: Debes poner tu API KEY de Resend en el script.');
        return;
    }

    console.log('🔄 Obteniendo lista de correos desde Supabase...');
    
    try {
        // 1. Obtener los correos
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tuesday_registrations?select=first_name,email`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        const rawAttendees = await response.json();
        const uniqueEmails = [...new Set(rawAttendees.map(a => a.email))];
        const attendees = uniqueEmails.map(email => rawAttendees.find(a => a.email === email));

        console.log(`✅ Se encontraron ${attendees.length} destinatarios únicos.`);

        // 2. Enviar los correos
        for (const attendee of attendees) {
            const firstName = attendee.first_name ? attendee.first_name.split(' ')[0] : 'Ciclista';
            
            console.log(`✉️ Enviando a: ${attendee.email}...`);
            
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Raymon ProoMTB <eventos@proomtb.com>',
                    to: [attendee.email],
                    subject: 'Rectificación: ¡El Paseo es este Martes 28 de Abril! 🚴‍♂️🌙',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #d9534f;">¡Mil disculpas por la confusión, ${firstName}!</h2>
                            <p>Te escribimos para aclarar que hubo un error en el correo enviado hace unos minutos.</p>
                            <p style="font-size: 18px;">El Paseo Nocturno <b>NO ES HOY</b>, es este próximo <b>MARTES 28 DE ABRIL</b>.</p>
                            <p>Nos emocionamos un poco con los preparativos y enviamos el recordatorio antes de tiempo. ¡Te esperamos este martes a las 8:00 PM con la misma energía de siempre!</p>
                            <hr>
                            <p style="font-size: 12px; color: #777;">Nos vemos en Calle Eliseo Grullón #26, Los Prados.</p>
                        </div>
                    `
                })
            });

            if (res.ok) {
                console.log(`   ✅ Enviado correctamente.`);
            } else {
                const err = await res.json();
                console.error(`   ❌ Error:`, err);
            }
        }

        console.log('\n✨ Proceso de rectificación completado.');

    } catch (error) {
        console.error('❌ Error crítico:', error.message);
    }
}

sendCorrection();
