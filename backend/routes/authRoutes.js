const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validateInput');

const router = express.Router();

router.options('/', (req, res) => {
  res.set('Allow', 'GET, POST, PUT, DELETE, OPTIONS').status(204).send();
});
router.options('/login', (req, res) => {
  res.set('Allow', 'POST, OPTIONS').status(204).send();
});
router.options('/register', (req, res) => {
  res.set('Allow', 'POST, OPTIONS').status(204).send();
});

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken); 
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', (req, res) => {
  res.status(200).json({ success: true, message: 'Email verified successfully (dummy implementation)' });
});
router.post('/logout', protect, authController.logout);
router.get('/profile', protect, authController.getProfile);
router.patch('/profile', protect, authController.updateProfile);
router.delete('/profile', protect, authController.deleteProfile);

module.exports = router;
