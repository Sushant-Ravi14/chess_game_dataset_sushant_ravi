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

const getRatingGapUpsets = asyncHandler(async (req, res) => {
  const upsets = await analyticsService.getRatingGapUpsets();
  sendSuccess(res, 200, 'Rating gap upsets retrieved successfully', upsets);
});

const getCheckmateFrequency = asyncHandler(async (req, res) => {
  const freq = await analyticsService.getCheckmateFrequency();
  sendSuccess(res, 200, 'Checkmate frequency retrieved successfully', freq);
});

const getDrawFrequency = asyncHandler(async (req, res) => {
  const freq = await analyticsService.getDrawFrequency();
  sendSuccess(res, 200, 'Draw frequency retrieved successfully', freq);
});

const getShortestGames = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const games = await analyticsService.getShortestGames(limit);
  sendSuccess(res, 200, 'Shortest matches retrieved successfully', games);
});

const getLongestGames = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const games = await analyticsService.getLongestGames(limit);
  sendSuccess(res, 200, 'Longest matches retrieved successfully', games);
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
  getRatingGapUpsets,
  getCheckmateFrequency,
  getDrawFrequency,
  getShortestGames,
  getLongestGames,
  getTopGames
};
