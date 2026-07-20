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
      videoUrl = 'https://www.youtube.com/', 
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
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0d0d0d; margin: 0; padding: 0; color: #ffffff; }
                  .container { max-width: 600px; margin: 20px auto; background-color: #141414; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #262626; }
                  .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 3px solid #00e5ff; }
                  .logo { width: 180px; height: auto; margin-bottom: 15px; }
                  .badge { background-color: #00e5ff; color: #000000; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 6px 14px; border-radius: 50px; display: inline-block; margin-bottom: 10px; }
                  .content { padding: 35px 30px; color: #e5e5e5; font-size: 15px; line-height: 1.6; }
                  h1 { color: #ffffff; font-size: 26px; font-weight: 900; text-transform: uppercase; margin-top: 10px; margin-bottom: 15px; letter-spacing: -0.5px; }
                  .highlight-box { background: linear-gradient(135deg, #1f1f1f 0%, #171717 100%); border-left: 4px solid #00e5ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-top: 1px solid #2a2a2a; border-right: 1px solid #2a2a2a; border-bottom: 1px solid #2a2a2a; }
                  .feature-item { margin-bottom: 12px; display: flex; align-items: flex-start; }
                  .feature-icon { color: #00e5ff; font-weight: bold; margin-right: 10px; font-size: 18px; }
                  .video-container { position: relative; margin: 30px 0; border-radius: 16px; overflow: hidden; border: 2px solid #00e5ff; box-shadow: 0 8px 25px rgba(0, 229, 255, 0.2); }
                  .video-thumbnail { width: 100%; display: block; height: auto; object-fit: cover; min-height: 240px; }
                  .play-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; text-decoration: none; }
                  .play-button { width: 70px; height: 70px; background-color: #00e5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(0, 229, 255, 0.8); transition: transform 0.2s ease; }
                  .play-icon { width: 0; height: 0; border-top: 14px solid transparent; border-bottom: 14px solid transparent; border-left: 22px solid #000000; margin-left: 4px; }
                  .button-cta { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 18px 30px; background: linear-gradient(135deg, #00e5ff 0%, #00b3cc 100%); color: #000000 !important; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 16px; letter-spacing: 1px; margin-top: 30px; box-shadow: 0 6px 20px rgba(0,229,255,0.4); }
                  .footer { background-color: #0a0a0a; padding: 25px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #1a1a1a; }
                  .prize-badge { background: #ffe600; color: #000; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
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
                    
                    <p>Sabemos lo mucho que disfrutas nuestros paseos y la adrenalina sobre pedales. Por eso, <b>¡queremos que seas parte fundamental de nuestra mayor fiesta del año!</b> 🎉</p>
                    
                    <p>Celebramos el <b>6to Aniversario ProoMTB & ROAD</b> y hemos preparado una experiencia épica para toda la comunidad ciclista.</p>

                    <!-- VIDEO PREVIEW CARD -->
                    <div style="text-align: center; margin: 25px 0;">
                      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #00e5ff; font-weight: bold; margin-bottom: 8px;">🎬 Mira el video promocional del evento</p>
                      <div class="video-container">
                        <a href="${videoUrl}" target="_blank" style="display: block; position: relative;">
                          <img src="${videoThumbnail}" alt="Video Aniversario ProoMTB" class="video-thumbnail" />
                          <div class="play-overlay">
                            <div class="play-button">
                              <div class="play-icon"></div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <span style="font-size: 12px; color: #888;">(Haz clic en la imagen para reproducir el video)</span>
                    </div>

                    <div class="highlight-box">
                      <h3 style="color: #00e5ff; margin-top: 0; font-size: 18px; text-transform: uppercase;">🔥 ¿QUÉ TE ESPERA EN EL ANIVERSARIO?</h3>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🚴‍♂️</span>
                        <div><b>Ruta Especial de Aniversario:</b> Recorrido inolvidable adaptado para disfrutar al máximo con la mejor compañía y asistencia.</div>
                      </div>
                      
                      <div class="feature-item">
                        <span class="feature-icon">🏆</span>
                        <div><b>Gran Rifa Oficial:</b> Participas automáticamente por una <span class="prize-badge">BICICLETA CERO KM</span>, accesorios de alta gama, cascos y sorpresas exclusivas.</div>
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

                    <p style="text-align: center; font-size: 16px; font-weight: bold; color: #ffffff;">
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
