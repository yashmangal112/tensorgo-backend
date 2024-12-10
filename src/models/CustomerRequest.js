const mongoose = require("mongoose");

const customerRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  comments: { type: String, required: true },
});

module.exports = mongoose.model("CustomerRequest", customerRequestSchema);
