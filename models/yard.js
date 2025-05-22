const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = new Schema({
    comment: {
        type: String,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

const yardSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Planting', 'Replacing', 'Trimming']
    },
    trees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tree'
        }
    ],
    favoritedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [textSchema]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Yard', yardSchema);