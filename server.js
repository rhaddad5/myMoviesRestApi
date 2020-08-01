const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const movieController = require("./Controllers/movieController");
const userController = require("./Controllers/userController");

const app = express();
app.use(cors({origin: true, credentials: true}));
app.use(body());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/movies", {useNewUrlParser: true});

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
