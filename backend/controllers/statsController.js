const statsService = require('../services/statsService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

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

module.exports = {
  getTotalMatches,
  getTotalPlayers,
  getAverageRating,
  getTopOpenings,
  getCheckmateRate
};
