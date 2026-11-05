const express = require('express');
const healthRoutes = require('./routes/health.routes');
const reviewFixtureRoutes = require('./routes/review-fixture.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1', reviewFixtureRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
