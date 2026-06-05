import { NextResponse } from 'next/server'

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || ''
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || ''
const MAILCHIMP_DC = MAILCHIMP_API_KEY.split('-').pop() || 'us18'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, subscribeNewsletter } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Por favor, preencha todos os campos obrigatórios.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Por favor, insira um email válido.' },
        { status: 400 }
      )
    }

    // Subscribe to Mailchimp if opted in
    if (subscribeNewsletter && MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID) {
      try {
        const mailchimpUrl = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`

        const mailchimpResponse = await fetch(mailchimpUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
              FNAME: name.split(' ')[0],
              LNAME: name.split(' ').slice(1).join(' ') || '',
              PHONE: phone || '',
            },
            tags: ['contact-form'],
          }),
        })

        if (!mailchimpResponse.ok) {
          const mcError = await mailchimpResponse.json()
          // Don't fail the whole request if already subscribed
          if (mcError.title !== 'Member Exists') {
            console.error('Mailchimp subscription error:', mcError)
          }
        }
      } catch (mcErr) {
        console.error('Mailchimp error:', mcErr)
        // Don't fail the whole request if Mailchimp fails
      }
    }

    // Send the contact form data to the Drupal backend for processing/storage
    const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    
    try {
      const drupalResponse = await fetch(`${drupalBaseUrl}/api/dynamic-form/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_id: 'contact_form',
          email: email,
          form_label: 'Formulário de Contacto',
          data: {
            'Nome': { type: 'text', value: name },
            'Email': { type: 'text', value: email },
            'Telefone': { type: 'text', value: phone || 'Não informado' },
            'Assunto': { type: 'text', value: subject },
            'Mensagem': { type: 'text', value: message },
          },
        }),
      })

      if (!drupalResponse.ok) {
        const txt = await drupalResponse.text().catch(() => '')
        console.error('Drupal submission returned non-OK status:', drupalResponse.status, txt)
      }
    } catch (drupalErr) {
      console.error('Drupal submission error:', drupalErr)
      // Don't fail — the Mailchimp subscription is the priority
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
    })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}
