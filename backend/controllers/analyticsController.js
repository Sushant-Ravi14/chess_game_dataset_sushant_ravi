const analyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getTopGames = asyncHandler(async (req, res) => {
  const { data, meta } = await analyticsService.getTopGames(req.query);
  sendSuccess(res, 200, 'Top rated games retrieved successfully', data, meta);
});

module.exports = {
  getTopGames
};
