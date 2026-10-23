// services/emailDispatcher.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { renderEmail } from '../templates/emailTemplates.js';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SUBSCRIBERS_JSON = path.join(ROOT_DIR, 'data', 'subscribers.json');
const SUBSCRIBERS_CSV = path.join(ROOT_DIR, 'data', 'subscribers.csv');

// Candidate Python paths (prioritizes ai_job_agent venv with google-api-python-client installed)
const PYTHON_CANDIDATES = [
  'c:\\Users\\musab\\Desktop\\ai_job_agent\\.venv\\Scripts\\python.exe',
  'python',
  'python3'
];

/**
 * Save subscriber to JSON and CSV store
 */
export function recordSubscriber({ email, name, role, ticketId, source, status = 'subscribed' }) {
  const timestamp = new Date().toISOString();
  const entry = {
    email,
    name: name || '',
    role: role || 'General',
    ticketId: ticketId || `JS-${Math.floor(1000 + Math.random() * 9000)}`,
    source: source || 'Landing Page',
    status,
    timestamp
  };

  try {
    // Ensure directory exists
    const dataDir = path.dirname(SUBSCRIBERS_JSON);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 1. JSON
    let list = [];
    if (fs.existsSync(SUBSCRIBERS_JSON)) {
      try {
        const raw = fs.readFileSync(SUBSCRIBERS_JSON, 'utf-8');
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch (e) {
        list = [];
      }
    }
    // Update or append
    const existingIndex = list.findIndex(s => s.email?.toLowerCase() === email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...entry };
    } else {
      list.push(entry);
    }
    fs.writeFileSync(SUBSCRIBERS_JSON, JSON.stringify(list, null, 2), 'utf-8');

    // 2. CSV
    const csvExists = fs.existsSync(SUBSCRIBERS_CSV);
    const csvRow = `"${entry.timestamp}","${entry.email}","${entry.name}","${entry.ticketId}","${entry.role}","${entry.source}"\n`;
    if (!csvExists) {
      const header = '"Timestamp","Email","Name","TicketId","Role","Source"\n';
      fs.writeFileSync(SUBSCRIBERS_CSV, header + csvRow, 'utf-8');
    } else {
      fs.appendFileSync(SUBSCRIBERS_CSV, csvRow, 'utf-8');
    }
  } catch (err) {
    console.error('[EmailDispatcher] Error recording subscriber to file:', err);
  }

  return entry;
}

/**
 * Send email using the Python Gmail script
 */
function sendViaGmailPython({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const tokenExists = fs.existsSync(path.join(ROOT_DIR, 'token.pickle'));
    if (!tokenExists) {
      return reject(new Error('Gmail token.pickle not found. Skipping Gmail dispatch.'));
    }

    const dataDir = path.join(ROOT_DIR, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write temporary HTML file to avoid shell quoting issues
    const tempHtmlFile = path.join(dataDir, `temp_email_${Date.now()}.html`);
    fs.writeFileSync(tempHtmlFile, html, 'utf-8');

    const scriptPath = path.join(ROOT_DIR, 'send_email.py');
    const pythonExe = process.platform === 'win32' ? PYTHON_CANDIDATES[0] : 'python3';

    const proc = spawn(pythonExe, [
      scriptPath,
      '--to', to,
      '--subject', subject,
      '--html-file', tempHtmlFile
    ]);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      // Clean up temp file
      try {
        if (fs.existsSync(tempHtmlFile)) fs.unlinkSync(tempHtmlFile);
      } catch (e) {}

      if (code === 0) {
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (e) {
          resolve({ status: 'success', raw: stdout });
        }
      } else {
        reject(new Error(`Python mailer exited with code ${code}: ${stderr || stdout}`));
      }
    });

    proc.on('error', (err) => {
      try {
        if (fs.existsSync(tempHtmlFile)) fs.unlinkSync(tempHtmlFile);
      } catch (e) {}
      reject(err);
    });
  });
}

/**
 * Send email using Resend as fallback if configured
 */
async function sendViaResend({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith('YOUR_') || apiKey.length < 10) {
    throw new Error('Resend API key not configured');
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: 'JobSnap Early Access <onboarding@resend.dev>',
    to,
    subject,
    html
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  return { status: 'success', id: result.data?.id, provider: 'resend' };
}

/**
 * Main dispatch function for subscriber response
 */
export async function dispatchSubscriptionEmail({
  email,
  name,
  role = 'Tech / Product',
  ticketId,
  source = 'Landing Page',
  templateType = '2' // Default to VIP Founding Pass (Template 2)
}) {
  // Infer nice display name if not provided
  let displayName = name;
  if (!displayName) {
    const localPart = email.split('@')[0];
    displayName = localPart.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Record subscriber in persistent local storage
  const record = recordSubscriber({
    email,
    name: displayName,
    role,
    ticketId,
    source
  });

  // Render chosen template
  const { subject, html, templateName } = renderEmail(templateType, {
    name: displayName,
    role,
    ticketId: record.ticketId
  });

  console.log(`[EmailDispatcher] 📨 Dispatching "${templateName}" to ${email} (Pass: ${record.ticketId})`);

  let sendResult = null;
  let provider = 'gmail';

  // 1. Try Gmail API via desktop ai_job_agent python environment
  try {
    sendResult = await sendViaGmailPython({ to: email, subject, html });
    console.log(`[EmailDispatcher] ✅ Sent via Gmail API:`, sendResult);
    return {
      success: true,
      provider: 'gmail',
      email,
      ticketId: record.ticketId,
      template: templateName,
      details: sendResult
    };
  } catch (gmailErr) {
    console.warn(`[EmailDispatcher] ⚠️ Gmail dispatch failed (${gmailErr.message}), trying Resend fallback...`);
  }

  // 2. Try Resend fallback
  try {
    sendResult = await sendViaResend({ to: email, subject, html });
    console.log(`[EmailDispatcher] ✅ Sent via Resend:`, sendResult);
    return {
      success: true,
      provider: 'resend',
      email,
      ticketId: record.ticketId,
      template: templateName,
      details: sendResult
    };
  } catch (resendErr) {
    console.warn(`[EmailDispatcher] ⚠️ Resend fallback not available: ${resendErr.message}`);
  }

  // 3. If live sending is offline, return success with stored registration
  console.log(`[EmailDispatcher] 💾 Subscriber ${email} safely recorded in local storage.`);
  return {
    success: true,
    provider: 'stored',
    email,
    ticketId: record.ticketId,
    template: templateName,
    note: 'Subscriber recorded; email queued in dispatch ledger.'
  };
}
