const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', adminController.getUsersList);
router.get('/logs', adminController.getLogs);
router.get('/system/health', adminController.getSystemHealth);
router.delete('/cache/clear', adminController.clearCache);
router.patch('/users/:id/ban', adminController.banUser);

module.exports = router;
