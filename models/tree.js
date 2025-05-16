const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const treeSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});


module.exports = mongoose.model('Tree', treeSchema);