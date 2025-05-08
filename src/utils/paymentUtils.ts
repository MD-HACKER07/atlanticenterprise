/**
 * Utility functions for handling Razorpay payments
 */

/**
 * Verify a payment by sending the payment details to the verification API
 * 
 * @param paymentId - Razorpay payment ID
 * @param orderId - Razorpay order ID
 * @param signature - Razorpay payment signature
 * @returns Promise with verification result
 */
export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment verification failed');
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

/**
 * Format a currency amount for display
 * 
 * @param amount - Amount in the smallest currency unit (e.g., paise)
 * @param divideBy100 - Whether to divide by 100 (for converting paise to rupees)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  currency = 'INR', 
  divideBy100 = true
): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(divideBy100 ? amount / 100 : amount);
};