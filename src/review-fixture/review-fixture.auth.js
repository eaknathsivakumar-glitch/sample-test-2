function requireFixtureAuth(req, res, next) {
  const configuredToken = process.env.REVIEW_FIXTURE_TOKEN;
  const providedToken = req.get('authorization');

  if (!configuredToken) {
    return res.status(503).json({
      ok: false,
      error: 'Review fixture authentication is not configured'
    });
  }

  if (providedToken !== `Bearer ${configuredToken}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  req.fixtureUserId = process.env.REVIEW_FIXTURE_USER_ID || 'demo-user';
  return next();
}

module.exports = { requireFixtureAuth };
