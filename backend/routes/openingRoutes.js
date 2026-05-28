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

router.head('/', asyncHandler(async (req, res) => {
  const ecos = await Match.distinct('opening_eco', { isDeleted: { $ne: true } });
  res.set('X-Total-Openings-Count', ecos.length).status(200).send();
}));

router.get('/popular', openingController.getPopularOpenings);
router.get('/trending', openingController.getTrendingOpenings);
router.get('/', openingController.getAllOpenings);

module.exports = router;
