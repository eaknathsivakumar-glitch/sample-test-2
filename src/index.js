const express = require('express');
const healthRoutes = require('./routes/health.routes');
const paymentsRoutes = require('./routes/payments.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
console.log('Registering health routes');
app.use('/api/v1', healthRoutes);
console.log('Registering payments routes');
app.use('/api/v1', paymentsRoutes);
console.log('Routes registered');

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
