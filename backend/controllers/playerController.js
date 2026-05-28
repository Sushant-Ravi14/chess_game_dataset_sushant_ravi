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

const getPlayerWinRate = asyncHandler(async (req, res) => {
  const winRate = await playerService.getPlayerWinRate(req.params.username);
  sendSuccess(res, 200, 'Player win rate retrieved successfully', winRate);
});

const getPlayerLossRate = asyncHandler(async (req, res) => {
  const lossRate = await playerService.getPlayerLossRate(req.params.username);
  sendSuccess(res, 200, 'Player loss rate retrieved successfully', lossRate);
});

const getPlayerDrawRate = asyncHandler(async (req, res) => {
  const drawRate = await playerService.getPlayerDrawRate(req.params.username);
  sendSuccess(res, 200, 'Player draw rate retrieved successfully', drawRate);
});

const getRecentMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await playerService.getRecentMatches(req.params.username, req.query);
  sendSuccess(res, 200, 'Recent matches retrieved successfully', data, meta);
});

const getTopRatedPlayers = asyncHandler(async (req, res) => {
  const players = await playerService.getTopRatedPlayers(req.query);
  sendSuccess(res, 200, 'Top rated players retrieved successfully', players);
});

const getMostActivePlayers = asyncHandler(async (req, res) => {
  const players = await playerService.getMostActivePlayers(req.query);
  sendSuccess(res, 200, 'Most active players retrieved successfully', players);
});

module.exports = {
  getAllPlayers,
  getPlayerByUsername,
  getPlayerHistory,
  getPlayerStats,
  getPlayerOpenings,
  getPlayerRatingHistory,
  getPlayerWinRate,
  getPlayerLossRate,
  getPlayerDrawRate,
  getRecentMatches, 
  getTopRatedPlayers, 
  getMostActivePlayers, 
};
