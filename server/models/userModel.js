const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email address"],
  },
  score: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
