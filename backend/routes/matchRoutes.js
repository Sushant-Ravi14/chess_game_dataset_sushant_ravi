const express = require('express');
const matchController = require('../controllers/matchController');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// OPTIONS - allowed methods
router.options('/', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

// HEAD - returns count header without body
router.head('/', asyncHandler(async (req, res) => {
  const count = await Match.countDocuments({ isDeleted: { $ne: true } });
  res.set('X-Total-Count', count).status(200).send();
}));

router.get('/', matchController.getAllMatches);

module.exports = router;
