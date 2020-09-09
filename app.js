let mongoose = require("mongoose");
let express = require("express");
let bodyParser = require("body-parser");
let ejs = require("ejs");

let Author = require("./models/authors");
let Book = require("./models/books");
const e = require("express");

let app = express();

let DB_URL = "mongodb://localhost:27017/week6labdb";

let print = console.log;


app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: false
}));

mongoose.connect(DB_URL, function (err) {
    if (!err) {
        print("Connect to DB Successfully");
    }
    else {
        print(err);
    }
})
//express.static will serve the first one 
app.use(express.static("public/css"));
app.use(express.static("public/img"));

//Endpoints
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
})

//Author Endpoints
app.get("/addAuthor", function (req, res) {
    res.sendFile(__dirname + "/views/addAuthor.html");
});

app.post("/addAuthorPost", function (req, res) {
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        dob: req.body.dob,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: parseInt(req.body.unit)
        },
        numBooks: parseInt(req.body.numBooks)
    })
    author.save(function (err) {
        if (err) {
            res.redirect("/addAuthor");
        }
        else {
            print("Saved Added Author Successfully");
            res.redirect("/getAuthor");
        }
    })
})
app.get("/getAuthor", function (req, res) {
    print("masuk sini");
    Author.find({}, function (err, author) {
        res.render("getAuthor.html", { au: author });
    })
})


//Books Endpoint
app.get("/addBook", function (req, res) {
    res.sendFile(__dirname + "/views/addBook.html");
});
app.post("/addBookPost", function (req, res) {
    let book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.authorId,
        isbn: req.body.isbn,
        // dop:req.body.dop,
        summary: req.body.summary
    });
    book.save(function (err) {
        if (err) {
            res.redirect("/addBook");
        }
        else {
            print("A book Sucessfully Saved");
            res.redirect("/getBook");
        }
    })
})
app.get("/getBook", function (req, res) {
    Book.find({}).populate('author').exec(function (err, book) {
        res.render("getBook.html", { bo: book });
    })
})


//Delete Books Endpoint
app.get("/deleteBook", function (req, res) {
    res.sendFile(__dirname + "/views/deleteBook.html");
})
app.post("/deleteBookPost", function (req, res) {
    Book.deleteOne({ "isbn": req.body.isbn }, function (err, doc) {
        if (!err && doc.n != 0) {
            print("Delete Book Success");
            res.redirect("/getBook");
        }
        else {
            res.redirect("/deleteBook");
        }
    })
})

//Update Author Endpoint
app.get("/updateAuthor", function (req, res) {
    res.sendFile(__dirname + "/views/updateAuthor.html");
})
app.post("/updateAuthorPost", function (req, res) {
    let opts = { runValidators: true };
    Author.updateOne({ "_id": req.body._id }, { "numBooks": req.body.numBooks }, opts, function (err) {
        if (!err) {
            print("Success Update Author");
            res.redirect("/getAuthor");
        }
        else{
            res.redirect("/updateAuthor");
        }
    })
})


app.listen(8080);