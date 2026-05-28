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

module.exports = {
  searchMatches,
  searchPlayers,
  searchOpenings
};
