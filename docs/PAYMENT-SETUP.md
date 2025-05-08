# Payment Gateway Setup Guide

## Overview
This document outlines how to configure the Razorpay payment gateway in this application, including switching between test and production environments.

## Environment Variables
The payment system uses environment variables for configuration. These should be set in your `.env` file:

### Razorpay Configuration
```
# Test Mode
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY

# Production Mode
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
```

### Payment Settings
```
PAYMENT_CURRENCY=INR
PAYMENT_CAPTURE=1
```

## Switching Between Test and Production
1. Obtain your live credentials from the Razorpay dashboard
2. Update your `.env` file with the live credentials
3. Restart your application server

## Important Notes
- Never commit your production keys to version control
- Always test thoroughly in test mode before switching to production
- The `NEXT_PUBLIC_` prefix is required for frontend access
- Production keys start with `rzp_live_` while test keys start with `rzp_test_`

## Testing Payments
- In test mode, use Razorpay's test card numbers:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - OTP: 1234

## Payment Flow
1. User initiates payment on the frontend
2. Application creates an order via `/api/create-order`
3. Razorpay checkout opens
4. On successful payment, verification happens via `/api/verify-payment`
5. Payment details are saved in the database

## Troubleshooting
- Ensure your API keys match the environment (test/live)
- Check server logs for detailed error messages
- Verify webhook configuration in your Razorpay dashboard
- For payment failures, check the transaction ID in Razorpay dashboard 