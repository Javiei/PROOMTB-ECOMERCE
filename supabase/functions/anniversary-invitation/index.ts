import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const reqBody = await req.json().catch(() => ({}))
    const { 
      customSubject = null,
      testEmail = null
    } = reqBody

    let recipients: { first_name: string; email: string }[] = []

    if (testEmail) {
      recipients = [{ first_name: 'Ciclista', email: testEmail }]
    } else {
      // 1. Obtener correos únicos de tuesday_registrations
      const { data: tuesdayData, error: tError } = await supabase
        .from('tuesday_registrations')
        .select('first_name, email')

      if (tError) console.error('Error fetching tuesday registrations:', tError)

      // 2. Obtener correos únicos de event_attendance
      const { data: eventData, error: eError } = await supabase
        .from('event_attendance')
        .select('name, email')

      if (eError) console.error('Error fetching event attendance:', eError)

      const uniqueEmails = new Set<string>()

      if (tuesdayData) {
        for (const item of tuesdayData) {
          if (item.email && !uniqueEmails.has(item.email.toLowerCase().trim())) {
            uniqueEmails.add(item.email.toLowerCase().trim())
            recipients.push({
              first_name: item.first_name || 'Ciclista',
              email: item.email.trim()
            })
          }
        }
      }

      if (eventData) {
        for (const item of eventData) {
          const emailTrimmed = item.email ? item.email.toLowerCase().trim() : ''
          if (emailTrimmed && !uniqueEmails.has(emailTrimmed)) {
            uniqueEmails.add(emailTrimmed)
            const firstName = item.name ? item.name.split(' ')[0] : 'Ciclista'
            recipients.push({
              first_name: firstName,
              email: item.email.trim()
            })
          }
        }
      }
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ message: "No se encontraron destinatarios de paseos." }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      })
    }

    const results = []
    const whatsappRegUrl = 'https://wa.me/message/6SFG6MXJ6HDUK1'

    for (const recipient of recipients) {
      const finalSubject = customSubject || `${recipient.first_name}, tu invitación oficial al 6to Aniversario ProoMTB`

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Raymon Soto <eventos@proomtb.com>',
            to: [recipient.email],
            subject: finalSubject,
            html: `
              <!DOCTYPE html>
              <html lang="es">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <style>
                  :root { color-scheme: light dark; supported-color-schemes: light dark; }
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #111827; }
                  .container { max-width: 580px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
                  .header { background-color: #000000; padding: 30px 20px; text-align: center; }
                  .logo { width: 160px; height: auto; margin-bottom: 10px; }
                  .badge { background-color: #00e5ff; color: #000000; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 5px 14px; border-radius: 50px; display: inline-block; }
                  .content { padding: 35px 30px; color: #374151; font-size: 15px; line-height: 1.6; }
                  h1 { color: #111827; font-size: 22px; font-weight: 900; margin-top: 5px; margin-bottom: 15px; }
                  .card-box { background-color: #f8fafc; border-left: 4px solid #00e5ff; border-radius: 12px; padding: 20px; margin: 22px 0; border: 1px solid #e2e8f0; border-left-width: 4px; border-left-color: #00e5ff; }
                  .feature-item { margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: #1f2937; }
                  .feature-icon { font-size: 18px; margin-right: 10px; line-height: 1.4; }
                  .button-whatsapp { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 16px 25px; background-color: #25D366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 15px; letter-spacing: 1px; margin-top: 22px; }
                  .footer { background-color: #f9fafb; padding: 22px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
                  .prize-badge { background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
                  
                  /* Adaptabilidad estricta a Modo Oscuro en Gmail / iOS Mail */
                  @media (prefers-color-scheme: dark) {
                    body { background-color: #121212 !important; color: #e5e7eb !important; }
                    .container { background-color: #1e1e1e !important; border-color: #2e2e2e !important; }
                    .content { color: #d1d5db !important; }
                    h1 { color: #ffffff !important; }
                    .card-box { background-color: #262626 !important; border-color: #383838 !important; }
                    .feature-item { color: #e5e7eb !important; }
                    .footer { background-color: #181818 !important; border-color: #2a2a2a !important; color: #9ca3af !important; }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo"><br/>
                    <span class="badge">6TO ANIVERSARIO PROOMTB</span>
                  </div>
                  
                  <div class="content">
                    <h1>¡Hola, ${recipient.first_name}! 👋</h1>
                    
                    <p>Sabemos lo mucho que disfrutas nuestros paseos de los martes y la emoción sobre pedales. Por eso, queremos invitarte personalmente a nuestro <b>6to Aniversario ProoMTB & ROAD</b>.</p>
                    
                    <div class="card-box">
                      <p style="margin-top:0; font-weight:bold; color:#111827; font-size:14px; text-transform:uppercase;">¿Qué te espera en el Aniversario?</p>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🚴‍♂️</span>
                        <div><b>Ruta Especial de Aniversario:</b> Recorrido adaptado con asistencia completa y la mejor compañía.</div>
                      </div>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🏆</span>
                        <div><b>Gran Rifa Oficial:</b> Participas automáticamente por una <span class="prize-badge">BICICLETA RAYMOND 0 KM</span>, accesorios de alta gama, cascos y sorpresas en vivo.</div>
                      </div>

                      <div class="feature-item">
                        <span class="feature-icon">👕</span>
                        <div><b>Kit Oficial con Jersey:</b> Edición conmemorativa del 6to Aniversario.</div>
                      </div>

                      <div class="feature-item">
                        <span class="feature-icon">🎉</span>
                        <div><b>Fiesta & Compartir:</b> Comida, música, hidratación y el mejor ambiente ciclista.</div>
                      </div>
                    </div>

                    <p>Los cupos son limitados. Haz clic a continuación para asegurar tu inscripción directamente por WhatsApp:</p>

                    <a href="${whatsappRegUrl}" class="button-whatsapp">
                      💬 INSCRIBIRSE POR WHATSAPP AQUÍ
                    </a>
                  </div>

                  <div class="footer">
                    <p>Raymon Soto & Equipo ProoMTB & ROAD</p>
                    <p>© 2026 PROOMTB & ROAD. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        })

        if (res.ok) {
          results.push(`Enviado exitosamente a ${recipient.email}`)
        } else {
          const errText = await res.text()
          console.error(`Error de Resend para ${recipient.email}:`, errText)
        }
      } catch (e: any) {
        console.error(`Excepción enviando a ${recipient.email}:`, e.message)
      }
    }

    return new Response(JSON.stringify({ 
      message: "Proceso de envío finalizado", 
      enviados: results.length,
      totalDestinatarios: recipients.length,
      details: results 
    }), {
      headers: { ...headers, "Content-Type": "application/json" }
    })

  } catch (err: any) {
    console.error("Error global en edge function:", err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...headers, "Content-Type": "application/json" } 
    })
  }
})
