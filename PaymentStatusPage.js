import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [message, setMessage] = useState('Verifying your payment, please wait...');

    useEffect(() => {
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            setStatus('failed');
            setMessage('Payment failed. No order ID found. Please try again.');
            return;
        }

        const verifyPayment = async () => {
            try {
                // Step 1: Verify payment with your backend
                const verifyRes = await fetch('/api/cashfree-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId }),
                });

                if (!verifyRes.ok) {
                    throw new Error('Payment verification failed.');
                }

                const verifyData = await verifyRes.json();

                if (verifyData.payment_status === 'SUCCESS') {
                    // Step 2: If payment is successful, subscribe the user
                    const earlyAccessData = JSON.parse(localStorage.getItem('earlyAccessData'));
                    if (!earlyAccessData) {
                        throw new Error('Could not find user data for subscription.');
                    }

                    const subscribeRes = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: earlyAccessData.email,
                            orderId: orderId,
                        }),
                    });

                    if (!subscribeRes.ok) {
                        throw new Error('Subscription failed after successful payment.');
                    }

                    setStatus('success');
                    setMessage('Thank you! Your payment was successful and you are now subscribed for early access.');
                    localStorage.removeItem('earlyAccessData'); // Clean up local storage

                } else {
                    // Handle other statuses like PENDING or FAILED from Cashfree
                    setStatus('failed');
                    setMessage(`Payment ${verifyData.payment_status}. Please try again or contact support.`);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                setStatus('failed');
                setMessage(error.message || 'An unexpected error occurred. Please contact support.');
            }
        };

        verifyPayment();
    }, [searchParams]);

    const renderIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
            case 'failed':
                return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
            default: // verifying
                return <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                {renderIcon()}
                <h1 className={`text-2xl font-bold mb-2 ${
                    status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-gray-800'
                }`}>
                    {status === 'success' && 'Payment Successful'}
                    {status === 'failed' && 'Payment Failed'}
                    {status === 'verifying' && 'Verifying Payment'}
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                {status !== 'verifying' && (
                    <Link
                        to="/"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Back to Home
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage;
