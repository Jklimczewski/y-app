const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Rejerstracja nowego użytkownika
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doc = {
      username,
      email,
      password: hashedPassword,
      name: "",
      surname: "",
      phoneNumber: "",
    };
    const ifExist = await User.findOne({ email: email });
    if (ifExist) {
      res.status(200).send("Email is already taken!");
    } else {
      const ifCreated = await User.create(doc);
      console.log(ifCreated);
      ifCreated ? res.status(201).send("User created!") : res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Login użytkownika
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ user: req.user });
});

// Logout użytkownika
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

// Pobranie danych zalogowanego użytkownika
router.get("/profile", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Zmiana danych zalogowanego użytkownika
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const { name, surname, phoneNumber } = req.body;
    const updated = {};
    if (name != req.user.name) {
      updated.name = name;
    }
    if (surname != req.user.surname) {
      updated.surname = surname;
    }
    if (phoneNumber != req.user.phoneNumber) {
      updated.phoneNumber = phoneNumber;
    }
    const ifEdited = await User.updateOne({ _id: req.user.id }, updated);
    ifEdited ? res.status(200).send("Saved new values") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych użytkownika o podanym userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const toDisplay = {};
    toDisplay.username = user.username;
    if (user.name != "") {
      toDisplay.name = user.name;
    }
    if (user.surname != "") {
      toDisplay.surname = user.surname;
    }
    if (user.phoneNumber != "") {
      toDisplay.phoneNumber = user.phoneNumber;
    }
    if (user) res.status(200).json({ user: toDisplay });
  } catch (e) {
    res.status(503).json(e);
  }
});

module.exports = router;
