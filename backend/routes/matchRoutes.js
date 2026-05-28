const express = require('express');
const matchController = require('../controllers/matchController');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const { validateCreateMatch, validateUpdateMatch } = require('../middlewares/validateInput');

const router = express.Router();

router.options('/', (req, res) => {
  res.set('Allow', 'GET, POST, OPTIONS').status(204).send();
});

router.options('/:matchId', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS').status(204).send();
});

router.options('/:matchId/moves', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:matchId/pgn', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:matchId/fen', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:matchId/analysis', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/:matchId/archive', (req, res) => {
  res.set('Allow', 'PATCH, OPTIONS').status(204).send();
});

router.options('/:matchId/restore', (req, res) => {
  res.set('Allow', 'PATCH, OPTIONS').status(204).send();
});

router.options('/filter/rated', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/unrated', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/white-wins', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/black-wins', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/draws', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/checkmates', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/resignations', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/timeouts', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/rapid', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/blitz', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/bullet', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.options('/filter/classical', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

router.head('/', asyncHandler(async (req, res) => {
  const count = await Match.countDocuments({ isDeleted: { $ne: true } });
  res.set('X-Total-Count', count).status(200).send();
}));

router.get('/latest', matchController.getLatestMatches);
router.get('/trending', matchController.getTrendingMatches);
router.get('/random', matchController.getRandomMatch);
router.get('/filter/rated', matchController.getRatedMatches);
router.get('/filter/unrated', matchController.getUnratedMatches);
router.get('/filter/white-wins', matchController.getWhiteWinsMatches);
router.get('/filter/black-wins', matchController.getBlackWinsMatches);
router.get('/filter/draws', matchController.getDrawsMatches);
router.get('/filter/checkmates', matchController.getCheckmatesMatches);
router.get('/filter/resignations', matchController.getResignationsMatches);
router.get('/filter/timeouts', matchController.getTimeoutsMatches);
router.get('/filter/rapid', matchController.getRapidMatches);
router.get('/filter/blitz', matchController.getBlitzMatches);
router.get('/filter/bullet', matchController.getBulletMatches);
router.get('/filter/classical', matchController.getClassicalMatches);
router.get('/', matchController.getAllMatches);
router.post('/', validateCreateMatch, matchController.createMatch);
router.get('/:matchId/moves', matchController.getMatchMoves);
router.get('/:matchId/pgn', matchController.getMatchPGN);
router.get('/:matchId/fen', matchController.getMatchFEN);
router.get('/:matchId/analysis', matchController.getMatchAnalysis);
router.patch('/:matchId/archive', matchController.archiveMatch); 
router.patch('/:matchId/restore', matchController.restoreMatch); 
router.get('/:matchId', matchController.getMatchById);
router.put('/:matchId', validateCreateMatch, matchController.updateMatch);
router.patch('/:matchId', validateUpdateMatch, matchController.updateMatch);
router.delete('/:matchId', matchController.deleteMatch);

module.exports = router;