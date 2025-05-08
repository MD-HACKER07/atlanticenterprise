import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { 
  loadRazorpayScript, 
  createRazorpayOrder, 
  openRazorpayCheckout
} from '../utils/paymentService';
import { companyInfo } from '../data/companyInfo';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: any) => void;
  notes?: Record<string, string>;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  name,
  description,
  email,
  phone,
  onSuccess,
  onFailure,
  notes = {}
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [orderCreating, setOrderCreating] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Razorpay API key from environment variables
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

  useEffect(() => {
    // Load the Razorpay script
    loadRazorpayScript()
      .then(() => {
        setScriptLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Razorpay script:', error);
        setScriptError('Failed to load payment gateway. Please try again later.');
      });
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      console.error('Razorpay script not loaded yet');
      onFailure('Payment gateway not loaded. Please try again.');
      return;
    }
    
    setOrderError(null);
    setOrderCreating(true);
    
    try {
      // Create a Razorpay order
      const orderData = await createRazorpayOrder({
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          name: name,
          email: email,
          phone: phone,
          ...notes
        }
      });
      
      // Open Razorpay checkout
      openRazorpayCheckout(orderData, {
        name,
        description,
        email,
        phone,
        notes,
        onSuccess,
        onFailure
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.';
      setOrderError(errorMessage);
      onFailure(errorMessage);
    } finally {
      setOrderCreating(false);
    }
  };

  const handleRetry = () => {
    setScriptError(null);
    setOrderError(null);
    window.location.reload();
  };

  if (scriptError || orderError) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <p className="text-red-700">{scriptError || orderError}</p>
            <div className="mt-3">
              <p className="text-sm text-red-700 mb-2">Possible solutions:</p>
              <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                <li>Check your internet connection</li>
                <li>Try again in a few moments</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
            <button 
              onClick={handleRetry}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded mt-3 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={!scriptLoaded || orderCreating}
      className={`w-full font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center ${
        scriptLoaded && !orderCreating
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {orderCreating 
        ? 'Creating order...'
        : scriptLoaded 
          ? (
              <>
                <img 
                  src="/images/logo.png" 
                  alt="Atlantic Enterprise Logo" 
                  className="h-6 w-6 mr-2 object-contain" 
                />
                <span className="mr-2">Pay ₹{amount} • Atlantic Enterprise</span>
                <div className="border-l border-white/20 h-5 mx-2"></div>
                <span className="text-xs font-normal">Powered by</span>
                <img 
                  src="https://razorpay.com/assets/razorpay-glyph.svg" 
                  alt="Razorpay" 
                  className="h-5 w-5 ml-1 inline-block" 
                />
              </>
            ) 
          : 'Loading payment gateway...'}
    </button>
  );
};

export default RazorpayPayment; 