const analyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getVictoryDistribution = asyncHandler(async (req, res) => {
  const distribution = await analyticsService.getVictoryDistribution();
  sendSuccess(res, 200, 'Victory distribution retrieved successfully', distribution);
});

const getColorAdvantage = asyncHandler(async (req, res) => {
  const advantage = await analyticsService.getColorAdvantage();
  sendSuccess(res, 200, 'Color advantage statistics retrieved successfully', advantage);
});

const getAverageTurnCount = asyncHandler(async (req, res) => {
  const averageTurns = await analyticsService.getAverageTurnCount();
  sendSuccess(res, 200, 'Average turn counts by time control retrieved successfully', averageTurns);
});

const getRatedVsCasual = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getRatedVsCasual();
  sendSuccess(res, 200, 'Rated vs Casual games ratio retrieved successfully', stats);
});

const getTimeControlUsage = asyncHandler(async (req, res) => {
  const usage = await analyticsService.getTimeControlUsage();
  sendSuccess(res, 200, 'Time control usage statistics retrieved successfully', usage);
});

const getTopGames = asyncHandler(async (req, res) => {
  const { data, meta } = await analyticsService.getTopGames(req.query);
  sendSuccess(res, 200, 'Top rated games retrieved successfully', data, meta);
});

module.exports = {
  getVictoryDistribution,
  getColorAdvantage,
  getAverageTurnCount,
  getRatedVsCasual,
  getTimeControlUsage,
  getTopGames
};
