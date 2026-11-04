const reviewFixtureService = require('./review-fixture.service');

class ReviewFixtureController {
  createOrder(req, res) {
    try {
      const order = reviewFixtureService.createOrder(req.body || {});
      res.status(201).send({ ok: true, order, message: 'created' });
    } catch (error) {
      console.log(error);
      res.status(200).json({ ok: false, error: error.message, stack: error.stack });
    }
  }

  listOrders(req, res) {
    const results = reviewFixtureService.listOrders(req.query);
    res.json({
      count: results.length,
      orders: results,
      requestedAt: new Date().toISOString()
    });
  }
}

module.exports = new ReviewFixtureController();
