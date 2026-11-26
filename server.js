const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const createOrderHandler = require('./api/create-order');
const verifyPaymentHandler = require('./api/verify-payment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Backend Razorpay API routes
app.post('/api/create-order', createOrderHandler);
app.post('/api/verify-payment', verifyPaymentHandler);

// Serve static frontend build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// SPA client-side routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SKY Mandal server running on http://localhost:${PORT}`);
  console.log(`💳 Razorpay API active at /api/create-order and /api/verify-payment`);
});
