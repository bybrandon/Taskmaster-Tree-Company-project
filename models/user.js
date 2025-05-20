const mongoose = require("mongoose");
// shortcut variable
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
    trees: [{
        type: Schema.Types.ObjectId,
        ref: "Tree"
    }],
}, {
    timestamps: true,
});


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  yards: [yardSchema]
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
