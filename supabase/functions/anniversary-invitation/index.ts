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
      videoUrl = '', 
      videoThumbnail = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      customSubject = '🚴‍♂️🔥 ¡Llegó el momento! Inscríbete al 6to Aniversario ProoMTB y gana increíbles premios',
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
    const anniversaryRegUrl = 'https://proomtb.com/registro-aniversario'

    for (const recipient of recipients) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Raymon ProoMTB <eventos@proomtb.com>',
            to: [recipient.email],
            subject: customSubject,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #1f2937; }
                  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
                  .header { background-color: #000000; padding: 35px 20px; text-align: center; }
                  .logo { width: 170px; height: auto; margin-bottom: 12px; }
                  .badge { background-color: #00e5ff; color: #000000; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 5px 14px; border-radius: 50px; display: inline-block; }
                  .content { padding: 35px 30px; color: #374151; font-size: 15px; line-height: 1.6; }
                  h1 { color: #111827; font-size: 24px; font-weight: 900; text-transform: uppercase; margin-top: 10px; margin-bottom: 15px; letter-spacing: -0.5px; }
                  .highlight-box { background-color: #f8fafc; border-left: 4px solid #00e5ff; border-radius: 12px; padding: 22px; margin: 25px 0; border: 1px solid #e2e8f0; border-left-width: 4px; border-left-color: #00e5ff; }
                  .feature-item { margin-bottom: 14px; display: flex; align-items: flex-start; }
                  .feature-icon { font-size: 18px; margin-right: 12px; line-height: 1.4; }
                  .video-card { background-color: #000000; border-radius: 14px; padding: 12px; margin: 25px 0; border: 1px solid #111827; text-align: center; }
                  .button-cta { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 18px 30px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 16px; letter-spacing: 1px; margin-top: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                  .footer { background-color: #f9fafb; padding: 25px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
                  .prize-badge { background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo"><br/>
                    <span class="badge">6TO ANIVERSARIO PROOMTB</span>
                  </div>
                  
                  <div class="content">
                    <h1>¡Hola, ${recipient.first_name}! 🚴‍♂️🔥</h1>
                    
                    <p>Sabemos lo mucho que disfrutas nuestros paseos y la emoción sobre pedales. Por eso, <b>¡queremos que seas parte fundamental de nuestra mayor fiesta del año!</b> 🎉</p>
                    
                    <p>Celebramos el <b>6to Aniversario ProoMTB & ROAD</b> y hemos preparado una experiencia inolvidable para toda la comunidad ciclista.</p>

                    ${videoUrl ? `
                    <!-- REPRODUCTOR DE VIDEO REPRODUCIBLE NATIVAMENTE -->
                    <div class="video-card">
                      <p style="color: #00e5ff; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px 0;">🎬 REPRODUCIR VIDEO DEL EVENTO</p>
                      <video controls poster="${videoThumbnail}" style="width: 100%; max-width: 100%; height: auto; border-radius: 10px; display: block;" playsinline preload="metadata">
                        <source src="${videoUrl}" type="video/mp4" />
                        <source src="${videoUrl}" type="video/webm" />
                        <!-- Reproducción interactiva para clientes que soportan iFrames/HTML5 -->
                        <iframe src="${videoUrl}" style="width: 100%; height: 260px; border: 0; border-radius: 10px;" allowfullscreen></iframe>
                      </video>
                    </div>
                    ` : ''}

                    <div class="highlight-box">
                      <h3 style="color: #111827; margin-top: 0; font-size: 17px; text-transform: uppercase; font-weight: 900;">🔥 ¿QUÉ TE ESPERA EN EL ANIVERSARIO?</h3>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🚴‍♂️</span>
                        <div><b>Ruta Especial de Aniversario:</b> Recorrido épico adaptado para disfrutar con la mejor compañía y asistencia.</div>
                      </div>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🏆</span>
                        <div><b>Gran Rifa Oficial:</b> Participas automáticamente por una <span class="prize-badge">BICICLETA CERO KM</span>, accesorios de alta gama y sorpresas exclusivas.</div>
                      </div>

                      <div class="feature-item">
                        <span class="feature-icon">👕</span>
                        <div><b>Kit Oficial con Jersey:</b> Edición limitada conmemorativa del 6to Aniversario ProoMTB.</div>
                      </div>

                      <div class="feature-item">
                        <span class="feature-icon">🎉</span>
                        <div><b>Fiesta & Compartir:</b> Comida, hidratación, música y el mejor ambiente ciclista de la República Dominicana.</div>
                      </div>
                    </div>

                    <p style="text-align: center; font-size: 15px; font-weight: bold; color: #111827;">
                      ⚡ ¡Los cupos son limitados y las inscripciones se están agotando rápidamente!
                    </p>

                    <a href="${anniversaryRegUrl}" class="button-cta">
                      👉 INSCRIBIRME AHORA AL ANIVERSARIO
                    </a>
                  </div>

                  <div class="footer">
                    <p>Si tienes alguna duda, contáctanos a través de nuestras redes o WhatsApp oficial.</p>
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
