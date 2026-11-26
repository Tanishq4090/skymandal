const crypto = require('crypto');
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

  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: missing Razorpay secret'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Check required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)'
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');

    // Timing-safe signature comparison
    let isMatch = false;
    try {
      const generatedBuf = Buffer.from(generatedSignature, 'utf-8');
      const signatureBuf = Buffer.from(razorpay_signature, 'utf-8');
      if (generatedBuf.length === signatureBuf.length) {
        isMatch = crypto.timingSafeEqual(generatedBuf, signatureBuf);
      }
    } catch (e) {
      isMatch = false;
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Signature verification failed. Payment cannot be marked as verified.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id
    });
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error verifying payment'
    });
  }
};
