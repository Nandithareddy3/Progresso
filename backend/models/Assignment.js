
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {
        chore: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Chore',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        household: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Household',
        },
        dueDate: {
            type: Date,
            required: true,
        },
        isComplete: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;