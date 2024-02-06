const express = require("express");
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

// Pobranie postów obserwowanych osób z ostatnich 24h, których nie widzieliśmy
router.get("/follows/new", isAuthenticated, async (req, res) => {
  try {
    const lastRefresh = req.user.lastPostsRefresh;

    const postsFromFollowedUsers = await Post.find({
      author: { $in: req.user.follows },
      createdAt: {
        $gte: lastRefresh,
      },
    });
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
router.get("/users/:userId", async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.params.userId });
    if (userPosts) {
      const updatedPosts = await destructureComments(userPosts);
      res.status(200).json({ userPosts: updatedPosts });
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie komentarzy posta o postId
router.get("/:postId/comments", isAuthenticated, async (req, res) => {
  try {
    const comments = await Post.find({ parentPost: req.params.postId });
    if (comments) {
      const updatedComments = await destructureComments(comments);
      res.status(200).json({ comments: updatedComments });
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    res.status(503).json(e);
  }
});

// Pobranie danych posta o postId
router.get("/:postId", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
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
