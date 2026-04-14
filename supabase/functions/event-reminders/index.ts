import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Buscar personas específicamente registradas en los martes (sin duplicados)
    const { data: rawAttendees, error: fetchError } = await supabase
      .from('tuesday_registrations')
      .select('first_name, email')

    if (fetchError) throw fetchError
    if (!rawAttendees || rawAttendees.length === 0) {
      return new Response(JSON.stringify({ message: "No hay registros de martes para enviar correos." }), { status: 200 })
    }

    // Filtrar emails únicos (una persona podría haberse registrado varias veces en semanas diferentes)
    const uniqueEmails = new Set()
    const attendees = []
    
    for (const person of rawAttendees) {
      if (person.email && !uniqueEmails.has(person.email)) {
        uniqueEmails.add(person.email)
        attendees.push(person)
      }
    }

    const subject = '¡Hoy hay Paseo Nocturno con Traviesos MTB! 🚴‍♂️🌙'
    const title = '¡Nos vemos esta noche!'
    const message = '¡Hoy es martes de Paseo Nocturno! Prepárate para una excelente ruta porque esta noche <b>tenemos la compañía especial de Traviesos MTB</b>.<br><br>Te esperamos con la misma energía y ganas de rodar. Recuerda traer tu bici lista, casco y luces.<br><br><b>P.D. 🎁</b> Que no se te olvide que al participar y registrar tu asistencia en <b>3 paseos</b>, estarás participando automáticamente en nuestra gran rifa de premios. 🏆'

    const results = []

    // 3. Enviar correos
    for (const attendee of attendees) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Raymon ProoMTB <eventos@proomtb.com>',
            to: [attendee.email],
            subject: subject,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                  .header { background-color: #000000; padding: 40px 20px; text-align: center; }
                  .content { padding: 40px; color: #333333; }
                  .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #999999; font-size: 12px; }
                  h1 { color: #000000; font-size: 24px; font-weight: 900; text-transform: uppercase; margin-top: 0; letter-spacing: -1px; }
                  .detail-card { background-color: #fff3cd; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #ffeeba; }
                  .detail-item { margin-bottom: 10px; font-size: 14px; }
                  .detail-label { font-weight: bold; text-transform: uppercase; color: #856404; font-size: 10px; letter-spacing: 1px; display: block; }
                  .detail-value { font-size: 16px; color: #856404; font-weight: 600; }
                  .button { display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 14px; margin-top: 20px; }
                  .logo { width: 180px; height: auto; margin-bottom: 10px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo">
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">RECORDATORIO DE PASEO</p>
                  </div>
                  <div class="content">
                    <h1>¡Hola, ${attendee.first_name.split(' ')[0]}!</h1>
                    <p><b>${title}</b></p>
                    <p>${message}</p>
                    
                    <div class="detail-card">
                      <div class="detail-item">
                        <span class="detail-label">Evento</span>
                        <span class="detail-value">Paseos Nocturnos de los Martes con Traviesos MTB</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Fecha</span>
                        <span class="detail-value">Martes 14 de Abril, 2026</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Hora</span>
                        <span class="detail-value">8:00 PM</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Ubicación</span>
                        <span class="detail-value">Calle Eliseo Grullón #26, Los Prados, Santo Domingo</span>
                      </div>
                    </div>

                    <p>Gracias por tu comprensión y ¡nos vemos pronto!</p>
                    
                    <div style="text-align: center;">
                      <a href="https://maps.app.goo.gl/FjJvKuGUtcvfWRZF9" class="button">Ver mapa</a>
                    </div>
                  </div>
                  <div class="footer">
                    <p>© 2026 PROOMTB & ROAD. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        })

        if (res.ok) {
          results.push(`Enviado a ${attendee.email}`)
        }
      } catch (e) {
        console.error(`Error enviando a ${attendee.email}:`, e.message)
      }
    }

    return new Response(JSON.stringify({ message: "Proceso completado", enviados: results.length, details: results }), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})

