// api/subscribe.ts
import { Resend } from 'resend';
import type { Request, Response } from 'express';

const EMAIL_TEMPLATES = {
  "1": {
    name: "Founder Welcome & Job Market Story",
    subject: "The job market is not for beginners, {name} 💀 (Good news inside)",
    getBodyHtml: (name: string, role: string, ticketId: string) => `\
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.55;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #0f172a;">
                    JobSnap <span style="font-size: 11px; font-weight: 600; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 12px; margin-left: 6px; letter-spacing: 0;">EARLY ACCESS</span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 28px 32px 32px 32px;">
                <p style="margin: 0 0 16px 0; font-size: 15px;">Hey <strong>${name}</strong>,</p>
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">The modern job market is genuinely not for beginners 💀</p>
                <p style="margin: 0 0 18px 0; font-size: 14px; color: #475569;">
                    Spending 45 minutes re-typing your resume into yet another Workday portal — only to get left on "seen" like an unreplied Instagram DM — has to stop.
                </p>
                <div style="background-color: #f8fafc; border-left: 3px solid #0f172a; padding: 14px 16px; margin: 0 0 20px 0; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">We built JobSnap to do the heavy lifting:</p>
                    <ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 13.5px; color: #475569;">
                        <li style="margin-bottom: 5px;">Aggregates live roles across LinkedIn, Naukri &amp; Internshala</li>
                        <li style="margin-bottom: 5px;">AI scans your resume &amp; gives you an instant match %</li>
                        <li>Autofills tedious application forms with 1 click</li>
                    </ul>
                </div>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
                    We originally planned to charge for Pro access, but knowing how tough the hiring scene is right now, we decided to make it <strong>100% FREE for early members</strong> until our server compute runs out.
                </p>
                <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff;">Your Early Access Pass:</p>
                    <p style="margin: 6px 0 0 0; font-size: 16px; font-weight: 700; color: #38bdf8; font-family: monospace;">${ticketId}</p>
                    <p style="margin: 8px 0 0 0; font-size: 12.5px; color: #94a3b8;">Simply reply "ACCESS" to this email to confirm your priority pass.</p>
                </div>
                <p style="margin: 24px 0 0 0; font-size: 13.5px; color: #64748b;">
                    Rooting for your career,<br>
                    <strong style="color: #0f172a;">Musab</strong><br>Founder, JobSnap
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`
  },
  "2": {
    name: "VIP Founding Member Pass",
    subject: "Your JobSnap founding access is here 🔑",
    getBodyHtml: (name: string, role: string, ticketId: string) => `\
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.55;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #0f172a;">
                    JobSnap <span style="font-size: 11px; font-weight: 600; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 12px; margin-left: 6px; letter-spacing: 0;">VIP PASS ACTIVE</span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 28px 32px 32px 32px;">
                <p style="margin: 0 0 16px 0; font-size: 15px;">Hey <strong>${name}</strong>,</p>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">As promised, your private founding member pass is ready:</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; margin: 0 0 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Member Tier: <strong style="color: #0f172a;">Early Founding VIP (100% Free)</strong></p>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Role Focus: <strong style="color: #0f172a;">${role}</strong></p>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">Invite Pass Code: <strong style="color: #0284c7; font-family: monospace; font-size: 14px;">${ticketId}</strong></p>
                </div>
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #0f172a;">3 steps to get started:</p>
                <ol style="margin: 0 0 20px 0; padding-left: 20px; font-size: 13.5px; color: #475569; line-height: 1.6;">
                    <li style="margin-bottom: 6px;">Sign up with this email on JobSnap.</li>
                    <li style="margin-bottom: 6px;">Upload your resume so our AI can extract skills and match high-relevance roles.</li>
                    <li>Search live jobs and let JobSnap auto-track your pipeline with 1-click apply.</li>
                </ol>
                <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #475569;">If you run into any quirks or have feature requests, simply reply to this email. I read every note personally.</p>
                <p style="margin: 24px 0 0 0; font-size: 13.5px; color: #64748b;">
                    Happy hunting,<br>
                    <strong style="color: #0f172a;">Musab</strong><br>Founder, JobSnap
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`
  }
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, name, role = 'Tech / Product', ticketId, templateType = '2' } = req.body;
  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const passId = ticketId || `JS-${Math.floor(1000 + Math.random() * 9000)}`;
  const displayName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const selectedType = templateType === '1' ? '1' : '2';
  const tmpl = EMAIL_TEMPLATES[selectedType];
  const subject = tmpl.subject.replace('{name}', displayName);
  const html = tmpl.getBodyHtml(displayName, role, passId);

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.startsWith('YOUR_')) {
    try {
      const resend = new Resend(resendApiKey);
      const result = await resend.emails.send({
        from: 'JobSnap Early Access <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: html,
      });

      if (result.error) {
        return res.status(400).json({ error: result.error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Pass email sent successfully via Resend!',
        ticketId: passId,
        email: email
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback return if running serverless without Resend key
  return res.status(200).json({
    success: true,
    message: 'Subscription captured successfully!',
    ticketId: passId,
    email: email
  });
}
