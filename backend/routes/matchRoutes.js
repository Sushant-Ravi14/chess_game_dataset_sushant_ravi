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

router.head('/', asyncHandler(async (req, res) => {
  const count = await Match.countDocuments({ isDeleted: { $ne: true } });
  res.set('X-Total-Count', count).status(200).send();
}));

router.get('/', matchController.getAllMatches);
router.post('/', validateCreateMatch, matchController.createMatch);
router.get('/:matchId/moves', matchController.getMatchMoves);
router.get('/:matchId', matchController.getMatchById);
router.put('/:matchId', validateCreateMatch, matchController.updateMatch);
router.patch('/:matchId', validateUpdateMatch, matchController.updateMatch);
router.delete('/:matchId', matchController.deleteMatch);

module.exports = router;
