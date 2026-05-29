
const optionsHeadMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    return res.status(204).end();
  }

  if (req.method === 'HEAD') {
    res.set('X-Resource-Available', 'true');
  }

  next();
};

module.exports = optionsHeadMiddleware;
