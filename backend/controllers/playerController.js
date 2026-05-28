const playerService = require('../services/playerService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllPlayers = asyncHandler(async (req, res) => {
  const { data, meta } = await playerService.getAllPlayers(req.query);
  sendSuccess(res, 200, 'Players retrieved successfully', data, meta);
});

const getPlayerByUsername = asyncHandler(async (req, res) => {
  const player = await playerService.getPlayerByUsername(req.params.username);
  sendSuccess(res, 200, 'Player details retrieved successfully', player);
});

const getPlayerHistory = asyncHandler(async (req, res) => {
  const { data, meta } = await playerService.getPlayerHistory(req.params.username, req.query);
  sendSuccess(res, 200, 'Player match history retrieved successfully', data, meta);
});

const getPlayerStats = asyncHandler(async (req, res) => {
  const stats = await playerService.getPlayerStats(req.params.username);
  sendSuccess(res, 200, 'Player statistics retrieved successfully', stats);
});

const getPlayerOpenings = asyncHandler(async (req, res) => {
  const openings = await playerService.getPlayerOpenings(req.params.username);
  sendSuccess(res, 200, 'Player opening preferences retrieved successfully', openings);
});

const getPlayerRatingHistory = asyncHandler(async (req, res) => {
  const history = await playerService.getPlayerRatingHistory(req.params.username);
  sendSuccess(res, 200, 'Player rating history retrieved successfully', history);
});

module.exports = {
  getAllPlayers,
  getPlayerByUsername,
  getPlayerHistory,
  getPlayerStats,
  getPlayerOpenings,
  getPlayerRatingHistory,
};

