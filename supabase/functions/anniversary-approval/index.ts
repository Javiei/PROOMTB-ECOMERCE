import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { registrationId } = await req.json()

    if (!registrationId) {
      return new Response(JSON.stringify({ error: "Falta el registrationId" }), { status: 400, headers })
    }

    // 1. Obtener los datos del registro
    const { data: registration, error: fetchError } = await supabase
      .from('anniversary_registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      throw fetchError || new Error("Registro no encontrado")
    }

    if (registration.status === 'approved') {
      return new Response(JSON.stringify({ message: "El registro ya está aprobado", code: registration.special_code }), { status: 200, headers })
    }

    // 2. Generar el código especial PRO-XXX
    // Buscar cuántos aprobados hay para asignar el número
    const { count, error: countError } = await supabase
      .from('anniversary_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    if (countError) throw countError

    const nextNumber = (count || 0) + 1
    const specialCode = `PRO-${nextNumber.toString().padStart(3, '0')}`

    // 3. Actualizar la base de datos
    const { error: updateError } = await supabase
      .from('anniversary_registrations')
      .update({ status: 'approved', special_code: specialCode })
      .eq('id', registrationId)

    if (updateError) throw updateError

    // 4. Enviar correo usando Resend
    const isGuest = registration.registration_type === 'invitado';
    const subject = isGuest 
      ? '¡Tu registro como Invitado al 6to Aniversario está confirmado! 🎉'
      : '¡Tu inscripción al 6to Aniversario está confirmada! 🎉';
    const title = `¡Felicidades, ${registration.first_name.split(' ')[0]}!`;
    const message = 'Hemos recibido y validado exitosamente tu comprobante de pago. Tu inscripción para el gran evento de nuestro 6to aniversario está 100% confirmada.';
    
    const planName = isGuest
      ? 'Invitado (RD$ 1,000 - Sin Jersey)'
      : registration.registration_type === 'basico' 
        ? 'Básico (RD$ 1,500 - Sin Jersey)' 
        : 'Full (RD$ 2,950 - Con Jersey)';
    const jerseyText = (isGuest || registration.registration_type === 'basico') 
      ? 'No incluye' 
      : (registration.jersey_size || 'N/A');

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Raymon ProoMTB <eventos@proomtb.com>',
          to: [registration.email],
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
                .detail-card { background-color: #e6fcff; border-radius: 12px; padding: 30px; margin: 20px 0; border: 2px solid #00e5ff; text-align: center; }
                .code-title { font-weight: bold; text-transform: uppercase; color: #008299; font-size: 12px; letter-spacing: 2px; display: block; margin-bottom: 10px; }
                .code-value { font-size: 36px; color: #000000; font-weight: 900; letter-spacing: 4px; background: #00e5ff; display: inline-block; padding: 10px 20px; border-radius: 8px; }
                .logo { width: 180px; height: auto; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://proomtb.com/static/media/LOGO%20PRO%20MTB%20AND%20ROAD%20VECTORES%20CORREGIDOS.pdf.0b103f2a86d22ea4fdd3.png" alt="ProoMTB Logo" class="logo">
                  <h1 style="color: #00e5ff; margin:0;">6TO ANIVERSARIO</h1>
                  <p style="color: #fff; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">PROO MTB</p>
                </div>
                <div class="content">
                  <h1>${title}</h1>
                  <p>${message}</p>
                  
                  <div class="detail-card">
                    <span class="code-title">Tu código de participación oficial</span>
                    <span class="code-value">${specialCode}</span>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">Guarda este código. Con él participarás en la gran rifa y es válido para la bicicleta.</p>
                  </div>

                  <p><b>Datos de tu inscripción:</b><br/>
                  Tipo de Plan: <b>${planName}</b><br/>
                  Talla de Jersey: <b>${jerseyText}</b><br/>
                  Cédula: <b>${registration.cedula}</b></p>

                  <p>¡Prepárate para una ruta increíble! Nos vemos pronto con la mejor energía.</p>
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

      if (!res.ok) {
         console.error('Error enviando Resend:', await res.text())
      }
    } catch (e) {
      console.error(`Error enviando correo a ${registration.email}:`, e)
    }

    return new Response(JSON.stringify({ message: "Aprobado exitosamente", code: specialCode }), {
      headers: { ...headers, "Content-Type": "application/json" }
    })

  } catch (err) {
    console.error("Error general:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers })
  }
})
