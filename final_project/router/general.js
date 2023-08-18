const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required!" });
  }
  const userExisted = users.find((user) => user.username === username);
  if (userExisted) {
    return res.status(409).json({ message: "username is already existed" });
  }
  users.push({ username: username, password: password });
  return res
    .status(300)
    .json({ message: `${username} successfully registerd. Now you can login` });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let asyncBooks = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
  return res.send(JSON.stringify({ books: asyncBooks }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  let asyncBooks = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
  res.send(JSON.stringify(asyncBooks[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author.toLowerCase();
  let asyncBooks = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
  let authorBooks = [];
  for (let key in asyncBooks) {
    if (asyncBooks[key].author.toLowerCase() === author) {
      authorBooks.push(asyncBooks[key]);
    }
  }
  res.send(JSON.stringify({ booksbyauthor: authorBooks }, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();
  let asyncBooks = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
  let titleBooks = [];
  for (let key in asyncBooks) {
    if (asyncBooks[key].title.toLowerCase() === title) {
      titleBooks.push(asyncBooks[key]);
    }
  }
  res.send(JSON.stringify({ booksbytitle: titleBooks }, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const reviews = books[isbn].reviews;
  res.send(JSON.stringify(reviews, null, 4));
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
