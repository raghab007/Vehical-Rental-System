import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const ExtensionPaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const pidx = searchParams.get('pidx');
        const extensionId = localStorage.getItem('currentExtensionId');

        if (!pidx || !extensionId) {
          throw new Error('Missing payment verification parameters');
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:4000/api/extension/verify-payment',
          { pidx, extensionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === 'paid') {
          setPaymentStatus('success');
          // Remove the extension ID from localStorage
          localStorage.removeItem('currentExtensionId');
        } else {
          setPaymentStatus('failed');
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setPaymentStatus('failed');
        setError(err.response?.data?.error || err.message || 'Payment verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  const redirectToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        {isLoading ? (
          <>
            <div className="flex justify-center mb-6">
              <Loader className="animate-spin text-blue-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Payment</h2>
            <p className="text-gray-600 mb-6">Please wait while we verify your payment...</p>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </>
        ) : paymentStatus === 'success' ? (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your extension payment has been verified and processed successfully.
            </p>
            <button
              onClick={redirectToProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Back to Profile
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              {error || 'There was an issue processing your payment.'}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <button
              onClick={redirectToProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Back to Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExtensionPaymentVerify;