const express = require('express');
const { sendSuccess } = require('../utils/apiResponse');

const router = express.Router();

router.get('/logger', (req, res) => {
  sendSuccess(res, 200, 'Logger middleware is active and capturing requests.', {
    module: 'morgan or custom logger',
    status: 'enabled'
  });
});

router.get('/auth', (req, res) => {
  sendSuccess(res, 200, 'Auth middleware is configured to protect routes using JWT headers.', {
    tokenType: 'Bearer',
    status: 'enabled'
  });
});

router.get('/rate-limit', (req, res) => {
  const windowMs = process.env.RATE_LIMIT_WINDOW_MS || 900000;
  const max = process.env.RATE_LIMIT_MAX_REQUESTS || 100;
  sendSuccess(res, 200, 'Rate limiting middleware is configured.', {
    windowMs: `${windowMs}ms`,
    maxRequests: max,
    status: 'enabled'
  });
});

router.get('/error-handler', (req, res) => {
  sendSuccess(res, 200, 'Global Error Handling middleware is active and intercepting unhandled rejections/exceptions.', {
    status: 'enabled'
  });
});

module.exports = router;
