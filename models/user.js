const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

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
  yards: [{
    type: Schema.Types.ObjectId,
    ref: "Yard"
  }]
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
