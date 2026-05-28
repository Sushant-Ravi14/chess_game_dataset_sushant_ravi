const { sendError } = require('../utils/apiResponse');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim() === '') {
    errors.push({ field: 'username', message: 'Username is required and must be a non-empty string' });
  }
  
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Email format is invalid' });
    }
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push({ field: 'password', message: 'Password is required and must be at least 8 characters long' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }
  next();
};

const validateCreateMatch = (req, res, next) => {
  const requiredFields = [
    'id', 'rated', 'created_at', 'last_move_at', 'turns',
    'victory_status', 'winner', 'increment_code', 'white_id',
    'white_rating', 'black_id', 'black_rating', 'moves',
    'opening_eco', 'opening_name', 'opening_ply'
  ];

  const errors = [];
  requiredFields.forEach((field) => {
    if (req.body[field] === undefined || req.body[field] === null || String(req.body[field]).trim() === '') {
      errors.push({ field, message: `${field} is required and cannot be empty` });
    }
  });

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }
  next();
};

const validateUpdateMatch = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendError(res, 400, 'At least one field must be present to update a match');
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateMatch,
  validateUpdateMatch,
};
