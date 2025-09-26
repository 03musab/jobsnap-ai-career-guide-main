
import Razorpay from 'razorpay';
import type { Request, Response } from 'express';

export default async function handler(
  req: Request,
  res: Response,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, currency } = req.body;

  const razorpay = new Razorpay({
    key_id: 'rzp_test_RMC6p78u5zeUbe',
    key_secret: 'WdhPxAO8h6Cc72C0f36AxF8i',
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
}
