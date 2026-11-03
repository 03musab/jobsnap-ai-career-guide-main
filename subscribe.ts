// This is an example for a serverless function (e.g., in `api/subscribe.ts` for Vercel).
// You may need to adapt it to your specific backend framework (e.g., Express, Next.js).
import { Resend } from 'resend';
import type { Request, Response } from 'express';

const createEmailHtml = (title: string, introText: string, email: string, source: string) => {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060010; color: #e0e0e0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #060010;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #111111; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; text-align: center; background: linear-gradient(110deg, #8A2BE2, #6366f1);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">JobSnap</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #ffffff; font-size: 22px; margin-top: 0;">${title}</h2>
              <p style="line-height: 1.6; font-size: 16px;">${introText}</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; background-color: #1a1a1a; border-radius: 8px; border-left: 4px solid #8A2BE2;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #ffffff;">Email:</strong> ${email}</p>
                    <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #ffffff;">Source:</strong> ${source}</p>
                    <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #ffffff;">Timestamp (UTC):</strong> ${timestamp}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 20px; font-size: 12px; color: #777;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} JobSnap. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export default async function handler(
  req: Request,
  res: Response,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!notificationEmail) {
    console.error('NOTIFICATION_EMAIL environment variable is not set.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const { email, source } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    const isNewsletter = source === 'Footer Newsletter';

    const fromText = isNewsletter ? 'JobSnap Newsletter' : 'JobSnap Waitlist';
    const subject = isNewsletter
      ? 'New Newsletter Subscriber for JobSnap'
      : 'New Waitlist Subscriber for JobSnap';
    const title = isNewsletter ? 'New Newsletter Subscriber' : 'New Waitlist Subscriber';
    const introText = isNewsletter
      ? 'A new user has subscribed to the newsletter from your website footer.'
      : 'A new user has joined the waitlist through the early access modal.';

    const htmlBody = createEmailHtml(title, introText, email, source);

    const { data, error } = await resend.emails.send({
      from: `${fromText} <onboarding@resend.dev>`,
      to: notificationEmail,
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Success!', data });
  } catch (error) {
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}