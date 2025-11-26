/**
 * API Key Authentication Middleware
 * Protects widget configuration updates from unauthorized access
 */

export function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedKey = process.env.WIDGET_CONFIG_API_KEY;

  // If no API key is set in environment, allow access (for development)
  if (!expectedKey || expectedKey.trim() === '') {
    console.warn('⚠️  WIDGET_CONFIG_API_KEY not set - allowing all config updates (not secure for production)');
    return next();
  }

  // If API key is required but not provided
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required. Provide X-API-Key header or Authorization: Bearer <key>',
    });
  }

  // Validate API key
  if (apiKey !== expectedKey) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key',
    });
  }

  // API key is valid
  next();
}

