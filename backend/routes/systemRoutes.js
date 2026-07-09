const express = require('express');
const systemController = require('../controllers/systemController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// All system routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

router.get('/info', systemController.getSystemInfo);
router.get('/logs', systemController.getSystemLogs);
router.get('/version', systemController.getApiVersion);
router.get('/status', systemController.getSystemStatus);
router.get('/uptime', systemController.getUptime);
router.get('/database/status', systemController.getDatabaseStatus);
router.get('/cache/status', systemController.getCacheStatus);
router.post('/recalculate-stats', systemController.recalculateStats);
router.post('/reindex', systemController.reindexSearch);
router.post('/restart', systemController.restartSystem);
router.get('/config', systemController.getConfig);
router.get('/security/events', systemController.getSecurityEvents);
router.get('/performance', systemController.getPerformance);
router.get('/storage', systemController.getStorage);

module.exports = router;
