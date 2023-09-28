const express = require("express");
const router = express.Router();
const Score = require("../models/score");

router.post("/score", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { email, score } = req.body;
    console.log("score", score);
    // Check if a document with the given email already exists
    const existingScore = await Score.findOne({ email: email });
    if (existingScore && existingScore.score < score) {
      //update the score
      existingScore.score = score;
      await existingScore.save();
      res.status(200).send("Score updated");
    } else if (!existingScore) {
      //create a new score document
      const newScore = new Score({
        email: email,
        score: score,
      });
      await newScore.save();
      res.status(201).send("Score created");
    }
  } catch (error) {
    console.log("error updating score", error);
    res.status(500).send("error updating score");
  }
});

module.exports = router;
