const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const score = mongoose.model("score", scoreSchema);

module.exports = score;
