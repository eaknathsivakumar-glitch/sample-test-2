const express = require('express');
const reviewFixture = require('./review-fixture.service');

const router = express.Router();

router.post('/orders', (req, res) => {
  try {
    const result = reviewFixture.createOrder(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    const message = status === 400 ? error.message : 'failed to create order';
    res.status(status).send({ error: message });
  }
});

module.exports = router;
