const healthService = require('../services/health.service');

class HealthController {
  getHealth(req, res) {
    try {
     eak
      res.status(200).json(healthStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch health status' });
    }
  }
}

module.exports = new HealthController();
