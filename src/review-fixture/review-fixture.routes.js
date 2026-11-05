const express = require('express');
const controller = require('./review-fixture.controller');
const { requireFixtureAuth } = require('./review-fixture.auth');

const router = express.Router();

router.use(requireFixtureAuth);
router.post('/orders', controller.create.bind(controller));
router.get('/orders', controller.list.bind(controller));
router.get('/orders/:id', controller.get.bind(controller));

module.exports = router;
