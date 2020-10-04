const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const serialiser = require("node-serialize");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
//const mongoURI = "mongodb://localhost:27017"+ "/blog"
const mongoURI =
  "mongodb+srv://rana:1234@cluster0.qobap.mongodb.net/<dbname>?retryWrites=true+srv://divyansh:fOcYFXJayQqc9797@cluster0.cua2y.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(mongoURI);

app.use(express.json());
const connection = mongodb.MongoClient.connect(mongoURI, (err, dbClient) => {
  if (err) {
    console.log("connection failed");
    return;
  }
});
console.log("***********************");

app.get("/", (req, res) => res.send("Hello World!"));

// your code goes here

// here
app.get("/allblog", (req, res) => {
  let page = parseInt(req.query.page);
  let search = req.query.search;
  let userPattern = new RegExp(search);
  Blog.find({ topic: { $regex: userPattern } })
    .skip(page)
    .limit(5)
    .then((blogs) => res.status(200).json({ result: blogs }))
    .catch((err) => {
      console.log(err);
    });
});

app.post("/post/blog", (req, res) => {
  const { topic, description, posted_at, posted_by } = req.body;
  const blog = new Blog({
    topic,
    description,
    posted_at,
    posted_by,
  });
  blog
    .save()
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/update/blog/:id", (req, res) => {
  const { topic, description, posted_at, posted_by } = req.body;
  Blog.findByIdAndUpdate(
    req.params.id,
    {
      topic,
      description,
      posted_at,
      posted_by,
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.delete("/delete/blog/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ result });
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
