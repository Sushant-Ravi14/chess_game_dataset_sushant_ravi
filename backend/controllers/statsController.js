const statsService = require('../services/statsService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalMatches, totalPlayers, averageRating, whiteWinRate] = await Promise.all([
    statsService.getTotalMatches(),
    statsService.getTotalPlayers(),
    statsService.getAverageRating(),
    statsService.getWhiteWinRate()
  ]);

  sendSuccess(res, 200, 'Dashboard stats retrieved successfully', {
    totalMatches,
    totalPlayers,
    averageRating,
    rates: {
      whiteWinRate
    }
  });
});

const getTotalMatches = asyncHandler(async (req, res) => {
  const count = await statsService.getTotalMatches();
  sendSuccess(res, 200, 'Total matches count retrieved successfully', { count });
});

const getTotalPlayers = asyncHandler(async (req, res) => {
  const count = await statsService.getTotalPlayers();
  sendSuccess(res, 200, 'Total players count retrieved successfully', { count });
});

const getAverageRating = asyncHandler(async (req, res) => {
  const averageRating = await statsService.getAverageRating();
  sendSuccess(res, 200, 'Average rating retrieved successfully', { averageRating });
});

const getTopOpenings = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const openings = await statsService.getTopOpenings(limit);
  sendSuccess(res, 200, 'Most played openings retrieved successfully', openings);
});

const getCheckmateRate = asyncHandler(async (req, res) => {
  const checkmateRate = await statsService.getCheckmateRate();
  sendSuccess(res, 200, 'Checkmate percentage retrieved successfully', { checkmateRate });
});

const getResignationRate = asyncHandler(async (req, res) => {
  const resignationRate = await statsService.getResignationRate();
  sendSuccess(res, 200, 'Resignation percentage retrieved successfully', { resignationRate });
});

const getTimeoutRate = asyncHandler(async (req, res) => {
  const timeoutRate = await statsService.getTimeoutRate();
  sendSuccess(res, 200, 'Timeout percentage retrieved successfully', { timeoutRate });
});

const getWhiteWinRate = asyncHandler(async (req, res) => {
  const whiteWinRate = await statsService.getWhiteWinRate();
  sendSuccess(res, 200, 'White win percentage retrieved successfully', { whiteWinRate });
});

const getBlackWinRate = asyncHandler(async (req, res) => {
  const blackWinRate = await statsService.getBlackWinRate();
  sendSuccess(res, 200, 'Black win percentage retrieved successfully', { blackWinRate });
});

const getDrawRate = asyncHandler(async (req, res) => {
  const drawRate = await statsService.getDrawRate();
  sendSuccess(res, 200, 'Draw percentage retrieved successfully', { drawRate });
});

const getRatedGamesCount = asyncHandler(async (req, res) => {
  const count = await statsService.getRatedGamesCount();
  sendSuccess(res, 200, 'Rated games count retrieved successfully', { count });
});

const getUnratedGamesCount = asyncHandler(async (req, res) => {
  const count = await statsService.getUnratedGamesCount();
  sendSuccess(res, 200, 'Unrated games count retrieved successfully', { count });
});

const getDailyGamesStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDailyGamesStats();
  sendSuccess(res, 200, 'Daily game counts retrieved successfully', stats);
});

const getMonthlyGamesStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getMonthlyGamesStats();
  sendSuccess(res, 200, 'Monthly game counts retrieved successfully', stats);
});

const getYearlyGamesStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getYearlyGamesStats();
  sendSuccess(res, 200, 'Yearly game counts retrieved successfully', stats);
});

module.exports = {
  getDashboardStats,
  getTotalMatches,
  getTotalPlayers,
  getAverageRating,
  getTopOpenings,
  getCheckmateRate,
  getResignationRate,
  getTimeoutRate,
  getWhiteWinRate,
  getBlackWinRate,
  getDrawRate,
  getRatedGamesCount,
  getUnratedGamesCount,
  getDailyGamesStats,
  getMonthlyGamesStats,
  getYearlyGamesStats
};
