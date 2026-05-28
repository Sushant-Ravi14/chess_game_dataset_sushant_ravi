const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.set('Allow', 'GET, OPTIONS').status(204).send();
    return;
  }
  next();
});

router.get('/total-matches', statsController.getTotalMatches);
router.get('/total-players', statsController.getTotalPlayers);
router.get('/average-rating', statsController.getAverageRating);
router.get('/top-openings', statsController.getTopOpenings);
router.get('/checkmate-rate', statsController.getCheckmateRate);

module.exports = router;
