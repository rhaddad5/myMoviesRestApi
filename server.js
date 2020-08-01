const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const movieController = require("./Controllers/movieController");
const userController = require("./Controllers/userController");
require("dotenv").config();

const app = express();
app.use(cors({origin: true, credentials: true}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(body());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/movies", {useNewUrlParser: true});

const mongoUser = process.env.MLAB_USER;
const mongoAccount = process.env.MLAB_ACCOUNT;
const mongoPassword = process.env.MLAB_PASSWORD;

const uri = `mongodb://${mongoUser}:${mongoPassword}@ds223015.mlab.com:23015/${mongoAccount}`;
mongoose.connect(uri, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uri + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uri);
      }
    });

app.post("/movies", userController.authenticateUser, movieController.createMovie);

app.get("/movies", userController.authenticateUser, movieController.getMovies);

app.get("/movies/:id", movieController.getMovie);

app.delete("/movies/:id", movieController.destroyMovie);

app.delete("/movies", movieController.destroyMovies);

app.patch("/movies/:id", movieController.updateMovie);

app.post("/users/signup", userController.signup);

app.post("/users/login", userController.login);

app.get("/users", userController.getUsers);

app.delete("/users", userController.destroyUsers);

const PORT = process.env.PORT || "8000";
app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
