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

const updateMatch = asyncHandler(async (req, res) => {
  const match = await matchService.updateMatch(req.params.matchId, req.body);
  sendSuccess(res, 200, 'Match updated successfully', match);
});

const deleteMatch = asyncHandler(async (req, res) => {
  const result = await matchService.deleteMatch(req.params.matchId);
  sendSuccess(res, 200, 'Match soft deleted successfully', result);
});

const getMatchMoves = asyncHandler(async (req, res) => {
  const moves = await matchService.getMatchMoves(req.params.matchId);
  sendSuccess(res, 200, 'Match moves retrieved successfully', moves);
});

const getMatchPGN = asyncHandler(async (req, res) => {
  const pgn = await matchService.getMatchPGN(req.params.matchId);
  sendSuccess(res, 200, 'Match PGN retrieved successfully', pgn);
});

const getMatchFEN = asyncHandler(async (req, res) => {
  const fen = await matchService.getMatchFEN(req.params.matchId);
  sendSuccess(res, 200, 'Match FEN retrieved successfully', fen);
});

const getMatchAnalysis = asyncHandler(async (req, res) => {
  const analysis = await matchService.getMatchAnalysis(req.params.matchId);
  sendSuccess(res, 200, 'Match analysis retrieved successfully', analysis);
});

const getLatestMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getLatestMatches(req.query);
  sendSuccess(res, 200, 'Latest matches retrieved successfully', data, meta);
});

const getTrendingMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getTrendingMatches(req.query);
  sendSuccess(res, 200, 'Trending matches retrieved successfully', data, meta);
});

const getRandomMatch = asyncHandler(async (req, res) => {
  const match = await matchService.getRandomMatch();
  sendSuccess(res, 200, 'Random match retrieved successfully', match);
});

const archiveMatch = asyncHandler(async (req, res) => {
  const match = await matchService.archiveMatch(req.params.matchId);
  sendSuccess(res, 200, 'Match archived successfully', match);
});

const restoreMatch = asyncHandler(async (req, res) => {
  const match = await matchService.restoreMatch(req.params.matchId);
  sendSuccess(res, 200, 'Match restored successfully', match);
});

const getRatedMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getRatedMatches(req.query);
  sendSuccess(res, 200, 'Rated matches retrieved successfully', data, meta);
});

const getUnratedMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getUnratedMatches(req.query);
  sendSuccess(res, 200, 'Unrated matches retrieved successfully', data, meta);
});

const getWhiteWinsMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getWhiteWinsMatches(req.query);
  sendSuccess(res, 200, 'White win matches retrieved successfully', data, meta);
});

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchMoves,
  getMatchPGN,
  getMatchFEN,
  getMatchAnalysis,
  getLatestMatches,
  getTrendingMatches,
  getRandomMatch, 
  archiveMatch, 
  restoreMatch, 
  getRatedMatches,
  getUnratedMatches,
  getWhiteWinsMatches
};
