import type { Request, Response } from 'express';
import fetch from 'node-fetch';

export default async function handler(
  req: Request,
  res: Response,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Cashfree client ID or secret is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const orderId = `order_${Date.now()}`;
    const response = await fetch(`https://sandbox.cashfree.com/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: 1,
        order_currency: 'INR',
        customer_details: {
          customer_id: `customer_${Date.now()}`,
          customer_email: email,
          customer_phone: "9876543210"
        },
        order_meta: {
          return_url: `http://localhost:8080?order_id={order_id}`
        }
      }),
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