const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:    { type: String },
  role:     { type: String, enum: ['ADMIN', 'EDITOR'], default: 'EDITOR' }
});

module.exports = mongoose.model("User", userSchema);
