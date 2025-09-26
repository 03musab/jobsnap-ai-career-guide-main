// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// --- Security Best Practices ---

// 1. Use Helmet to set various security-related HTTP headers
app.use(helmet());

// 2. Configure CORS for your production frontend URL
const allowedOrigins = ['https://aijobsnap.vercel.app', 'http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

const CASHFREE_API_URL = 'https://api.cashfree.com/pg'; // Use 'https://api.cashfree.com/pg' for production
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Endpoint to create a new order
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply the rate limiting middleware to API calls
app.use('/api/', apiLimiter);

app.post('/api/cashfree-create-order', async (req, res) => {
  try {
    const { email } = req.body;
    const orderId = `order_${Date.now()}`;

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
        order_amount: 1.00, // Example amount
        order_currency: 'INR',
        customer_details: {
          customer_id: `customer_${Date.now()}`,
          customer_email: email,
        },
        order_meta: {
          return_url: `https://aijobsnap.vercel.app/payment-status?order_id={order_id}`, // Adjust URL as needed
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API Error:', data);
      return res.status(response.status).json({ message: data.message || 'Failed to create order' });
    }

    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to verify payment
app.post('/api/cashfree-verify', async (req, res) => {
  try {
    const { orderId } = req.body; // This now correctly matches the frontend request

    // Basic input validation
    if (typeof orderId !== 'string' || !orderId.startsWith('order_')) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // First, get the order details to find the customer's email
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

    const orderData = await orderResponse.json();
    const email = orderData.customer_details.customer_email;

    // Now, check the payment status
    if (orderData.order_status === 'PAID') {
      res.json({ status: 'SUCCESS', email: email }); // This is correct
    } else if (orderData.order_status === 'ACTIVE') {
      res.json({ status: 'PENDING', email: email });
    } else {
      res.json({ status: orderData.order_status || 'FAILED', email: email });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint to subscribe user after successful payment
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email provided.' });
    }

    console.log(`Subscribing ${email} to the early access list.`);
    // Add your logic here to save the email to your database or mailing list
    res.status(200).json({ message: 'Successfully subscribed!' });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
