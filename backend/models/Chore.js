const mongoose = require('mongoose');
const choreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    points: {
        type: Number,
        required: true,
        min: 0,
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Household', // Links this chore to a specific household
    },
},
    {
        timestamps: true,
    }
);

const Chore = mongoose.model('Chore', choreSchema);

module.exports = Chore;
