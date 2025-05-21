const mongoose = require('mongoose');
const Schema = mongoose.Schema;



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
   favoritedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
   }

}, {
    timestamps: true,
});


module.exports = mongoose.model('Yard', yardSchema);