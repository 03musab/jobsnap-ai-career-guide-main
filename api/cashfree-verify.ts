import type { Request, Response } from 'express';
import fetch from 'node-fetch';

export default async function handler(
  req: Request,
  res: Response,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required.' });
  }

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Cashfree client ID or secret is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cashfree API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}