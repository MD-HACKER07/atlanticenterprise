import { loadScript } from './scriptLoader';

// Key ID from environment variables
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Interface for order creation params
interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

// Interface for payment verification params
interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
}

// Interface for order data
interface OrderData {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

/**
 * Loads the Razorpay script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return loadScript('https://checkout.razorpay.com/v1/checkout.js')
    .then(() => {
      console.log('Razorpay script loaded successfully');
      return true;
    })
    .catch((error) => {
      console.error('Failed to load Razorpay script:', error);
      throw new Error('Failed to load payment gateway. Please try again later.');
    });
};

/**
 * Creates a Razorpay order through the API
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderData> => {
  let retryCount = 0;
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  
  const tryCreate = async (): Promise<OrderData> => {
    try {
      console.log(`Creating Razorpay order with amount: ${params.amount} (Attempt ${retryCount + 1}/${maxRetries})`);
      
      // Make API call to create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'INR',
          receipt_id: params.receipt || `receipt_${Date.now()}`,
          notes: params.notes || {}
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        
        // If it's a known payment initialization error that could be retried
        if (errorData.code === 'PAYMENT_INITIALIZATION_FAILED') {
          throw new Error(errorData.details || errorData.error || 'Failed to create order');
        }
        
        // For other errors, don't retry and just propagate the error
        throw new Error(errorData.error || errorData.details || 'Failed to create order');
      }
      
      const data = await response.json();
      
      if (!data.id) {
        console.error('Invalid order response:', data);
        throw new Error('Invalid order response from server');
      }
      
      console.log('Order created successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error creating Razorpay order (Attempt ${retryCount + 1}/${maxRetries}):`, error);
      
      // Increment retry counter
      retryCount++;
      
      // If we have retries left, and it's a retriable error
      if (retryCount < maxRetries && error instanceof Error && 
          (error.message.includes('Failed to initialize payment') || 
           error.message.includes('PAYMENT_INITIALIZATION_FAILED'))) {
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, retryCount - 1);
        console.log(`Retrying in ${delay}ms...`);
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, delay));
        return tryCreate();
      }
      
      // No more retries or non-retriable error
      throw new Error(
        error instanceof Error 
          ? `Payment initialization failed: ${error.message}. Please try again.` 
          : 'Failed to initialize payment. Please try again.'
      );
    }
  };
  
  return tryCreate();
};

/**
 * Opens the Razorpay payment form
 */
export const openRazorpayCheckout = (
  orderData: OrderData,
  options: {
    name: string;
    description: string;
    email: string;
    phone: string;
    notes?: Record<string, any>;
    onSuccess: (paymentId: string, orderId: string, signature: string) => void;
    onFailure: (error: any) => void;
  }
): void => {
  try {
    // Create Razorpay options
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: import.meta.env.VITE_COMPANY_NAME || 'Atlantic Enterprise',
      description: options.description,
      image: window.location.origin + '/images/logo.png',
      order_id: orderData.id,
      handler: function(response: any) {
        console.log('Payment successful:', response);
        options.onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.phone
      },
      notes: {
        ...options.notes,
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          options.onFailure('Payment cancelled by user');
        }
      }
    };

    // Create Razorpay instance and open checkout
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.on('payment.failed', function(response: any) {
      console.error('Payment failed:', response.error);
      options.onFailure({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        metadata: response.error.metadata
      });
    });
    
    // Open checkout
    razorpay.open();
  } catch (error) {
    console.error('Error opening Razorpay checkout:', error);
    options.onFailure('Failed to open payment gateway. Please try again.');
  }
};

/**
 * Verifies a payment with the server
 */
export const verifyRazorpayPayment = async (params: VerifyPaymentParams): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    console.log('Verifying payment:', params);
    
    // Make API call to verify payment
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id: params.paymentId,
        razorpay_order_id: params.orderId,
        razorpay_signature: params.signature,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response from verification API:', data);
      throw new Error(data.error || data.details || 'Payment verification failed');
    }

    return {
      success: true,
      message: data.message || 'Payment verified successfully',
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}; 