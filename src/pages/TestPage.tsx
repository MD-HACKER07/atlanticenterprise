import React, { useState } from 'react';
import RazorpayPayment from '../components/RazorpayPayment';
import { verifyRazorpayPayment } from '../utils/paymentService';

const TestPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

  const handlePaymentSuccess = async (paymentId: string, orderId: string, signature: string) => {
    setPaymentStatus(`Processing payment: ${paymentId}`);
    
    // Verify the payment
    const result = await verifyRazorpayPayment({
      paymentId,
      orderId,
      signature
    });
    
    if (result.success) {
      setPaymentSuccess(true);
      setPaymentStatus(`Payment successful! Payment ID: ${paymentId}`);
    } else {
      setPaymentSuccess(false);
      setPaymentStatus(`Payment verification failed: ${result.error}`);
    }
  };

  const handlePaymentFailure = (error: any) => {
    setPaymentSuccess(false);
    setPaymentStatus(typeof error === 'string' 
      ? `Payment failed: ${error}` 
      : `Payment failed: ${error.description || JSON.stringify(error)}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Dynamic Payment Test</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Amount (in ₹)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <RazorpayPayment
          amount={amount}
          name="Test User"
          description={`Test payment of ₹${amount}`}
          email="test@example.com"
          phone="9876543210"
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          notes={{
            purpose: "Testing dynamic payment"
          }}
        />
      </div>
      
      {paymentStatus && (
        <div className={`p-4 rounded-md ${
          paymentSuccess === true 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : paymentSuccess === false 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          {paymentStatus}
        </div>
      )}
    </div>
  );
};

export default TestPage; 