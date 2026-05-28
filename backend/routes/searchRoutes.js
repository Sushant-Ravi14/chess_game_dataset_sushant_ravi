const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.options('/matches', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/players', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/openings', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/eco', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/moves', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/fuzzy', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/autocomplete', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/recent', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/popular', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/advanced', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/player-rating', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/date-range', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.get('/matches', searchController.searchMatches);
router.get('/players', searchController.searchPlayers);
router.get('/openings', searchController.searchOpenings);
router.get('/eco', searchController.searchByEco);
router.get('/moves', searchController.searchMoveSequence);
router.get('/fuzzy', searchController.fuzzySearch);
router.get('/autocomplete', searchController.autocomplete);
router.get('/recent', searchController.getRecentSearches);
router.get('/popular', searchController.getPopularSearches);
router.get('/advanced', searchController.advancedSearch);
router.get('/player-rating', searchController.searchByRating);
router.get('/date-range', searchController.searchByDateRange);

module.exports = router;
