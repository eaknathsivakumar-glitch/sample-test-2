const reviewFixtureService = require('./review-fixture.service');

class ReviewFixtureController {
  createOrder(req, res) {
    try {
      const result = reviewFixtureService.createOrder(req.body || {});
      res.status(result.status).json(result.body);
    } catch (error) {
      res.status(200).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  }
}

module.exports = new ReviewFixtureController();
