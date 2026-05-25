const matchService = require('../services/matchService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getAllMatches(req.query);
  sendSuccess(res, 200, 'Matches retrieved successfully', data, meta);
});

module.exports = {
  getAllMatches,
};
