const express = require('express');
const router = express.Router();
// Add getHouseholdAssignments to the import
const {
    createAssignment,
    getMyAssignments,
    updateAssignmentStatus,
    getHouseholdAssignments,
    getAssignmentHistory
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a new assignment
router.route('/').post(protect, createAssignment);

// Route to get assignments for the logged-in user
router.route('/my').get(protect, getMyAssignments);

// NEW: Route to get all active assignments for the household
router.route('/household').get(protect, getHouseholdAssignments);

// Route to update a specific assignment
router.route('/:id').put(protect, updateAssignmentStatus);
router.route('/history').get(protect, getAssignmentHistory);
module.exports = router;