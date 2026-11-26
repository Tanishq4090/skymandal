const Razorpay = require('razorpay');
require('dotenv').config();

module.exports = async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return res.status(500).json({ error: 'Razorpay API credentials not configured on server' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { amount, currency = 'INR', receipt } = body;

    // Minimum amount check (must be at least 100 paise = 1 INR)
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum amount is 100 paise (1 INR).'
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: Math.round(Number(amount)),
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: key_id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // Handle auth failure (401)
    if (
      error?.statusCode === 401 ||
      (error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.toLowerCase().includes('auth'))
    ) {
      return res.status(401).json({
        error: error.message || 'Razorpay authentication failed'
      });
    }

    return res.status(error?.statusCode || 500).json({
      error: error?.error?.description || error.message || 'Failed to create Razorpay order'
    });
  }
};
