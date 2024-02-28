const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
const upload = multer();
const User = require("../models/User");
const { imagekit } = require("../imageKit-config");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const saveProfilePicture = (pic) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: pic.buffer,
        fileName: pic.originalname,
        useUniqueFileName: false,
      },
      function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result.url);
        }
      }
    );
  });
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
      profilePicture: "",
      follows: [],
      lastPostsRefresh: new Date(0),
    };
    const ifExist = await User.findOne({ email: email });
    if (ifExist) {
      res.status(200).send("Email is already taken!");
    } else {
      const ifCreated = await User.create(doc);
      ifCreated ? res.status(201).send("User created!") : res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Login użytkownika
router.post("/login", passport.authenticate("local"), (req, res) => {
  const { password, lastPostsRefresh, ...values } = req.user._doc;
  res.status(200).json({ user: values });
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
  const { password, lastPostsRefresh, ...values } = req.user._doc;
  res.status(200).json({ user: values });
});

// Pobranie danych obserwowanych zalogowanego uzytkownika
router.get("/profile/follows", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find(
      {
        _id: { $in: req.user.follows },
      },
      "username profilePicture email"
    );
    res.status(200).json(users);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Zmiana danych zalogowanego użytkownika
router.put(
  "/profile",
  isAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { name, surname, phoneNumber } = req.body;
      const updated = {};
      if (req.file) {
        updated.profilePicture = await saveProfilePicture(req.file);
      }
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
  }
);

// Zmiana lastPostsRefresh zalogowanego użytkownika
router.put("/profile/posts-refresh", isAuthenticated, async (req, res) => {
  try {
    const date = new Date();
    const ifEdited = await User.updateOne(
      { _id: req.user.id },
      { lastPostsRefresh: date }
    );
    ifEdited ? res.status(200).send("Saved new values") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Dodanie nowe obserwowanego userId zalogowanego użytkownika
router.put("/profile/add-follow", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    const ifEdited = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { follows: userId } },
      { new: true }
    );
    ifEdited ? res.status(200).send("Saved new values") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Usunięcię obserwowanego userId zalogowanego użytkownika
router.put("/profile/delete-follow", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    const ifEdited = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { follows: userId } },
      { new: true }
    );
    ifEdited ? res.status(200).send("Saved new values") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie użytkowników o username zaczynającym się na
router.get("/search", isAuthenticated, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find(
      {
        username: { $regex: `^${query}`, $options: "i" },
      },
      "username profilePicture email"
    );
    res.status(200).json(users);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych użytkownika o podanym userId
router.get("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const toDisplay = {};
    toDisplay.username = user.username;
    if (user.name != "") {
      toDisplay.name = user.name;
    }
    if (user.profilePicture != "") {
      toDisplay.profilePicture = user.profilePicture;
    }
    if (user.surname != "") {
      toDisplay.surname = user.surname;
    }
    if (user.phoneNumber != "") {
      toDisplay.phoneNumber = user.phoneNumber;
    }
    res.status(200).json({ user: toDisplay });
  } catch (e) {
    res.status(503).json(e);
  }
});

module.exports = router;
