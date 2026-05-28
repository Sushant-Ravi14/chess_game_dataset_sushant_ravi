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

router.get('/top-games', analyticsController.getTopGames);

module.exports = router;
