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
router.get('/top-games', analyticsController.getTopGames);

module.exports = router;
