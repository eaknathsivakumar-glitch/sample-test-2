const express = require('express');
const fixture = require('./review-fixture');

const router = express.Router();

router.post('/orders', fixture.createOrder);
router.get('/orders', fixture.listOrders);

module.exports = router;
