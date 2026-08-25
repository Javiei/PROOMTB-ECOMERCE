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

    let recipients: { first_name: string; email: string; special_code?: string | null }[] = []

    if (testEmail) {
      // Intentar buscar si el email de prueba está registrado para usar su nombre y código real
      const { data: regData } = await supabase
        .from('anniversary_registrations')
        .select('first_name, email, special_code')
        .ilike('email', testEmail.trim())
        .limit(1)

      if (regData && regData.length > 0) {
        recipients = [{
          first_name: regData[0].first_name.split(' ')[0],
          email: testEmail.trim(),
          special_code: regData[0].special_code
        }]
      } else {
        recipients = [{ 
          first_name: 'Ciclista', 
          email: testEmail.trim(), 
          special_code: 'PRO-999' 
        }]
      }
    } else {
      // Obtener todos los participantes registrados en el aniversario
      const { data: rawRegistrations, error: fetchError } = await supabase
        .from('anniversary_registrations')
        .select('first_name, email, special_code, status')
        .not('status', 'eq', 'rejected') // Excluir rechazados

      if (fetchError) throw fetchError

      const uniqueEmails = new Set<string>()

      if (rawRegistrations) {
        // Ordenar para priorizar los que ya tienen código especial si hay duplicados
        const sortedRegistrations = [...rawRegistrations].sort((a, b) => {
          if (a.special_code && !b.special_code) return -1
          if (!a.special_code && b.special_code) return 1
          return 0
        })

        for (const item of sortedRegistrations) {
          const emailTrimmed = item.email ? item.email.toLowerCase().trim() : ''
          if (emailTrimmed && !uniqueEmails.has(emailTrimmed)) {
            uniqueEmails.add(emailTrimmed)
            const firstName = item.first_name ? item.first_name.split(' ')[0] : 'Ciclista'
            recipients.push({
              first_name: firstName,
              email: item.email.trim(),
              special_code: item.special_code
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
      const finalSubject = customSubject || `🚨 ¡Solo faltan 6 días para el 6to Aniversario ProoMTB! 🚴‍♂️🎉`

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'ProoMTB <eventos@proomtb.com>',
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
                  .countdown-box { background-color: #000000; color: #ffffff; border-radius: 14px; padding: 25px 20px; text-align: center; margin: 22px 0; border: 2px solid #00e5ff; }
                  .countdown-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #00e5ff; display: block; margin-bottom: 6px; }
                  .countdown-value { font-size: 32px; font-weight: 900; color: #ffffff; margin: 4px 0; letter-spacing: -0.5px; text-transform: uppercase; }
                  .countdown-validity { background-color: #00e5ff; color: #000000; font-size: 12px; font-weight: 900; padding: 4px 12px; border-radius: 50px; display: inline-block; margin: 8px 0; text-transform: uppercase; letter-spacing: 1px; }
                  .countdown-sub { font-size: 14px; color: #e5e7eb; font-weight: 600; margin-top: 4px; }
                  .code-card { background-color: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
                  .code-title { font-weight: bold; text-transform: uppercase; color: #0d9488; font-size: 12px; letter-spacing: 2px; display: block; margin-bottom: 10px; }
                  .code-value { font-size: 32px; color: #111827; font-weight: 900; letter-spacing: 4px; background: #ccfbf1; display: inline-block; padding: 8px 20px; border-radius: 8px; }
                  .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
                  .details-card-title { color: #111827; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 0; }
                  .detail-item { margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: #1f2937; }
                  .detail-icon { font-size: 18px; margin-right: 10px; line-height: 1.4; }
                  .button-whatsapp { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 16px 25px; background-color: #25D366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 15px; letter-spacing: 1px; margin-top: 22px; }
                  .footer { background-color: #f9fafb; padding: 22px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
                  
                  /* Adaptabilidad estricta a Modo Oscuro en Gmail / iOS Mail */
                  @media (prefers-color-scheme: dark) {
                    body { background-color: #121212 !important; color: #e5e7eb !important; }
                    .container { background-color: #1e1e1e !important; border-color: #2e2e2e !important; }
                    .content { color: #d1d5db !important; }
                    h1 { color: #ffffff !important; }
                    .details-card { background-color: #262626 !important; border-color: #383838 !important; }
                    .details-card-title { color: #ffffff !important; }
                    .detail-item { color: #e5e7eb !important; }
                    .code-card { background-color: #1a2e2b !important; border-color: #14b8a6 !important; }
                    .code-value { background-color: #115e59 !important; color: #ffffff !important; }
                    .code-title { color: #2dd4bf !important; }
                    .footer { background-color: #181818 !important; border-color: #2a2a2a !important; color: #9ca3af !important; }
                  }
                </style>
              </head>
              <body>
                <div class="container" style="max-width: 580px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; color: #111827; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                  <div class="header" style="background-color: #000000; padding: 30px 20px; text-align: center;">
                    <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo" style="width: 160px; height: auto; margin-bottom: 10px;"><br/>
                    <span class="badge" style="background-color: #00e5ff; color: #000000; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 5px 14px; border-radius: 50px; display: inline-block;">6TO ANIVERSARIO PROOMTB</span>
                  </div>
                  
                  <div class="content" style="padding: 35px 30px; font-size: 15px; line-height: 1.6; color: inherit;">
                    <h1 style="font-size: 22px; font-weight: 900; margin-top: 5px; margin-bottom: 15px; color: inherit;">¡Hola, ${recipient.first_name}! 👋</h1>
                    
                    <p style="color: inherit;">¡Se acerca el evento más grande del año! La emoción sobre pedales ya se siente en el aire y estamos contando las horas para celebrar juntos el <b>6to Aniversario de ProoMTB & ROAD</b>.</p>

                    <div class="countdown-box" style="background-color: #000000; color: #ffffff; border-radius: 14px; padding: 25px 20px; text-align: center; margin: 22px 0; border: 2px solid #00e5ff;">
                      <span class="countdown-title" style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #00e5ff; display: block; margin-bottom: 6px;">FALTA MUY POCO</span>
                      <div class="countdown-value" style="font-size: 32px; font-weight: 900; color: #ffffff; margin: 4px 0; letter-spacing: -0.5px; text-transform: uppercase;">⏳ ¡SOLO FALTAN 6 DÍAS!</div>
                      <div class="countdown-validity" style="background-color: #00e5ff; color: #000000; font-size: 12px; font-weight: 900; padding: 4px 12px; border-radius: 50px; display: inline-block; margin: 8px 0; text-transform: uppercase; letter-spacing: 1px;">DOMINGO 16 DE AGOSTO</div>
                      <div class="countdown-sub" style="font-size: 14px; color: #e5e7eb; font-weight: 600; margin-top: 4px;">EL EVENTO MÁS ESPERADO DE LA TEMPORADA 🚲🔥</div>
                    </div>

                    ${recipient.special_code ? `
                      <div class="code-card" style="background-color: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; color: #111827;">
                        <span class="code-title" style="font-weight: bold; text-transform: uppercase; color: #0d9488; font-size: 12px; letter-spacing: 2px; display: block; margin-bottom: 10px;">Tu código oficial de participación</span>
                        <span class="code-value" style="font-size: 32px; color: #111827; font-weight: 900; letter-spacing: 4px; background: #ccfbf1; display: inline-block; padding: 8px 20px; border-radius: 8px;">${recipient.special_code}</span>
                        <p style="font-size: 13px; opacity: 0.8; margin: 12px 0 0 0; color: inherit;">Guarda este código para la gran rifa en vivo de la <b>Bicicleta Raymond 0 KM</b>, cascos, componentes y sorpresas del evento. 🏆</p>
                      </div>
                    ` : ''}

                    <div class="details-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; color: #1f2937;">
                      <p class="details-card-title" style="margin-top:0; font-weight:bold; font-size:14px; text-transform:uppercase; color: inherit;">¿Qué nos espera en este Aniversario?</p>
                      
                      <div class="detail-item" style="margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: inherit;">
                        <span class="detail-icon" style="font-size: 18px; margin-right: 10px; line-height: 1.4;">🚴‍♂️</span>
                        <div style="color: inherit;"><b style="color: inherit;">Ruta Espectacular:</b> Un recorrido emocionante con asistencia completa, guías y soporte mecánico en todo el camino.</div>
                      </div>
                      
                      <div class="detail-item" style="margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: inherit;">
                        <span class="detail-icon" style="font-size: 18px; margin-right: 10px; line-height: 1.4;">🎁</span>
                        <div style="color: inherit;"><b style="color: inherit;">Kits Oficiales:</b> Entrega de jerseys conmemorativos y regalos de los patrocinadores para los planes correspondientes.</div>
                      </div>

                      <div class="detail-item" style="margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: inherit;">
                        <span class="detail-icon" style="font-size: 18px; margin-right: 10px; line-height: 1.4;">💦</span>
                        <div style="color: inherit;"><b style="color: inherit;">Hidratación y Soporte:</b> Puntos de abastecimiento con agua, isotónicos y frutas para mantener la energía al máximo.</div>
                      </div>

                      <div class="detail-item" style="margin-bottom: 12px; display: flex; align-items: flex-start; font-size: 14px; color: inherit;">
                        <span class="detail-icon" style="font-size: 18px; margin-right: 10px; line-height: 1.4;">📸</span>
                        <div style="color: inherit;"><b style="color: inherit;">Cobertura de Fotos:</b> Fotógrafos profesionales capturando tus mejores momentos en la ruta.</div>
                      </div>
                    </div>

                    <p style="color: inherit;">Prepárate con tu bicicleta lista, casco obligatorio y toda la energía de siempre. ¡Nos vemos este domingo para celebrar a lo grande!</p>

                    <a href="${whatsappRegUrl}" class="button-whatsapp" style="display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 16px 25px; background-color: #25D366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 15px; letter-spacing: 1px; margin-top: 22px;">
                      💬 ¿DUDAS O CONSULTAS? ESCRÍBENOS AQUÍ
                    </a>
                  </div>

                  <div class="footer" style="background-color: #f9fafb; padding: 22px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0 0 5px 0; color: inherit;">Equipo ProoMTB & ROAD</p>
                    <p style="margin: 0; color: inherit;">© 2026 PROOMTB & ROAD. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        })

        if (res.ok) {
          results.push(`Enviado a ${recipient.email}`)
        } else {
          const errText = await res.text()
          console.error(`Error de Resend para ${recipient.email}:`, errText)
        }
      } catch (e: any) {
        console.error(`Excepción enviando a ${recipient.email}:`, e.message)
      }
    }

    return new Response(JSON.stringify({ 
      message: "Proceso de envío de cuenta regresiva finalizado", 
      enviados: results.length,
      totalDestinatarios: recipients.length,
      details: results 
    }), {
      headers: { ...headers, "Content-Type": "application/json" }
    })

  } catch (err: any) {
    console.error("Error global en edge function cuenta regresiva:", err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...headers, "Content-Type": "application/json" } 
    })
  }
})
