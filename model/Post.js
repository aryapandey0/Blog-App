const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  image: { type: String }, // Optional blog image
  createdAt: { type: Date, default: Date.now },
 likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

});

module.exports = mongoose.model("Post", postSchema);
