const Movie = require("../Models/Movie");

exports.getMovies = async (req, res) => {
  const movies = await Movie.find();
  await res.json(movies.filter(movie => movie.user === req.user.username));
};

exports.getMovie = async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findOne({tmdbId: id});
  res.json(movie);
};

exports.createMovie = async (req, res) => {
  const title = req.body.title;
  const releaseDate = req.body.releaseDate;
  const tmdbId = req.body.tmdbId;
  const user = req.user.username;
  const overview = req.body.overview;
  const imagePath = req.body.imagePath;
  if(!title || !releaseDate || !tmdbId || !user || !overview || !imagePath) {
    res.send("Field missing");
    return;
  };
  const newMovie = new Movie({
    title: title,
    releaseDate: releaseDate,
    tmdbId: tmdbId,
    user: user,
    overview: overview,
    imagePath: imagePath
  });
  await newMovie.save();
  res.json(newMovie);
  return;
};

exports.destroyMovie = async (req, res) => {
  const id = req.params.id;
  const destroyed = await Movie.deleteOne({tmdbId: id});
  res.json(destroyed);
};

exports.destroyMovies = async (req, res) => {
  const destroyed = await Movie.deleteMany();
  res.json(destroyed);
};

exports.updateMovie = async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findOne({tmdbId: id});
  const title = req.body.title;
  const releaseDate = req.body.releaseDate;
  if(title) {
    movie.title = title;
  };
  if(releaseDate) {
    movie.releaseDate = releaseDate;
  };
  await movie.save();
  res.json(movie);
};
