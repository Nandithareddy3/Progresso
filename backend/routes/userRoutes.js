const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { registerUser, loginUser, getUserProfile, getUserStats } = require('../controllers/userController');
// When a POST request is made to /api/users/, it will call registerUser
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/stats', protect, getUserStats);
module.exports = router;