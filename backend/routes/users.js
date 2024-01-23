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
router.post("/profile", isAuthenticated, async (req, res) => {
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
    ifEdited ? res.status(200).send("Edited") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych wszystkich użytkowników
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Utworzenie nowego użytkownika przez administratora
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doc = {
      username,
      email,
      password: hashedPassword,
      registrationDate: Date.now(),
    };
    if (login == "admin") doc.admin = true;
    const ifCreated = await User.create(doc);
    ifCreated ? res.sendStatus(201) : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych użytkownika o podanym userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) res.status(200).json(user);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Zastąpienie danych użytkownika o podanym userId nowym „kompletem”
router.put("/:userId", async (req, res) => {
  try {
    const oldUser = await User.findById(req.params.userId);
    if (oldUser) {
      const { login, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const updated = {
        login,
        email,
        password: hashedPassword,
        registrationDate: oldUser.registrationDate,
        admin: oldUser.admin,
      };
      const ifEdited = await User.replaceOne(
        { _id: req.params.userId },
        updated
      );
      ifEdited ? res.status(200).send("Edited") : res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Usuniecie użytkownika o podanym userId
router.delete("/:userId", async (req, res) => {
  try {
    const ifDeleted = await User.deleteOne({
      _id: req.params.userId,
    });
    ifDeleted.deletedCount === 1
      ? res.status(200).send("Deleted")
      : res.sendStatus(204);
  } catch (e) {
    res.status(503).json(e);
  }
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch("/:userId", async (req, res) => {
  try {
    const { login, email, password } = req.body;
    const updated = {};
    if (login) {
      updated.login = login;
    }
    if (email) {
      updated.email = email;
    }
    if (password) {
      updated.password = await bcrypt.hash(password, 10);
    }

    const ifEdited = await User.updateOne({ _id: req.params.userId }, updated);
    ifEdited ? res.status(200).send("Edited") : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

module.exports = router;
