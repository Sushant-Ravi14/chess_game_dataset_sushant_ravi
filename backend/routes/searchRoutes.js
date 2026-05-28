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

router.get('/matches', searchController.searchMatches);
router.get('/players', searchController.searchPlayers);
router.get('/openings', searchController.searchOpenings);
router.get('/eco', searchController.searchByEco);
router.get('/moves', searchController.searchMoveSequence);
router.get('/fuzzy', searchController.fuzzySearch);

module.exports = router;
