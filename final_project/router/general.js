const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  
    let isbn = req.params.isbn;
    let book = books[isbn];

    book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" });

 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    
    let booksByAuthor = Object.fromEntries(
        Object.entries(books).filter(([key, book]) => 
            book.author.toLowerCase()
            .startsWith(req.params.author.toLowerCase()))
    );
    
    Object.keys(booksByAuthor).length > 0
        ? res.status(200).json(booksByAuthor) 
        : res.status(404).json({ message: "Book not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  
    let booksByTitle = Object.fromEntries(
        Object.entries(books).filter(([key, book]) => 
            book.title.toLowerCase()
            .startsWith(req.params.title.toLowerCase()))
    );

    Object.keys(booksByTitle).length > 0
        ? res.status(200).json(booksByTitle)
        : res.status(404).json({ message: "Book not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    let bookReviews = book.reviews;

    book ? res.status(200).json(bookReviews) : res.status(404).json({ message: "Book not found" });

});

module.exports.general = public_users;
