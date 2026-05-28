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

const getBlackWinsMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getBlackWinsMatches(req.query);
  sendSuccess(res, 200, 'Black win matches retrieved successfully', data, meta);
});

const getDrawsMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getDrawsMatches(req.query);
  sendSuccess(res, 200, 'Draw matches retrieved successfully', data, meta);
});

const getCheckmatesMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getCheckmatesMatches(req.query);
  sendSuccess(res, 200, 'Checkmate matches retrieved successfully', data, meta);
});

const getResignationsMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getResignationsMatches(req.query);
  sendSuccess(res, 200, 'Resignation matches retrieved successfully', data, meta);
});

const getTimeoutsMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getTimeoutsMatches(req.query);
  sendSuccess(res, 200, 'Timeout matches retrieved successfully', data, meta);
});

const getRapidMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getRapidMatches(req.query);
  sendSuccess(res, 200, 'Rapid matches retrieved successfully', data, meta);
});

const getBulletMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getBulletMatches(req.query);
  sendSuccess(res, 200, 'Bullet matches retrieved successfully', data, meta);
});

const getBlitzMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getBlitzMatches(req.query);
  sendSuccess(res, 200, 'Blitz matches retrieved successfully', data, meta);
});

const getClassicalMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getClassicalMatches(req.query);
  sendSuccess(res, 200, 'Classical matches retrieved successfully', data, meta);
});

const getHighRatedMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getHighRatedMatches(req.query);
  sendSuccess(res, 200, 'High rated matches retrieved successfully', data, meta);
});

const getLowRatedMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getLowRatedMatches(req.query);
  sendSuccess(res, 200, 'Low rated matches retrieved successfully', data, meta);
});

const getLongGamesMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getLongGamesMatches(req.query);
  sendSuccess(res, 200, 'Long duration games retrieved successfully', data, meta);
});

const getScrollMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getScrollMatches(req.query);
  sendSuccess(res, 200, 'Matches retrieved successfully via cursor scroll', data, meta);
});

const getInfiniteMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getInfiniteMatches(req.query);
  sendSuccess(res, 200, 'Matches retrieved successfully for infinite scroll', data, meta);
});

const getShortestMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getShortestMatches(req.query);
  sendSuccess(res, 200, 'Shortest matches retrieved successfully', data, meta);
});

const getLongestMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getLongestMatches(req.query);
  sendSuccess(res, 200, 'Longest matches retrieved successfully', data, meta);
});

const getHighestRatedMatches = asyncHandler(async (req, res) => {
  const { data, meta } = await matchService.getHighestRatedMatches(req.query);
  sendSuccess(res, 200, 'Highest rated matches retrieved successfully', data, meta);
});

const bulkUpload = asyncHandler(async (req, res) => {
  const result = await matchService.bulkUpload(req.body);
  sendSuccess(res, 201, 'Bulk matches uploaded successfully', result);
});

const bulkUpdate = asyncHandler(async (req, res) => {
  const { ids, data } = req.body;
  const result = await matchService.bulkUpdate(ids, data);
  sendSuccess(res, 200, 'Bulk matches updated successfully', result);
});

const bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const result = await matchService.bulkDelete(ids);
  sendSuccess(res, 200, 'Bulk matches soft deleted successfully', result);
});

const bulkArchive = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const result = await matchService.bulkArchive(ids);
  sendSuccess(res, 200, 'Bulk matches archived successfully', result);
});

const bulkRestore = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const result = await matchService.bulkRestore(ids);
  sendSuccess(res, 200, 'Bulk matches restored successfully', result);
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
  getWhiteWinsMatches,
  getBlackWinsMatches,
  getDrawsMatches,
  getCheckmatesMatches,
  getResignationsMatches,
  getTimeoutsMatches,
  getRapidMatches,
  getBulletMatches,
  getBlitzMatches,
  getClassicalMatches,
  getHighRatedMatches,
  getLowRatedMatches,
  getLongGamesMatches,
  getScrollMatches,
  getInfiniteMatches,
  getShortestMatches,
  getLongestMatches,
  getHighestRatedMatches,
  bulkUpload,
  bulkUpdate,
  bulkDelete,
  bulkArchive,
  bulkRestore
};
