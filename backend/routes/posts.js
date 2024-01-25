const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../models/Post");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Dodanie posta przez zalogowanego użytkownika
router.post("/addPost", isAuthenticated, async (req, res) => {
  try {
    const { postContent } = req.body;
    const doc = {
      content: postContent,
      author: req.user.id,
      creationDate: Date.now(),
      parentPost: null,
      quotedPost: null,
    };
    const ifCreated = await Post.create(doc);
    ifCreated
      ? res.status(201).json({ savedPost: ifCreated })
      : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie postów o autorze = userId
router.get("/:userId", async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.params.userId });
    userPosts ? res.status(200).json({ userPosts }) : res.sendStatus(500);
  } catch (e) {
    res.status(503).json(e);
  }
});
module.exports = router;
