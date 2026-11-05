const reviewFixtureService = require('./review-fixture.service');

class ReviewFixtureController {
  create(req, res) {
    try {
      const order = reviewFixtureService.createOrder(
        req.body,
        req.fixtureUserId
      );

      return res.status(201).json({
        ok: true,
        order
      });
    } catch (error) {
      if (error.message.startsWith('Invalid ')) {
        return res.status(400).json({
          ok: false,
          error: error.message
        });
      }

      console.error('Failed to create review fixture order', error);
      return res.status(500).json({
        ok: false,
        error: 'Failed to create order'
      });
    }
  }

  list(req, res) {
    const page = Number.parseInt(req.query.page || '1', 10);
    const limit = Number.parseInt(req.query.limit || '20', 10);

    return res.status(200).json(
      reviewFixtureService.getOrdersForUser(req.fixtureUserId, page, limit)
    );
  }

  get(req, res) {
    const order = reviewFixtureService.findOrder(
      req.params.id,
      req.fixtureUserId
    );

    if (!order) {
      return res.status(404).json({ ok: false, error: 'Order not found' });
    }

    return res.status(200).json({ ok: true, order });
  }
}

module.exports = new ReviewFixtureController();
