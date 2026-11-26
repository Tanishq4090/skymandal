const express = require('express');
const createOrder = require('../api/create-order');
const verifyPayment = require('../api/verify-payment');

module.exports = function (app) {
  app.use(express.json());
  app.post('/api/create-order', createOrder);
  app.post('/api/verify-payment', verifyPayment);
};
