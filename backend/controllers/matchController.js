const matchService = require('../services/matchService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getAllMatches(req.query);
  sendSuccess(res, 200, 'Matches retrieved successfully', data, meta);
});

const getMatchById = asyncHandler(async (req, res) => {
  const match = await matchService.getMatchById(req.params.matchId);
  sendSuccess(res, 200, 'Match retrieved successfully', match);
});

const createMatch = asyncHandler(async (req, res) => {
  const match = await matchService.createMatch(req.body);
  sendSuccess(res, 201, 'Match created successfully', match);
});

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
};
