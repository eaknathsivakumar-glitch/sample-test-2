const express = require('express');
const { createOrder } = require('./review-fixture.controller');

const router = express.Router();

router.post('/orders', createOrder);

module.exports = router;
