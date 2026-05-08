class HealthService {
  getHealthStatus() {
    return {
      status: 'okayyishhhh',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}

module.exports = new HealthService();
