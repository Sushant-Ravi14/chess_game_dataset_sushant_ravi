const openingService = require('../services/openingService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllOpenings = asyncHandler(async (req, res) => {
  const { data, meta } = await openingService.getAllOpenings(req.query);
  sendSuccess(res, 200, 'Openings retrieved successfully', data, meta);
});

const getPopularOpenings = asyncHandler(async (req, res) => {
  const openings = await openingService.getPopularOpenings(req.query);
  sendSuccess(res, 200, 'Popular openings retrieved successfully', openings);
});

const getTrendingOpenings = asyncHandler(async (req, res) => {
  const openings = await openingService.getTrendingOpenings(req.query);
  sendSuccess(res, 200, 'Trending openings retrieved successfully', openings);
});

module.exports = {
  getAllOpenings,
  getPopularOpenings,
  getTrendingOpenings
};
