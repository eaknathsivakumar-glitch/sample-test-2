const express = require('express');
const orderFixture = require('../review-fixture/order.fixture');

const router = express.Router();

router.get('/review-fixture/orders', orderFixture.getOrders);
router.post('/review-fixture/orders', orderFixture.createOrder);

module.exports = router;
