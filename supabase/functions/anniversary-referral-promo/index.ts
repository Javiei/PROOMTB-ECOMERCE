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
      customSubject = '🎁 ¡Invita a un amigo al Aniversario y gana un 10% de DESCUENTO en toda la tienda! 🚲🔥',
      testEmail = null
    } = reqBody

    let recipients: { first_name: string; email: string }[] = []

    if (testEmail) {
      recipients = [{ first_name: 'Ciclista', email: testEmail }]
    } else {
      // Obtener todos los participantes registrados en el aniversario
      const { data: rawRegistrations, error: fetchError } = await supabase
        .from('anniversary_registrations')
        .select('first_name, email')

      if (fetchError) throw fetchError

      const uniqueEmails = new Set<string>()

      if (rawRegistrations) {
        for (const item of rawRegistrations) {
          const emailTrimmed = item.email ? item.email.toLowerCase().trim() : ''
          if (emailTrimmed && !uniqueEmails.has(emailTrimmed)) {
            uniqueEmails.add(emailTrimmed)
            const firstName = item.first_name ? item.first_name.split(' ')[0] : 'Ciclista'
            recipients.push({
              first_name: firstName,
              email: item.email.trim()
            })
          }
        }
      }
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ message: "No se encontraron inscritos en el aniversario." }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      })
    }

    const results = []
    const whatsappRegUrl = 'https://wa.me/message/6SFG6MXJ6HDUK1'

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
                  .promo-banner { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #ffffff; border-radius: 14px; padding: 25px 20px; text-align: center; margin: 25px 0; border: 2px solid #00e5ff; box-shadow: 0 6px 18px rgba(0,229,255,0.25); }
                  .promo-title { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #00e5ff; margin-bottom: 8px; display: block; }
                  .promo-discount { font-size: 38px; font-weight: 900; color: #ffffff; margin: 5px 0; letter-spacing: -1px; }
                  .promo-sub { font-size: 15px; color: #e5e7eb; font-weight: bold; }
                  .highlight-box { background-color: #f8fafc; border-left: 4px solid #00e5ff; border-radius: 12px; padding: 22px; margin: 25px 0; border: 1px solid #e2e8f0; border-left-width: 4px; border-left-color: #00e5ff; }
                  .step-item { margin-bottom: 14px; display: flex; align-items: flex-start; }
                  .step-number { background-color: #000000; color: #00e5ff; font-weight: 900; font-size: 14px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; }
                  .button-whatsapp { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 18px 25px; background-color: #25D366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 16px; letter-spacing: 1px; margin-top: 25px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); }
                  .footer { background-color: #f9fafb; padding: 25px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
                  .prize-badge { background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 13px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo"><br/>
                    <span class="badge">PROMO EXCLUSIVA PARA INSCRITOS</span>
                  </div>
                  
                  <div class="content">
                    <h1>¡Hola, ${recipient.first_name}! 🚴‍♂️🔥</h1>
                    
                    <p>¡Gracias por asegurar tu lugar en el <b>6to Aniversario ProoMTB & ROAD</b>! Estamos preparando un evento legendario y queremos celebrarlo a lo grande junto a tus amigos y compañeros de rodada.</p>
                    
                    <!-- PROMO BANNER -->
                    <div class="promo-banner">
                      <span class="promo-title">🎁 PROGRAMA DE REFERIDOS ANIVERSARIO</span>
                      <div class="promo-discount">10% DE DESCUENTO</div>
                      <div class="promo-sub">¡EN TODA NUESTRA TIENDA PARA TI! 🚲🛍️</div>
                    </div>

                    <p><b>¿Cómo funciona?</b> ¡Es muy fácil!</p>

                    <div class="highlight-box">
                      <h3 style="color: #111827; margin-top: 0; font-size: 17px; text-transform: uppercase; font-weight: 900;">Pasos para ganar tu 10% de descuento:</h3>
                      
                      <div class="step-item">
                        <div class="step-number">1</div>
                        <div><b>Invita a un amigo:</b> Invita a tus amigos, familiares o grupo de ciclismo a inscribirse.</div>
                      </div>
                      
                      <div class="step-item">
                        <div class="step-number">2</div>
                        <div><b>Tu amigo se inscribe por WhatsApp:</b> Al inscribirse por WhatsApp, tu amigo sólo debe indicar tu nombre o cédula.</div>
                      </div>

                      <div class="step-item">
                        <div class="step-number">3</div>
                        <div><b>¡Recibes tu 10% de descuento!</b> Te activamos inmediatamente un 10% OFF en toda nuestra tienda de bicicletas, componentes y accesorios.</div>
                      </div>
                    </div>

                    <p>Recuerda que con su inscripción, tu amigo también participa automáticamente en la gran rifa de la <span class="prize-badge">BICICLETA RAYMOND 0 KM</span>, accesorios de alta gama y todas las sorpresas del evento. 🏆</p>

                    <p style="text-align: center; font-size: 15px; font-weight: bold; color: #111827; margin-top: 25px;">
                      ⚡ ¡Haz clic en el botón e invita a tus amigos por WhatsApp ahora!
                    </p>

                    <a href="${whatsappRegUrl}" class="button-whatsapp">
                      💬 INSCRIBIRSE POR WHATSAPP
                    </a>
                  </div>

                  <div class="footer">
                    <p>¿Tienes alguna consulta sobre tus inscritos o tu descuento? <a href="${whatsappRegUrl}" style="color: #25D366; font-weight: bold; text-decoration: none;">Habla con nosotros por WhatsApp</a>.</p>
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
      message: "Proceso de envío de promo referidos finalizado", 
      enviados: results.length,
      totalDestinatarios: recipients.length,
      details: results 
    }), {
      headers: { ...headers, "Content-Type": "application/json" }
    })

  } catch (err: any) {
    console.error("Error global en edge function promo referidos:", err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...headers, "Content-Type": "application/json" } 
    })
  }
})
