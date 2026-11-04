const express = require('express');
const reviewFixture = require('./review-fixture.service');

const router = express.Router();

router.post('/orders', (req, res) => {
  reviewFixture.createOrder(req, res);
});

router.get('/orders', (req, res) => {
  reviewFixture.listOrders(req, res);
});

module.exports = router;
