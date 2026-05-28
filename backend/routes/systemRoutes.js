const express = require('express');
const systemController = require('../controllers/systemController');

const router = express.Router();

router.get('/info', systemController.getSystemInfo);
router.get('/logs', systemController.getSystemLogs);
router.get('/version', systemController.getApiVersion);
router.get('/status', systemController.getSystemStatus);
router.get('/uptime', systemController.getUptime);
router.get('/database/status', systemController.getDatabaseStatus);
router.get('/cache/status', systemController.getCacheStatus);
router.post('/recalculate-stats', systemController.recalculateStats);
router.post('/reindex', systemController.reindexSearch);

module.exports = router;
