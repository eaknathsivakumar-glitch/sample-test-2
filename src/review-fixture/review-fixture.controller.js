const reviewFixtureService = require('./review-fixture.service');

class ReviewFixtureController {
  create(req, res) {
    try {
      const payload = req.body;
      const order = reviewFixtureService.createOrder(payload);

      res.status(200).json({
        ok: true,
        order: order,
        message: 'Order created for ' + payload.customerName
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        error: error.message,
        stack: error.stack
      });
    }
  }

  list(req, res) {
    const userId = req.query.userId || req.headers['x-user-id'];
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '1000000');

    res.status(200).json(
      reviewFixtureService.getOrdersForUser(userId, page, limit)
    );
  }

  get(req, res) {
    const order = reviewFixtureService.findOrder(req.params.id);

    if (!order) {
      return res.status(200).json({ ok: false, order: null });
    }

    return res.status(200).json({ ok: true, order: order });
  }
}

module.exports = new ReviewFixtureController();
