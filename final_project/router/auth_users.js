const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 

    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    
    const user = users.find(u => u.username === username);

    return username === user.username && password === user.password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    let { username, password } = req.body;
    username = username?.toLowerCase();

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json( { message: "Invalid username or password" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json( { message: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
        { username, role: "user" },
        "secretkey",
        { expiresIn: '1h' }
    );

    req.session.authorization = {
        accessToken,
        username
    };


    return res.status(200).json({
        message: `You successfully logged in. Welcome ${username}`,
        accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    const book = books[isbn];
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "You need to add a review" });
    }

    book.reviews[username] = review;

    return res.status(200).json({ message: "Review successfully added", review });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
