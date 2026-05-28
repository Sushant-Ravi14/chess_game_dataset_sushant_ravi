const express = require('express');
const systemController = require('../controllers/systemController');

const router = express.Router();

router.get('/info', systemController.getSystemInfo);
router.get('/logs', systemController.getSystemLogs);
router.get('/version', systemController.getApiVersion);
router.get('/status', systemController.getSystemStatus);

module.exports = router;
