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

const getOpeningByEco = asyncHandler(async (req, res) => {
  const opening = await openingService.getOpeningByEco(req.params.ecoCode);
  sendSuccess(res, 200, 'Opening retrieved successfully', opening);
});

const searchOpenings = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('Search query parameter q is required'), { statusCode: 400 });
  }
  const openings = await openingService.searchOpenings(q);
  sendSuccess(res, 200, 'Openings search results retrieved successfully', openings);
});

const getOpeningWinRates = asyncHandler(async (req, res) => {
  const winRates = await openingService.getOpeningWinRates();
  sendSuccess(res, 200, 'Opening win rates retrieved successfully', winRates);
});

const getAggressiveOpenings = asyncHandler(async (req, res) => {
  const openings = await openingService.getAggressiveOpenings();
  sendSuccess(res, 200, 'Aggressive openings retrieved successfully', openings);
});

const getDefensiveOpenings = asyncHandler(async (req, res) => {
  const openings = await openingService.getDefensiveOpenings();
  sendSuccess(res, 200, 'Defensive openings retrieved successfully', openings);
});

const getGambitOpenings = asyncHandler(async (req, res) => {
  const openings = await openingService.getGambitOpenings();
  sendSuccess(res, 200, 'Gambit openings retrieved successfully', openings);
});

module.exports = {
  getAllOpenings,
  getPopularOpenings,
  getTrendingOpenings,
  getOpeningByEco,
  searchOpenings,
  getOpeningWinRates,
  getAggressiveOpenings,
  getDefensiveOpenings,
  getGambitOpenings
};
