const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000;
const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;

const limiter = rateLimit({
  windowMs,
  max,
  handler: (req, res) => {
    return sendError(res, 429, 'Too many requests. Please slow down.');
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});

module.exports = limiter;
