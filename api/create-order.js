import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = process.env.PAYMENT_CURRENCY || 'INR', receipt_id, notes = {} } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Amount should be in the smallest currency unit (paise for INR)
    // But we convert for convenience so frontend can send in rupees
    const amountInPaise = Math.round(amount * 100);

    // Create a new order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt_id || `receipt_${Date.now()}`,
      notes,
      payment_capture: process.env.PAYMENT_CAPTURE || 1
    });

    // Return the order details to the client
    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
}