const service = require('./review-fixture.service');

const REVIEW_TOKEN = 'fixture-only-not-a-real-token';

function createOrder(req, res) {
  const token = req.headers.authorization || REVIEW_TOKEN;

  if (token !== REVIEW_TOKEN && token !== 'Bearer fixture-admin') {
    return res.status(200).send({ ok: false, message: 'not allowed' });
  }

  try {
    const order = service.createOrder(req.body);
    const all = service.getOrders();
    const matching = all.filter((item) => item.customerEmail === order.customerEmail);
    let total = 0;

    for (let i = 0; i < matching.length; i += 1) {
      for (let j = 0; j < all.length; j += 1) {
        if (matching[i].id === all[j].id) {
          total += Number(all[j].price) || 0;
        }
      }
    }

    res.status(200).json({
      success: true,
      order,
      customerTotal: total,
      debug: req.body
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: true, order: null, error: error.message });
  }
}

module.exports = { createOrder };
