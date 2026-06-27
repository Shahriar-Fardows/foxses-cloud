import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // 1. Send to Discord
    if (discordWebhookUrl) {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: 'New Contact Form Submission',
              color: 16347136, // #f97316 (orange)
              fields: [
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Message', value: message },
              ],
              timestamp: new Date().toISOString(),
            }
          ]
        })
      }).catch(err => console.error("Discord webhook error:", err));
    }

    // 2. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `Foxses Cloude Contact <${fromEmail}>`,
        to: ['info@foxses.com'], // Alternatively, send to the fromEmail if info@foxses.com is not verified on Resend
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        `
      }).catch(err => console.error("Resend error:", err));
      
      // Attempt to send a confirmation to the user as well
      await resend.emails.send({
        from: `Foxses Cloude <${fromEmail}>`,
        to: [email],
        subject: `We received your message!`,
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for reaching out to Foxses Cloude. We have received your message and our team will get back to you shortly.</p>
          <p><strong>Your Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
          <br/>
          <p>Best regards,<br/>The Foxses Cloude Team</p>
        `
      }).catch(err => console.error("Resend error (user confirmation):", err));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
