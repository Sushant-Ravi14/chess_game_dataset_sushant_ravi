
const optionsHeadMiddleware = (req, res, next) => {
  // HEAD requests: add a resource-available header but let routes handle it
  if (req.method === 'HEAD') {
    res.set('X-Resource-Available', 'true');
  }

  // Let CORS middleware handle OPTIONS preflight properly
  next();
};

module.exports = optionsHeadMiddleware;
