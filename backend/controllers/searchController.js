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

const autocomplete = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const suggestions = await searchService.autocomplete(q);
  sendSuccess(res, 200, 'Autocomplete suggestions retrieved successfully', suggestions);
});

const getRecentSearches = asyncHandler(async (req, res) => {
  const recent = await searchService.getRecentSearches();
  sendSuccess(res, 200, 'Recent searches retrieved successfully', recent);
});

const getPopularSearches = asyncHandler(async (req, res) => {
  const popular = await searchService.getPopularSearches();
  sendSuccess(res, 200, 'Popular searches retrieved successfully', popular);
});

const advancedSearch = asyncHandler(async (req, res) => {
  const { data, meta } = await searchService.advancedSearch(req.query, req.query);
  sendSuccess(res, 200, 'Advanced search completed successfully', data, meta);
});

const searchByRating = asyncHandler(async (req, res) => {
  const { rating } = req.query;
  if (!rating) {
    throw Object.assign(new Error('Rating query is required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchByRating(rating, req.query);
  sendSuccess(res, 200, 'Rating search completed successfully', data, meta);
});

const searchByDateRange = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    throw Object.assign(new Error('Query parameters from and to are required'), { statusCode: 400 });
  }
  const { data, meta } = await searchService.searchByDateRange(from, to, req.query);
  sendSuccess(res, 200, 'Date range search completed successfully', data, meta);
});

module.exports = {
  searchMatches,
  searchPlayers,
  searchOpenings,
  searchByEco,
  searchMoveSequence,
  fuzzySearch,
  autocomplete,
  getRecentSearches,
  getPopularSearches,
  advancedSearch,
  searchByRating,
  searchByDateRange
};
