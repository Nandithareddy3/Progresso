const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Household = require('./Household');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
    },
    // --------------------
}, {
    timestamps: true,
});
//password hashing 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;