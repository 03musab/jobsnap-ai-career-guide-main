import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { dispatchSubscriptionEmail } from './services/emailDispatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const SUBSCRIBERS_JSON = path.join(ROOT_DIR, 'data', 'subscribers.json');

const app = express();

// Security: Helmet with relaxed CSP for fonts, cdn, and videos
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Enable CORS for all incoming origins in dev and preview environments
app.use(cors());
app.use(express.json());

// Cashfree Configuration
const CASHFREE_API_URL = 'https://api.cashfree.com/pg';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET;

// Rate limiting for API calls
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Endpoint: Create Cashfree Order
app.post('/api/cashfree-create-order', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const orderId = `order_${Date.now()}`;

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      // Mock fallback if keys not configured
      return res.json({
        order_id: orderId,
        order_status: 'ACTIVE',
        payment_session_id: `mock_session_${Date.now()}`,
        message: 'Order created in test mode',
      });
    }

    const response = await fetch(`${CASHFREE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: 1.0,
        order_currency: 'INR',
        customer_details: {
          customer_id: `customer_${Date.now()}`,
          customer_email: email,
        },
        order_meta: {
          return_url: `https://aijobsnap.vercel.app/payment-status?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API Error:', data);
      return res.status(response.status).json({ message: (data as Record<string, unknown>)?.message || 'Failed to create order' });
    }

    res.json(data);
  } catch (error: unknown) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint: Verify Cashfree Payment
app.post('/api/cashfree-verify', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.json({ status: 'SUCCESS', email: 'test@example.com' });
    }

    const orderResponse = await fetch(`${CASHFREE_API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2022-09-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    if (!orderResponse.ok) {
      return res.status(orderResponse.status).json({ message: 'Failed to fetch order details' });
    }

    interface CashfreeOrder {
      order_status?: string;
      customer_details?: {
        customer_email?: string;
      };
    }

    const orderData = (await orderResponse.json()) as CashfreeOrder;
    const email = orderData?.customer_details?.customer_email;

    if (orderData.order_status === 'PAID') {
      res.json({ status: 'SUCCESS', email });
    } else if (orderData.order_status === 'ACTIVE') {
      res.json({ status: 'PENDING', email });
    } else {
      res.json({ status: orderData.order_status || 'FAILED', email });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint: Subscribe user & dispatch pass email
app.post('/api/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, name, role, ticketId, source, templateType } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const result = await dispatchSubscriptionEmail({
      email: email.trim(),
      name: name ? name.trim() : undefined,
      role: role || 'Tech / Product',
      ticketId: ticketId || `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      source: source || 'Landing Page Form',
      templateType: templateType || '2',
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription successful and confirmation pass email dispatched!',
      data: result,
    });
  } catch (error: unknown) {
    console.error('[API /subscribe] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to process subscription.',
      details: message,
    });
  }
});

// Endpoint: List subscribers (admin view)
app.get('/api/subscribers', (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(SUBSCRIBERS_JSON)) {
      const data = JSON.parse(fs.readFileSync(SUBSCRIBERS_JSON, 'utf-8'));
      return res.json({ count: data.length, subscribers: data });
    }
    return res.json({ count: 0, subscribers: [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load subscribers' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  if (isProduction && fs.existsSync(path.resolve(ROOT_DIR, 'dist'))) {
    app.use(express.static(path.resolve(ROOT_DIR, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(ROOT_DIR, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI JobSnap] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AI JobSnap] Failed to start server:', err);
  process.exit(1);
});
