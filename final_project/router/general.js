const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios').default;

const url = "https://jpheulpin-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"

function doesExit(username) {
    let usersWithSameName = users.filter((user) => user.username == username);
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(doesExit(username)) {
            return res.status(404).json({message : "User already exists"})
        } else {
            users.push({"username" : username, "password" : password});
            return res.status(200).json({message : "User successfully registered"})
        }
    } else {
        return res.status(404).json({message : "Missing username or password"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return res.send(books[req.params.isbn])
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    booksByAuthor = [];
    Object.values(books).forEach(book => {
        if(book.author == req.params.author) {
            booksByAuthor.push(book);
        }
    });
    return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    booksByTitle = [];
    Object.values(books).forEach(book => {
        if(book.title == req.params.title) {
            booksByTitle.push(book);
        }
    });
    return res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.send(books[req.params.isbn].reviews)
});

async function BookFromISBN(ISBN) {
    axios.get(url + `/isbn/${ISBN}`)
    .then(function (response) {
        console.log(response.data);
     })
    .catch(function (error) {
        console.log(error);
    });
}

async function BookFromAuthor(author) {
    axios.get(url + `/author/${author}`)
    .then(function (response) {
        console.log(response.data);
     })
    .catch(function (error) {
        console.log(error);
    });
}

async function BookFromTitle(title) {
    axios.get(url + `/title/${title}`)
    .then(function (response) {
        console.log(response.data);
     })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports.general = public_users;
