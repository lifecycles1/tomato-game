const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Create and send a JWT token upon successful login
        const token = jwt.sign({ id: user._id, email: user.email }, "secretKey", {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res.status(200).send("email or password are incorrect");
      }
    } else {
      res.status(200).send("email or password are incorrect");
    }
  } catch (error) {
    console.error("error signing in", error);
    res.status(500).send("error signing in");
  }
}

async function signup(req, res) {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(200).send("email already exists");
    } else {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
      const newUser = new User({ email: email, password: hashedPassword });
      await newUser.save();

      // Generate a JWT token for the newly created user
      const token = jwt.sign({ id: newUser._id, email: newUser.email }, "secretKey", {
        expiresIn: "1h",
      });

      res.status(201).json({ token });
    }
  } catch (error) {
    console.log("error signing up", error);
    res.status(500).send("error signing up");
  }
}

module.exports = { signin, signup };
