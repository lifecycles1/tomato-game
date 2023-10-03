const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        res.status(200).send(user);
      } else {
        res.status(200).send("email or password are incorrect");
      }
    } else {
      res.status(200).send("email or password are incorrect");
    }
  } catch (error) {
    console.log("error signing in", error);
    res.status(500).send("error signing in");
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(200).send("email already exists");
    } else {
      const newUser = new User({
        email: email,
        password: password,
      });
      await newUser.save();
      res.status(201).send("account created");
    }
  } catch (error) {
    console.log("error signing up", error);
    res.status(500).send("error signing up");
  }
});

module.exports = router;
