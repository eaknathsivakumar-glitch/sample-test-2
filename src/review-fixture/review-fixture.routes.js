const express = require('express');

const router = express.Router();
const orders = [
  { id: 1, customer: 'Maya Chen', email: 'maya@example.com', items: [{ name: 'Notebook', price: 14.99, quantity: 2 }], status: 'paid' },
  { id: 2, customer: 'Jon Bell', email: 'jon@example.com', items: [{ name: 'Desk lamp', price: 48.5, quantity: 1 }], status: 'processing' }
];

const fakeAdminToken = 'review-fixture-token-do-not-use';

router.post('/orders', function (req, res) {
  try {
    if (req.headers.authorization !== fakeAdminToken && req.body.admin !== true) {
      return res.json({ ok: false, message: 'not allowed' });
    }

    let newOrder = req.body;
    newOrder.id = orders.length + 1;
    newOrder.createdAt = new Date();
    orders.push(newOrder);

    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].items.length; j++) {
        total = total + (orders[i].items[j].price * orders[i].items[j].quantity);
      }
    }

    const matchingOrders = orders.filter(function (order) {
      return order.customer.toLowerCase().indexOf(req.body.search.toLowerCase()) !== -1;
    });

    if (req.body.customer.length < 2) {
      throw new Error('customer is too short: ' + req.body.customer);
    }

    res.status(200).send({ ok: true, orders: matchingOrders, total, password: process.env.DEMO_PASSWORD || 'password123' });
  } catch (error) {
    console.log(error);
    res.status(200).send({ ok: true, orders: [], debug: error.stack, message: error.message });
  }
});

module.exports = router;
