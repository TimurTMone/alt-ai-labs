import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Alt AI Labs <noreply@altailabs.com>'

export type EmailTemplate =
  | 'challenge_launch'
  | 'submission_confirmed'
  | 'results_announced'
  | 'payout_sent'
  | 'welcome'

interface SendEmailParams {
  to: string
  template: EmailTemplate
  data: Record<string, string>
}

const templates: Record<EmailTemplate, { subject: string; body: (data: Record<string, string>) => string }> = {
  welcome: {
    subject: 'Welcome to Alt AI Labs',
    body: (d) => `
      <h1>Welcome to Alt AI Labs, ${d.name}!</h1>
      <p>You've joined the community where builders ship every week.</p>
      <p>Check out this week's drop and start building:</p>
      <a href="${d.appUrl}/c/alt-ai-labs/dashboard" style="background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">Go to Dashboard</a>
    `,
  },
  challenge_launch: {
    subject: 'New Challenge: ${title}',
    body: (d) => `
      <h1>New Challenge Dropped!</h1>
      <h2>${d.title}</h2>
      <p>${d.description}</p>
      <p><strong>Deadline:</strong> ${d.deadline}</p>
      <p><strong>Prize Pool:</strong> ${d.prize}</p>
      <a href="${d.appUrl}/c/alt-ai-labs/drops/${d.slug}" style="background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">View Challenge</a>
    `,
  },
  submission_confirmed: {
    subject: 'Submission Received',
    body: (d) => `
      <h1>Submission Confirmed!</h1>
      <p>Your entry for <strong>${d.challengeTitle}</strong> has been received.</p>
      <p>We'll review it and notify you when voting begins.</p>
    `,
  },
  results_announced: {
    subject: 'Results: ${challengeTitle}',
    body: (d) => `
      <h1>Results Are In!</h1>
      <p>The results for <strong>${d.challengeTitle}</strong> have been announced.</p>
      <p>Your placement: <strong>${d.placement}</strong></p>
      <a href="${d.appUrl}/c/alt-ai-labs/leaderboard" style="background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">View Leaderboard</a>
    `,
  },
  payout_sent: {
    subject: 'Payout Sent: $${amount}',
    body: (d) => `
      <h1>Payout Sent!</h1>
      <p>Congratulations! $${d.amount} has been sent to your connected Stripe account for <strong>${d.challengeTitle}</strong>.</p>
      <p>It should arrive in your bank account within 2-3 business days.</p>
    `,
  },
}

export async function sendEmail({ to, template, data }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email skipped - no API key] ${template} → ${to}`)
    return
  }

  const tmpl = templates[template]
  if (!tmpl) {
    console.error(`Unknown email template: ${template}`)
    return
  }

  // Replace ${vars} in subject
  let subject = tmpl.subject
  Object.entries(data).forEach(([k, v]) => {
    subject = subject.replace(`\${${k}}`, v)
  })

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0f23;color:#e2e8f0;">
          ${tmpl.body(data)}
          <hr style="border:1px solid #1e293b;margin:32px 0" />
          <p style="font-size:12px;color:#64748b;">Alt AI Labs — Watch. Build. Ship.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error(`Failed to send ${template} email to ${to}:`, error)
  }
}
