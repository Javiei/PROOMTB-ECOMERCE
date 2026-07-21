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
      // Asunto personal no detectado como correo masivo comercial por Gmail para entrar en Principal
      const finalSubject = customSubject || `${recipient.first_name}, te tenemos un regalo especial del 6to Aniversario`

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
                  .gift-box { background-color: #000000; color: #ffffff; border-radius: 14px; padding: 22px; text-align: center; margin: 22px 0; border: 2px solid #00e5ff; }
                  .gift-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #00e5ff; display: block; margin-bottom: 6px; }
                  .gift-value { font-size: 32px; font-weight: 900; color: #ffffff; margin: 4px 0; }
                  .gift-sub { font-size: 14px; color: #e5e7eb; font-weight: 600; }
                  .step-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
                  .step-item { margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: #1f2937; }
                  .step-num { background-color: #00e5ff; color: #000000; font-weight: 900; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0; }
                  .button-whatsapp { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 16px 25px; background-color: #25D366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 15px; letter-spacing: 1px; margin-top: 22px; }
                  .footer { background-color: #f9fafb; padding: 22px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
                  .prize-badge { background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
                  
                  /* Adaptabilidad estricta a Modo Oscuro en Gmail / iOS Mail */
                  @media (prefers-color-scheme: dark) {
                    body { background-color: #121212 !important; color: #e5e7eb !important; }
                    .container { background-color: #1e1e1e !important; border-color: #2e2e2e !important; }
                    .content { color: #d1d5db !important; }
                    h1 { color: #ffffff !important; }
                    .step-card { background-color: #262626 !important; border-color: #383838 !important; }
                    .step-item { color: #e5e7eb !important; }
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
                    
                    <p>Espero que estés muy bien. Te escribimos para agradecerte por confirmar tu presencia en nuestro <b>6to Aniversario ProoMTB & ROAD</b>.</p>
                    
                    <p>Como ya estás inscrito, queremos darte una sorpresa especial por ser parte de la comunidad:</p>

                    <div class="gift-box">
                      <span class="gift-title">REGALO EXCLUSIVO DE ANIVERSARIO</span>
                      <div class="gift-value">10% DE DESCUENTO</div>
                      <div class="gift-sub">¡En toda la tienda al invitar a un amigo! 🚲✨</div>
                    </div>

                    <div class="step-card">
                      <p style="margin-top:0; font-weight:bold; color:#111827; font-size:14px;">¿Cómo puedes usarlo?</p>
                      
                      <div class="step-item">
                        <div class="step-num">1</div>
                        <div>Invita a un amigo, familiar o compañero ciclista a inscribirse al Aniversario.</div>
                      </div>
                      
                      <div class="step-item">
                        <div class="step-num">2</div>
                        <div>Al inscribirse por WhatsApp, tu amigo menciona tu nombre o cédula.</div>
                      </div>

                      <div class="step-item">
                        <div class="step-num">3</div>
                        <div>¡Listo! Te activamos un <b>10% de descuento en toda la tienda</b> para tu próxima compra de bici, repuestos o accesorios.</div>
                      </div>
                    </div>

                    <p>Tu amigo también estará participando automáticamente por la gran <span class="prize-badge">BICICLETA RAYMOND 0 KM</span>, accesorios de alta gama y todas las sorpresas que tenemos listas. 🏆</p>

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
