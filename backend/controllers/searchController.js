const searchService = require('../services/searchService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const searchMatches = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('Search query q is required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchMatches(q, req.query);
  sendSuccess(res, 200, 'Match search completed successfully', data, meta);
});

const searchPlayers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('Search query q is required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchPlayers(q, req.query);
  sendSuccess(res, 200, 'Player search completed successfully', data, meta);
});

const searchOpenings = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('Search query q is required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchOpenings(q, req.query);
  sendSuccess(res, 200, 'Opening search completed successfully', data, meta);
});

const searchByEco = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('ECO query q is required'), { statusCode: 400 });
  }
  const openings = await searchService.searchByEco(q);
  sendSuccess(res, 200, 'ECO search completed successfully', openings);
});

const searchMoveSequence = asyncHandler(async (req, res) => {
  const queryTerm = req.query.q || req.query.moves;
  if (!queryTerm) {
    throw Object.assign(new Error('Moves sequence query q is required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchMoveSequence(queryTerm, req.query);
  sendSuccess(res, 200, 'Move sequence search completed successfully', data, meta);
});

const fuzzySearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw Object.assign(new Error('Fuzzy query q is required'), { statusCode: 400 });
  }
  const matches = await searchService.fuzzySearch(q);
  sendSuccess(res, 200, 'Fuzzy search completed successfully', matches);
});

module.exports = {
  searchMatches,
  searchPlayers,
  searchOpenings,
  searchByEco,
  searchMoveSequence,
  fuzzySearch
};
