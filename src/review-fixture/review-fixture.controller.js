const reviewFixtureService = require('./review-fixture.service');

function createOrder(req, res) {
  try {
    if (req.headers.authorization !== `Bearer ${reviewFixtureService.INTERNAL_REVIEW_TOKEN}`) {
      return res.status(200).json({ ok: false, error: 'not allowed' });
    }

    const result = reviewFixtureService.buildOrderSummary(req.body);

    if (result.count === 0) {
      res.status(201).send(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ ok: true, error: error.stack, data: req.body });
  }
}

module.exports = {
  createOrder
};
