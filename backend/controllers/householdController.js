const Household = require('../models/Household');
const User = require('../models/User');
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const createHousehold = async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.user;

        if (user.household) {
            return res.status(400).json({ message: 'User is already in a household' });
        }

        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const household = await Household.create({
            name,
            admin: user._id,
            members: [user._id],
            inviteCode,
        });

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { household: household._id },
            { new: true }
        ).populate('household');

        res.status(201).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const joinHousehold = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const user = req.user;

        if (user.household) {
            return res.status(400).json({ message: 'User is already in a household' });
        }

        const household = await Household.findOne({ inviteCode });
        if (!household) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        household.members.push(user._id);
        await household.save();

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { household: household._id },
            { new: true }
        ).populate('household');

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const householdId = req.user.household;

        if (!householdId) {
            return res.status(200).json([]);
        }

        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const leaderboard = await Assignment.aggregate([
            // Stage 1: Filter documents
            {
                $match: {
                    household: new mongoose.Types.ObjectId(householdId),
                    isComplete: true,
                    updatedAt: { $gte: firstDay, $lte: lastDay },
                },
            },
            // Stage 2: Join with 'chores' collection
            {
                $lookup: {
                    from: 'chores',
                    localField: 'chore',
                    foreignField: '_id',
                    as: 'choreDetails',
                },
            },
            // Stage 3: Deconstruct the choreDetails array
            { $unwind: '$choreDetails' },
            // Stage 4: Group by user and sum their points
            {
                $group: {
                    _id: '$assignedTo',
                    totalPoints: { $sum: '$choreDetails.points' },
                },
            },
            // Stage 5: Join with 'users' collection
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            // Stage 6: Deconstruct the userDetails array
            { $unwind: '$userDetails' },
            // Stage 7: Format the final output
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    totalPoints: 1,
                },
            },
            // Stage 8: Sort by points descending
            { $sort: { totalPoints: -1 } },
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createHousehold, joinHousehold, getLeaderboard };