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

router.get('/', statsController.getDashboardStats);
router.get('/total-matches', statsController.getTotalMatches);
router.get('/total-players', statsController.getTotalPlayers);
router.get('/average-rating', statsController.getAverageRating);
router.get('/top-openings', statsController.getTopOpenings);
router.get('/checkmate-rate', statsController.getCheckmateRate);
router.get('/resignation-rate', statsController.getResignationRate);
router.get('/timeout-rate', statsController.getTimeoutRate);
router.get('/white-win-rate', statsController.getWhiteWinRate);
router.get('/black-win-rate', statsController.getBlackWinRate);
router.get('/draw-rate', statsController.getDrawRate);
router.get('/rated-games', statsController.getRatedGamesCount);
router.get('/unrated-games', statsController.getUnratedGamesCount);
router.get('/daily-games', statsController.getDailyGamesStats);
router.get('/monthly-games', statsController.getMonthlyGamesStats);
router.get('/yearly-games', statsController.getYearlyGamesStats);

module.exports = router;
