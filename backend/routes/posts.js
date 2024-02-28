const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

function destructureAuthor(post, authorData) {
  return {
    ...post.toObject(),
    username: authorData.username,
    profilePicture: authorData.profilePicture,
  };
}

async function destructureComments(comments) {
  const updatedComments = [];

  for (const comment of comments) {
    const authorData = await User.findById(comment.author);
    if (authorData) {
      const updatedComment = {
        ...comment.toObject(),
        username: authorData.username,
        profilePicture: authorData.profilePicture,
      };
      updatedComments.push(updatedComment);
    }
  }

  return updatedComments;
}

// Dodanie posta przez zalogowanego użytkownika
router.post("/add-post", isAuthenticated, async (req, res) => {
  try {
    const { postContent } = req.body;
    const doc = {
      content: postContent,
      author: req.user.id,
      parentPost: null,
      quotedPost: null,
    };
    const ifCreated = await Post.create(doc);
    req.io.emit(`postAdded`, { message: `${req.user.id}` });
    const authorData = await User.findById(ifCreated.author);
    if (ifCreated && authorData) {
      const updatedPost = destructureAuthor(ifCreated, authorData);
      res.status(201).json({ savedPost: updatedPost });
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Dodanie komentarza przez zalogowanego użytkownika
router.post("/add-comment", isAuthenticated, async (req, res) => {
  try {
    const { parentId, commentContent } = req.body;
    const doc = {
      content: commentContent,
      author: req.user.id,
      parentPost: parentId,
      quotedPost: null,
    };
    const ifCreated = await Post.create(doc);
    req.io.emit(`postAdded`, { message: `${req.user.id}` });
    const authorData = await User.findById(ifCreated.author);
    if (ifCreated && authorData) {
      const updatedPost = destructureAuthor(ifCreated, authorData);
      res.status(201).json({ savedComment: updatedPost });
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Dodanie cytatu przez zalogowanego użytkownika
router.post("/add-quote", isAuthenticated, async (req, res) => {
  try {
    const { quoteId, quoteContent } = req.body;
    const doc = {
      content: quoteContent,
      author: req.user.id,
      parentPost: null,
      quotedPost: quoteId,
    };
    const ifCreated = await Post.create(doc);
    req.io.emit(`postAdded`, { message: `${req.user.id}` });
    const authorData = await User.findById(ifCreated.author);
    if (ifCreated && authorData) {
      const updatedPost = destructureAuthor(ifCreated, authorData);
      res.status(201).json({ savedQuote: updatedPost });
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie postów obserwowanych osób z ostatnich 24h
router.get("/follows", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const skip = (page - 1) * pageSize;

  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

    const postsFromFollowedUsers = await Post.find({
      author: { $in: req.user.follows },
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (postsFromFollowedUsers) {
      const updatedPosts = await destructureComments(postsFromFollowedUsers);
      res.status(200).json({ posts: updatedPosts });
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie postów, obserwowanych osób, których jeszcze nie widzieliśmy, z ostatnich 48h
router.get("/follows/new", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const recentlyAdded = parseInt(req.query.recentlyAdded) || 0;
  const skip = (page - 1) * pageSize + recentlyAdded;

  try {
    const lastRefresh = req.user.lastPostsRefresh;
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setDate(fortyEightHoursAgo.getDate() - 2);

    const postsFromFollowedUsers = await Post.find({
      author: { $in: req.user.follows },
      $and: [
        { createdAt: { $gte: lastRefresh } },
        { createdAt: { $gte: fortyEightHoursAgo } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (postsFromFollowedUsers) {
      const updatedPosts = await destructureComments(postsFromFollowedUsers);
      res.status(200).json({ posts: updatedPosts });
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie postów usera
router.get("/users/:userId", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const skip = (page - 1) * pageSize;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(404).json({ message: "User not found" });
    }
    const userPosts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (!userPosts) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedPosts = await destructureComments(userPosts);
    res.status(200).json({ userPosts: updatedPosts });
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie komentarzy posta o postId
router.get("/:postId/comments", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Post.find({ parentPost: req.params.postId }).sort({
      createdAt: -1,
    });
    if (!comments) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedComments = await destructureComments(comments);
    res.status(200).json({ comments: updatedComments });
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie cytatów posta o postId
router.get("/:postId/quotes", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).json({ message: "Post not found" });
    }
    const quotes = await Post.find({ quotedPost: req.params.postId }).sort({
      createdAt: -1,
    });
    if (!quotes) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedQuotes = await destructureComments(quotes);
    res.status(200).json({ quotes: updatedQuotes });
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych posta o postId
router.get("/:postId", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).json({ message: "Post not found" });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const authorData = await User.findById(post.author);
    if (post && authorData) {
      const updatedPost = destructureAuthor(post, authorData);
      res.status(200).json({ post: updatedPost });
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

module.exports = router;
