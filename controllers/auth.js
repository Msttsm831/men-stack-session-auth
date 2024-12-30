const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});
router.post("/sign-up", async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const username = req.body.username;
  //Check if the password and confirm password match

  if (password !== confirmPassword) {
    return res.send("Passwords do not match.");
  }
  //see if the user already exists in the database
  const userInDatabase = await User.findOne({ username });
  if (userInDatabase) {
    return res.send("Username or Password is invalid.");
  }
  //Create a new registration
  
  // 1) encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 2) replace the raw password with the encrypted password
  req.body.password = hashedPassword;

  // 3) save the user to the database
  const newUser = await User.create(req.body);

  // validation logic
  res.send(newUser.username);
  
});


module.exports = router;