const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getLeaderboard } = require('../controllers/householdController'); // We'll create this next
const { protect } = require('../middleware/authMiddleware');
router.post('/', protect, createHousehold);
router.post('/join', protect, joinHousehold);
router.get('/leaderboard', protect, getLeaderboard);
module.exports = router;