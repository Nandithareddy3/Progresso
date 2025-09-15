const mongoose = require('mongoose')
const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    inviteCode: {
        type: String,
        unique: true,
    },
},
    {
        timestamps: true,
    });
const Household = mongoose.model('Household', householdSchema);
module.exports = Household;