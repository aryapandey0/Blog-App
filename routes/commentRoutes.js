const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Comment = require('../model/Comment');
const router = express.Router();


router.post("/:id", protect, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  const { content } = req.body;

  try {
    const comment = await Comment.create({
      postId,
      userId,
      content
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await Comment.find({ postId }).populate("userId", "username");
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments", error: err.message });
  }
});

module.exports = router;
