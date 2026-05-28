const express = require('express');
const matchController = require('../controllers/matchController');
const { protect } = require('../middlewares/authMiddleware');
const { validateCreateMatch, validateUpdateMatch } = require('../middlewares/validateInput');

const router = express.Router();

router.use(protect);

router.get('/matches', matchController.getAllMatches);
router.post('/matches', validateCreateMatch, matchController.createMatch);
router.patch('/matches/:id', validateUpdateMatch, matchController.updateMatch);
router.delete('/matches/:id', matchController.deleteMatch);

module.exports = router;
