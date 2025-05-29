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

    const token = jwt.sign(
        { username },
        "secretkey",
        { expiresIn: '1h' }
    );

  //Write your code here
    return res.status(200).json({
        message: `You successfully logged in. Welcome ${username}`,
        token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
