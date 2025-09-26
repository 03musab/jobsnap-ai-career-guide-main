
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(100); // Default amount in INR

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await fetch('/api/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR' }),
    });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const order = await result.json();

    const options = {
      key: 'rzp_test_RMC6p78u5zeUbe',
      amount: order.amount,
      currency: order.currency,
      name: 'JobSnap',
      description: 'Early Access',
      order_id: order.id,
      handler: function (response: any) {
        alert('Payment successful!');
        console.log(response);
      },
      prefill: {
        email: email,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Early Access Payment</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (INR)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handlePayment}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
