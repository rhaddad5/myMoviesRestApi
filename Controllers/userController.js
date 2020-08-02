require("dotenv").config();

const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  await res.json(users);
};

exports.destroyUsers = async (req, res) => {
  const destroyed = await User.deleteMany();
  res.json(destroyed);
};

exports.signup = async (req, res, next) => {
  const salt = 10;
  const username = req.body.username;
  const email = req.body.email;
  const imageUrl = req.body.imageUrl;
  let password = req.body.password;
  const existingUser = await User.findOne({email: email})
  bcrypt.hash(password, salt, (err, encrypted) => {
    if(err) {
      console.log("erreur cryptage", err);
    } else {
      password = encrypted;
      if(!email || !password || !username) {
        console.log("Field missing");
        res.status(404).send("Please complete all the fields");
        return;
      };
      if(existingUser) {
        console.log("Email address already used")
        res.status(401).send("Email already used")
        return;
      };
      const newUser = new User({
        username: username,
        email: email,
        password: password,
        imageUrl: imageUrl,
      });
      newUser.save();
      console.log(newUser);
      res.status(200).json(newUser);
      return;
    }
  });
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({email: email});
  if(user) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        const username = user.username;
        const imageUrl = user.imageUrl;
        const user2 = {email: email, username: username};
        const accessToken = jwt.sign(user2, process.env.ACCES_TOKEN_SECRET);
        const refreshToken = jwt.sign(user2, process.env.REFRESH_TOKEN_SECRET)
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, imageUrl: imageUrl, username: username})
      } else {
        res.status(401).send("Wrong password");
      };
    });
  } else {
    res.status(401).send("Email not found");
  };
};

exports.authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(token === null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
