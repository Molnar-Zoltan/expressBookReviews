const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    let { username, password } = req.body;
    username = username?.toLowerCase();

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
        

    if (isValid(username)) {
        return res.status(409).json({ message: "This username already exists" });
    }
 

    users.push({username, password});
    return res.status(201).json({message: `User ${username} successfully created`});
});

// Get the book list available in the shop
// Task 1 Code
// public_users.get('/', function (req, res) {
//     res.send(JSON.stringify(books, null, 4));
// });

// Task 10 - Promise version
public_users.get('/', function (req, res) {

    const getBooks = () => {
        return new Promise((resolve, reject) => {
            books ? resolve(books) : reject("No books found");   
        });
    };

    getBooks()
        .then(allBooks => res.send(JSON.stringify(allBooks, null, 4)))
        .catch(error => res.status(500).json({ message: error }));
});


// Get book details based on ISBN (Task 2)
// public_users.get('/isbn/:isbn', function (req, res) {
  
//     let isbn = req.params.isbn;
//     let book = books[isbn];

//     book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" });

//  });

// Task 11 - Promise version
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            book ? resolve(book) : reject("Book not found");
        });
    };

    getBookByISBN(isbn)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ message: error }));
});


  
// Get book details based on author
// Task 3
// public_users.get('/author/:author', function (req, res) {
    
//     let booksByAuthor = Object.fromEntries(
//         Object.entries(books).filter(([key, book]) => 
//             book.author.toLowerCase()
//             .startsWith(req.params.author.toLowerCase()))
//     );
    
//     Object.keys(booksByAuthor).length > 0
//         ? res.status(200).json(booksByAuthor) 
//         : res.status(404).json({ message: "Book not found" });
// });

  
// Task 12 - Promise version
public_users.get('/author/:author', (req, res) => {
    
    const author = req.params.author;

    const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            let booksByAuthor = Object.fromEntries(
                Object.entries(books).filter(([key, book]) => 
                    book.author.toLowerCase()
                    .startsWith(author.toLowerCase()))
            );
            
            Object.keys(booksByAuthor).length > 0
                ? resolve(booksByAuthor) 
                : reject("Book not found");
        });
    }

    getBooksByAuthor(author)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ message: error }));
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
