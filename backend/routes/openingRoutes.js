const express = require('express');
const openingController = require('../controllers/openingController');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.options('/', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/popular', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/trending', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/search', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/win-rates', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/aggressive', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/defensive', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/gambits', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/eco/:ecoCode', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.head('/', asyncHandler(async (req, res) => {
  const ecos = await Match.distinct('opening_eco', { isDeleted: { $ne: true } });
  res.set('X-Total-Openings-Count', ecos.length).status(200).send();
}));

router.get('/popular', openingController.getPopularOpenings);
router.get('/trending', openingController.getTrendingOpenings);
router.get('/search', openingController.searchOpenings);
router.get('/win-rates', openingController.getOpeningWinRates);
router.get('/aggressive', openingController.getAggressiveOpenings);
router.get('/defensive', openingController.getDefensiveOpenings);
router.get('/gambits', openingController.getGambitOpenings);
router.get('/eco/:ecoCode', openingController.getOpeningByEco);
router.get('/', openingController.getAllOpenings);

module.exports = router;
