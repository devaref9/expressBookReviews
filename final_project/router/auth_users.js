const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userExisted = users.find((user) => user.username === username);
  if (!userExisted) return false;
  return true;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "all inputs are required" });
  if (!isValid(username)) {
    return res.status(400).json({ message: "username is not valid!" });
  }
  const currentUser = users.find((user) => user.username === username);
  if (currentUser.password !== password) {
    return res.status(400).json({ message: "username or password are wrong!" });
  }

  const accessToken = jwt.sign({ data: currentUser.password }, "access", {
    expiresIn: 60 * 60,
  });
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).send(`${username} successfully logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const post = req.params.review;
  const username = req.session.authorization.username;

  let reviews = books[isbn].reviews;
  for (let key in reviews) {
    if (key === username) {
      delete reviews[key];
    }
  }
  reviews[username] = post;
  books[isbn].reviews = { ...reviews };

  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been added/updated`,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  let reviews = books[isbn].reviews;
  for (let key in reviews) {
    if (key === username) {
      delete reviews[key];
    }
  }

  return res
    .status(200)
    .json({
      message: `Reviews for the ISBN ${isbn} posted by the ${username} deleted`,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
