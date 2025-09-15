const Assignment = require('../models/Assignment');
const Household = require('../models/Household');
const Chore = require('../models/Chore');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Admin only)
// In backend/controllers/assignmentController.js

const createAssignment = async (req, res) => {
    try {
        const { choreId, assignedToUserId, dueDate } = req.body;
        const adminUser = req.user;
        // We already get the full household object from the middleware
        const household = adminUser.household;

        if (!household) {
            return res.status(400).json({ message: 'Admin is not in a household' });
        }

        if (household.admin.toString() !== adminUser._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to assign chores' });
        }

        const chore = await Chore.findById(choreId);
        if (!chore || chore.household.toString() !== household._id.toString()) {
            return res.status(404).json({ message: 'Chore not found in this household' });
        }

        if (!household.members.some(member => member._id.toString() === assignedToUserId)) {
            return res.status(400).json({ message: 'User is not a member of this household' });
        }

        const assignment = await Assignment.create({
            chore: choreId,
            assignedTo: assignedToUserId,
            dueDate,
            household: household._id,
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get assignments for the logged-in user
// @route   GET /api/assignments/my
// @access  Private
const getMyAssignments = async (req, res) => {
    try {
        if (!req.user.household) {
            return res.status(200).json([]);
        }
        const assignments = await Assignment.find({ assignedTo: req.user._id })
            .populate('chore', 'name points');

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all active assignments for a household
// @route   GET /api/assignments/household
// @access  Private
// In backend/controllers/assignmentController.js

const getHouseholdAssignments = async (req, res) => {
    try {
        if (!req.user.household) {
            return res.status(200).json([]);
        }

        // --- ADD THESE DEBUG LOGS ---
        const householdIdToFind = req.user.household._id;
        console.log("--- DEBUG START: getHouseholdAssignments ---");
        console.log("Searching for assignments with household ID:", householdIdToFind);
        // --------------------------

        const assignments = await Assignment.find({
            household: householdIdToFind,
            isComplete: false
        })
            .populate('chore', 'name points')
            .populate('assignedTo', 'name');

        // --- ADD THIS DEBUG LOG ---
        console.log("Query finished. Found assignments:", assignments.length);
        console.log(assignments); // Log the actual results
        console.log("--- DEBUG END ---");
        // ------------------------

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an assignment status
// @route   PUT /api/assignments/:id
// @access  Private
const updateAssignmentStatus = async (req, res) => {
    try {
        const { isComplete } = req.body;
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        const household = req.user.household;

        const isAdmin = household.admin.toString() === req.user._id.toString();
        const isAssignee = assignment.assignedTo.toString() === req.user._id.toString();

        if (!isAdmin && !isAssignee) {
            return res.status(403).json({ message: 'Not authorized to update this assignment' });
        }

        assignment.isComplete = isComplete;
        const updatedAssignment = await assignment.save();
        res.status(200).json(updatedAssignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// In backend/controllers/assignmentController.js

// ... (your existing functions)

// @desc    Get a user's completed chore history
// @route   GET /api/assignments/history
// @access  Private
const getAssignmentHistory = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            assignedTo: req.user._id,
            isComplete: true
        })
            .sort({ updatedAt: -1 }) // Show most recent first
            .populate('chore', 'name points');

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add the new function to your exports
module.exports = {
    createAssignment,
    getMyAssignments,
    updateAssignmentStatus,
    getHouseholdAssignments,
    getAssignmentHistory
};