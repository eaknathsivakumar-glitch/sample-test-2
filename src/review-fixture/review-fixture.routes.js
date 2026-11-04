const express = require('express');
const controller = require('./review-fixture.controller');

const router = express.Router();

router.post('/orders', controller.createOrder.bind(controller));
router.get('/orders', controller.listOrders.bind(controller));

module.exports = router;
