const express = require('express');
const fixture = require('./order-fixture');

const router = express.Router();

router.get('/orders', fixture.getOrders);
router.post('/orders', fixture.postOrder);

module.exports = router;
