/**
 * Server-side WhatsApp notification for Detailing Lab.
 *
 * Deployed as a serverless function (Vercel / Netlify Functions style). The client
 * POSTs { booking, message } here when VITE_WHATSAPP_MODE=api, and this sends the
 * message to the owner without any tap.
 *
 * Supports both common providers — set whichever credentials you have:
 *
 *   WhatsApp Cloud API (Meta):
 *     WHATSAPP_PROVIDER=cloud
 *     WHATSAPP_TOKEN=<permanent access token>
 *     WHATSAPP_PHONE_NUMBER_ID=<from Meta dashboard>
 *     OWNER_WHATSAPP=9715XXXXXXXX          (digits only, no + or spaces)
 *
 *   Twilio:
 *     WHATSAPP_PROVIDER=twilio
 *     TWILIO_ACCOUNT_SID=ACxxxx
 *     TWILIO_AUTH_TOKEN=xxxx
 *     TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
 *     OWNER_WHATSAPP=9715XXXXXXXX
 *
 * Note on the Cloud API: outside a 24-hour customer-service window Meta only
 * delivers pre-approved template messages. Because the owner is the recipient and
 * replies to the thread, a free-form message works in practice — but if delivery
 * silently stops, register a template and switch the body below to type 'template'.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, booking } = req.body ?? {}
  if (!message) {
    res.status(400).json({ error: 'Missing message' })
    return
  }

  const to = (process.env.OWNER_WHATSAPP || '').replace(/\D/g, '')
  if (!to) {
    res.status(500).json({ error: 'OWNER_WHATSAPP is not configured' })
    return
  }

  const provider = process.env.WHATSAPP_PROVIDER || 'cloud'

  try {
    if (provider === 'twilio') {
      const sid = process.env.TWILIO_ACCOUNT_SID
      const token = process.env.TWILIO_AUTH_TOKEN
      const from = process.env.TWILIO_WHATSAPP_FROM
      if (!sid || !token || !from) throw new Error('Twilio credentials are incomplete')

      const body = new URLSearchParams({ From: from, To: `whatsapp:+${to}`, Body: message })
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
      if (!r.ok) throw new Error(`Twilio responded ${r.status}: ${await r.text()}`)
    } else {
      const token = process.env.WHATSAPP_TOKEN
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
      if (!token || !phoneId) throw new Error('WhatsApp Cloud API credentials are incomplete')

      const r = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { preview_url: false, body: message },
        }),
      })
      if (!r.ok) throw new Error(`WhatsApp Cloud API responded ${r.status}: ${await r.text()}`)
    }

    res.status(200).json({ ok: true, orderNumber: booking?.orderNumber })
  } catch (err) {
    console.error('WhatsApp notification failed:', err)
    res.status(502).json({ error: err instanceof Error ? err.message : 'Send failed' })
  }
}
