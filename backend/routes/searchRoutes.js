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

router.get('/matches', searchController.searchMatches);
router.get('/players', searchController.searchPlayers);
router.get('/openings', searchController.searchOpenings);

module.exports = router;
