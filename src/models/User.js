const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String }, // Optional field for the profile picture
});

module.exports = mongoose.model("User", userSchema);
