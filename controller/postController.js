const Comment = require('../model/Comment');
const Post = require('../model/Post');

exports.createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const image = req.file ? req.file.filename : null;

    const post = await Post.create({
      title,
      body,
      tags,
      image,
      author: req.user.userId
    });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email image");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

   
    if (String(post.author) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, body, tags } = req.body;
    if (req.file) post.image = req.file.filename;
    if (title) post.title = title;
    if (body) post.body = body;
    if (tags) post.tags = tags;

    await post.save();
    res.status(200).json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ postId: req.params.id })
      .populate("userId", "username");

    res.status(200).json({ post, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.addLike = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
   
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
     
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: hasLiked ? "Post unliked" : "Post liked",
      totalLikes: post.likes.length
    });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username email image");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch user posts", details: err.message });
  }
};

