const Chore = require('../models/Chore');
const Household = require('../models/Household');

const createChore = async (req, res) => {
    try {
        const { name, description, points } = req.body;
        const user = req.user;

        const household = await Household.findById(user.household);

        // --- AUTHORIZATION CHECK ---
        // Check if the logged-in user is the admin of this household
        if (household.admin.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add chores' }); // 403 means Forbidden
        }

        const chore = await Chore.create({
            name,
            description,
            points,
            household: user.household,
        });

        res.status(201).json(chore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getHouseholdChores = async (req, res) => {
    try {
        const chores = await Chore.find({ household: req.user.household });
        res.status(200).json(chores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateChore = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        // Check if the chore belongs to the user's household
        if (chore.household.toString() !== req.user.household.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const household = await Household.findById(req.user.household);

        // Check if the user is the admin
        if (household.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User must be an admin to update chores' });
        }

        const updatedChore = await Chore.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // This option returns the modified document
        });

        res.status(200).json(updatedChore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteChore = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        // Authorization checks (same as update)
        if (chore.household.toString() !== req.user.household.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const household = await Household.findById(req.user.household);
        if (household.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User must be an admin to delete chores' });
        }

        await Chore.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Chore removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add the new functions to your exports
module.exports = { createChore, getHouseholdChores, updateChore, deleteChore };