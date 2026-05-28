const express = require('express');
const playerController = require('../controllers/playerController');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// OPTIONS - allowed methods
router.options('/', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/history', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

// HEAD - returns distinct players count
router.head('/', asyncHandler(async (req, res) => {
  const whitePlayers = await Match.distinct('white_id', { isDeleted: { $ne: true } });
  const blackPlayers = await Match.distinct('black_id', { isDeleted: { $ne: true } });
  const uniquePlayers = new Set([...whitePlayers, ...blackPlayers]);
  res.set('X-Total-Players-Count', uniquePlayers.size).status(200).send();
}));

// Route mappings (Parametric routes at the end)
router.get('/', playerController.getAllPlayers);
router.get('/:username', playerController.getPlayerByUsername);
router.get('/:username/history', playerController.getPlayerHistory);

module.exports = router;
