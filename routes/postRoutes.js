const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, addLike, getPostsByUser } = require('../controller/postController');
const { allowRoles, allowOwnerOrAdmin } = require('../middleware/roleMiddleware');
const Post = require('../model/Post');

router.post("/", protect,allowRoles(['ADMIN','EDITOR']), upload.single("image"), createPost);
router.get("/", protect,getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", protect,allowOwnerOrAdmin(Post), upload.single("image"), updatePost);
router.delete("/:id", protect,allowOwnerOrAdmin(Post), deletePost);
router.put("/like/:id", protect, addLike);
router.get("/user/:id",getPostsByUser);


module.exports = router;
