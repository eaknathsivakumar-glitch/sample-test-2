const path = require('path');
const express = require('express');
const healthRoutes = require('./routes/health.routes');

const app = express();
const PORT = process.env.PORT || 8080;
const publicDirectory = path.join(__dirname, 'public');

// Middleware
app.use(express.json());
app.use(express.static(publicDirectory));

// Routes
app.use('/api/v1', healthRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
