const mongoose = require("mongoose");

const schema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  imageUrl: String,
});

module.exports = mongoose.model("user", schema);
