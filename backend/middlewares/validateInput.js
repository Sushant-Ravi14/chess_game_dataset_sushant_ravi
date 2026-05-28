const { sendError } = require('../utils/apiResponse');

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

module.exports = {
  validateCreateMatch,
};
