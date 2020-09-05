const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

/********* Requests targeting ALL articles ************/

app.route("/articles")

  .get(function(request, response) {

    Article.find(function(err, foundArticles) {
      if (!err) {
        response.send(foundArticles);
      } else {
        response.send(err);
      }
    });
  })

  .post(function(request, response) {

    const newArticle = new Article({
      title: request.body.title,
      content: request.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        response.send("Successfully saved the article.");
      } else {
        response.send(err)
      }
    });
  })

  .delete(function(request, response) {

    Article.deleteMany(function(err) {
      if (!err) {
        response.send("Successfuly deleted all articles.");
      } else {
        response.send(err);
      }
    });
  });


/********* Requests targeting ONE article ************/

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article with that title was found.")
      }
    });

  })
  .put(function(req, res) {
    Article.findOneAndUpdate({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    },
    function(err) {
      if (!err) {
        res.send("The article was updated.")
      } else {
        res.send("The article was not found.")
      }
    });
  })
  .patch(function(req, res) {
    Article.findOneAndUpdate({
      title: req.params.articleTitle
    }, {
      $set: req.body
    },
    function(err) {
      if(!err) {
        res.send("Successfully updated the article.")
      }
    });
  })
  .delete(function(req, res) {
    Article.findOneAndDelete({
      title: req.params.articleTitle
    }, function(err, result) {
      if (!err) {
        res.send(`Successfuly deleted article ${req.params.articleTitle}.`);
      } else {
        res.send(err);
      }
    });
  });






app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});
