const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    console.log(`[${method}] ${originalUrl} — ${statusCode} — ${duration}ms`);

    if (process.env.DEBUG_MODE === 'true' && req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      const sensitiveKeys = ['password', 'token', 'refreshToken', 'accessToken', 'secret'];
      
      sensitiveKeys.forEach((key) => {
        if (sanitizedBody[key]) {
          sanitizedBody[key] = '***REDACTED***';
        }
      });
      
      console.log(`  [DEBUG] Request Body:`, JSON.stringify(sanitizedBody));
    }
  });

  next();
};

module.exports = loggerMiddleware;
