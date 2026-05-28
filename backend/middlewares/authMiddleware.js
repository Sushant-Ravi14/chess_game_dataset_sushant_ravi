const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'No token provided. Authorization denied.');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) return sendError(res, 401, 'User not found. Token invalid.');
    if (req.user.isBanned) return sendError(res, 403, 'Account has been banned.');
    next();
  } catch (err) {
    return sendError(res, 401, 'Token is invalid or has expired.');
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendError(res, 403, 'You do not have permission to perform this action.');
  }
  next();
};

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch (err) {
    }
  }
  next();
};

module.exports = { protect, restrictTo, optionalProtect };
