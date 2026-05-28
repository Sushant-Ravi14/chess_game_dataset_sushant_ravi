const express = require('express');
const playerController = require('../controllers/playerController');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.options('/', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/history', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/stats', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/openings', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/rating-history', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/win-rate', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/loss-rate', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:username/draw-rate', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.head('/', asyncHandler(async (req, res) => {
  const whitePlayers = await Match.distinct('white_id', { isDeleted: { $ne: true } });
  const blackPlayers = await Match.distinct('black_id', { isDeleted: { $ne: true } });
  const uniquePlayers = new Set([...whitePlayers, ...blackPlayers]);
  res.set('X-Total-Players-Count', uniquePlayers.size).status(200).send();
}));

router.get('/', playerController.getAllPlayers);
router.get('/:username/history', playerController.getPlayerHistory);
router.get('/:username/stats', playerController.getPlayerStats);
router.get('/:username/openings', playerController.getPlayerOpenings);
router.get('/:username/rating-history', playerController.getPlayerRatingHistory);
router.get('/:username/win-rate', playerController.getPlayerWinRate);
router.get('/:username/loss-rate', playerController.getPlayerLossRate);
router.get('/:username/draw-rate', playerController.getPlayerDrawRate);

router.get('/:username', playerController.getPlayerByUsername);

module.exports = router;
