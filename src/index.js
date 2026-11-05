const express = require('express');
const healthRoutes = require('./routes/health.routes');
const reviewFixtureRoutes = require('./review-fixture/review-fixture.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/review-fixture', reviewFixtureRoutes);

module.exports = app;
