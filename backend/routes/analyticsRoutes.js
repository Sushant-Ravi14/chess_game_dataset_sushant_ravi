const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.set('Allow', 'GET, OPTIONS').status(204).send();
    return;
  }
  next();
});

router.get('/victory-distribution', analyticsController.getVictoryDistribution);
router.get('/color-advantage', analyticsController.getColorAdvantage);
router.get('/turn-count-average', analyticsController.getAverageTurnCount);
router.get('/rated-vs-casual', analyticsController.getRatedVsCasual);
router.get('/time-control-usage', analyticsController.getTimeControlUsage);
router.get('/shortest-games', analyticsController.getShortestGames);
router.get('/longest-games', analyticsController.getLongestGames);
router.get('/rating-gap-upsets', analyticsController.getRatingGapUpsets);
router.get('/checkmate-frequency', analyticsController.getCheckmateFrequency);
router.get('/draw-frequency', analyticsController.getDrawFrequency);
router.get('/resignation-frequency', analyticsController.getResignationFrequency);
router.get('/timeouts', analyticsController.getTimeoutFrequency);
router.get('/opening-success-rates', analyticsController.getOpeningSuccessRates);
router.get('/player-growth', analyticsController.getPlayerGrowth);
router.get('/hourly-activity', analyticsController.getHourlyActivity);
router.get('/top-games', analyticsController.getTopGames);

module.exports = router;
