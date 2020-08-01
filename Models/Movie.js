const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: String,
  releaseDate: String,
  tmdbId: Number,
  user: String,
  overview: String,
  imagePath: String
});

module.exports = mongoose.model("movie", schema);
