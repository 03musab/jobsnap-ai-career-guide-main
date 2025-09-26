import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

// Define status constants for clarity
const STATUS = {
    VERIFYING: 'verifying',
    SUCCESS: 'success',
    FAILED: 'failed',
};

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(STATUS.VERIFYING);
    const [message, setMessage] = useState('Verifying your payment, please wait...');

    useEffect(() => {
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            setStatus(STATUS.FAILED);
            setMessage('Payment failed. No order ID found. Please try again.');
            return;
        }

        // This flag prevents the verification from running multiple times on refresh
        const hasVerified = sessionStorage.getItem(`verified_${orderId}`);
        if (hasVerified === 'true') {
            setStatus(STATUS.SUCCESS);
            setMessage('Thank you! Your payment was successful and you are now subscribed for early access.');
            return;
        }

        const processPaymentVerification = async () => {
            // Step 1: Verify payment status from the backend
            const verificationResponse = await verifyPayment(orderId);
            if (verificationResponse.status !== 'SUCCESS') {
                setStatus(STATUS.FAILED);
                setMessage(`Payment ${verificationResponse.status || 'FAILED'}. Please try again or contact support.`);
                return;
            }

            // Step 2: Subscribe the user if payment was successful
            const subscriptionSuccessful = await subscribeUser(orderId);
            if (subscriptionSuccessful) {
                setStatus(STATUS.SUCCESS);
                setMessage('Thank you! Your payment was successful and you are now subscribed for early access.');
                localStorage.removeItem('earlyAccessData'); // Clean up local storage
                sessionStorage.setItem(`verified_${orderId}`, 'true'); // Mark as verified for this session
            } else {
                // This case is important: payment was OK, but subscription failed.
                setStatus(STATUS.FAILED);
                setMessage('Your payment was successful, but we couldn\'t complete your subscription. Please contact support.');
            }
        };

        processPaymentVerification().catch(error => {
            console.error('An error occurred during payment processing:', error);
            setStatus(STATUS.FAILED);
            setMessage(error.message || 'An unexpected error occurred. Please contact support.');
        });

    }, [searchParams]);

    const verifyPayment = async (orderId) => {
        const verifyRes = await fetch('/api/cashfree-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId }), // Use orderId to match backend
        });

        if (!verifyRes.ok) {
            throw new Error('Payment verification failed.');
        }
        return await verifyRes.json();
    };

    const subscribeUser = async (orderId) => {
        const earlyAccessData = JSON.parse(localStorage.getItem('earlyAccessData'));
        if (!earlyAccessData || !earlyAccessData.email) {
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

        return subscribeRes.ok;
    };

    const renderIcon = () => {
        switch (status) {
            case STATUS.SUCCESS:
                return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
            case STATUS.FAILED:
                return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
            default: // Verifying
                return <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                {renderIcon()}
                <h1 className={`text-2xl font-bold mb-2 ${
                    status === STATUS.SUCCESS ? 'text-green-600' : status === STATUS.FAILED ? 'text-red-600' : 'text-gray-800'
                }`}>
                    {status === STATUS.SUCCESS && 'Payment Successful'}
                    {status === STATUS.FAILED && 'Payment Failed'}
                    {status === STATUS.VERIFYING && 'Verifying Payment'}
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                {status === STATUS.VERIFYING ? (
                    <button
                        disabled
                        className="bg-blue-400 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center justify-center w-full sm:w-auto cursor-not-allowed transition duration-300"
                    >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                    </button>
                ) : (
                    <Link
                        to="/"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                    >
                        Back to Home
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage;