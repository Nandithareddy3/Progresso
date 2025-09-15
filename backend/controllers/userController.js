

const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
//for login
const bcrypt = require('bcryptjs')
const Assignment = require('../models/Assignment');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create a new user (password will be hashed automatically by our model)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 3. If user was created, send back user data and a token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //already exist?
        const user = await User.findOne({ email });
        // if user already exists compare password with hash password in the DB
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // 401 means Unauthorized
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const getUserProfile = (req, res) => {
    // The user object is attached to the request in the `protect` middleware
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
// @desc    Get user's all-time stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    try {
        const stats = await Assignment.aggregate([
            // 1. Find all completed assignments for this user
            {
                $match: {
                    assignedTo: req.user._id,
                    isComplete: true,
                },
            },
            // 2. Get the points for each chore
            {
                $lookup: {
                    from: 'chores',
                    localField: 'chore',
                    foreignField: '_id',
                    as: 'choreDetails',
                },
            },
            { $unwind: '$choreDetails' },
            // 3. Group everything into one result to calculate totals
            {
                $group: {
                    _id: null, // Group all documents together
                    totalPoints: { $sum: '$choreDetails.points' },
                    tasksCompleted: { $sum: 1 }, // Count each document
                },
            },
        ]);

        if (stats.length > 0) {
            res.json(stats[0]); // Send the first (and only) result
        } else {
            // If user has no stats, send back default values
            res.json({ totalPoints: 0, tasksCompleted: 0 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add the new function to your exports
module.exports = { registerUser, loginUser, getUserProfile, getUserStats };
