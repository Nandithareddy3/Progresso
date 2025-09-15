

const express = require('express');
const router = express.Router();
const {
    createChore,
    getHouseholdChores,
    updateChore,
    deleteChore
} = require('../controllers/choreController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').post(protect, createChore).get(protect, getHouseholdChores);
router.route('/:id')
    .put(protect, updateChore)
    .delete(protect, deleteChore);
module.exports = router;