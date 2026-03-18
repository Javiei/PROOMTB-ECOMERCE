import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Determinar qué recordatorio enviar según la fecha de hoy
    // Nota: El servidor usa UTC, ajustamos a hora de RD (UTC-4)
    const now = new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    const dateString = now.toISOString().split('T')[0]
    
    let reminderType = '' // '1' para mañana, '2' para hoy
    
    if (dateString === '2026-03-17') {
      reminderType = '1'
    } else if (dateString === '2026-03-18') {
      reminderType = '2'
    } else {
      return new Response(JSON.stringify({ message: "No hay recordatorios programados para hoy (" + dateString + ")" }), { status: 200 })
    }

    const reminderField = `reminder_${reminderType}_sent`
    
    // 2. Buscar personas que no hayan recibido el recordatorio correspondiente
    const { data: attendees, error: fetchError } = await supabase
      .from('event_attendance')
      .select('id, name, email')
      .eq('event_name', 'Gran Opening Raymon ProoMTB')
      .eq(reminderField, false)

    if (fetchError) throw fetchError
    if (!attendees || attendees.length === 0) {
      return new Response(JSON.stringify({ message: "Todos los recordatorios de hoy ya fueron enviados." }), { status: 200 })
    }

    const isToday = reminderType === '2'
    const subject = isToday 
      ? '🔥 ¡Es HOY! El Gran Opening de Raymon ProoMTB te espera'
      : '🎉 ¡Mañana es el gran día! Recordatorio Opening Raymon ProoMTB'

    const title = isToday ? '¡El día ha llegado!' : '¡Mañana es el gran día!'
    const message = isToday
      ? '¡El día ha llegado! Te esperamos hoy para celebrar nuestro Gran Opening. Será una tarde inolvidable llena de sorpresas y lo mejor del mundo del ciclismo.'
      : 'Te recordamos que mañana es el Gran Opening de Raymon ProoMTB. No puedes faltar a este evento especial donde compartiremos nuestra pasión por las bicicletas.'

    const results = []

    // 3. Enviar correos e ir actualizando el estado
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
                  .detail-card { background-color: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #eeeeee; }
                  .detail-item { margin-bottom: 10px; font-size: 14px; }
                  .detail-label { font-weight: bold; text-transform: uppercase; color: #888888; font-size: 10px; letter-spacing: 1px; display: block; }
                  .detail-value { font-size: 16px; color: #000000; font-weight: 600; }
                  .button { display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 14px; margin-top: 20px; }
                  .logo { width: 180px; height: auto; margin-bottom: 10px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://proomtb.com/static/media/proomtb_logo_white.fb740b536a7194b20c74.png" alt="ProoMTB Logo" class="logo">
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Gran Opening</p>
                  </div>
                  <div class="content">
                    <h1>¡Hola, ${attendee.name.split(' ')[0]}!</h1>
                    <p><b>${title}</b></p>
                    <p>${message}</p>
                    
                    <div class="detail-card">
                      <div class="detail-item">
                        <span class="detail-label">Evento</span>
                        <span class="detail-value">Gran Opening Raymon ProoMTB</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Fecha</span>
                        <span class="detail-value">Miércoles 18 de Marzo, 2026</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Hora</span>
                        <span class="detail-value">5:30 PM</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Ubicación</span>
                        <span class="detail-value">Calle Eliseo Grullón #26, Los Prados, Santo Domingo</span>
                      </div>
                    </div>

                    <p>¡Contamos con tu presencia!</p>
                    
                    <div style="text-align: center;">
                      <a href="https://maps.app.goo.gl/uvB7N2H1Yk28U93e9" class="button">Ver mapa</a>
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
          // Marcar como enviado inmediatamente
          await supabase
            .from('event_attendance')
            .update({ [reminderField]: true })
            .eq('id', attendee.id)
          results.push(`Enviado a ${attendee.email}`)
        }
      } catch (e) {
        console.error(`Error enviando a ${attendee.email}:`, e.message)
      }
    }

    return new Response(JSON.stringify({ message: "Proceso completado", enviados: results.length }), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
