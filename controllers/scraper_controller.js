const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const Note = require("./../models/Note.js");
const Article = require("./../models/Article.js");
const User = require("./../models/User.js");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI);
mongoose.Promise = Promise;
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successful connection!");
});

db.on("error", error => {
  console.log("Error MongooseDB:", error);
});


router.get("/scrape", (req, res) => {
  axios.get("https://medium.com/topic/technology").then(function(response) {
    const $ = cheerio.load(response.data);

    $("section.m.n.o.fl.q.c").each(function(i, element) {
      const result = {};
      result.summary = $(this)
        .find("p.bo.bp.bj.b.bk.bl.bm.bn.c.an.ct.cr.dv.ef")
        .children("a")
        .text();

      result.link = $(this)
        .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
        .children("a")
        .attr("href");

      result.title = $(this)
        .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
        .children("a")
        .text();

      Article.create(result)
        .then(function(result) {
          console.log(result);
          res.redirect("/home")
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

//show all scraped articles
router.get("/", function(err, res) {
  res.render("intro");
});

//show all scraped articles
router.get("/home", function(err, res) {
  Article.find({})
    .then(function(dbArticle) {
      res.render("index", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//delete article and note references
router.delete("/article-delete/:id", function(req, res) {
  Article.findOneAndDelete({ _id: req.body.id }, (err, response) => {
    console.log(response);
    Note.deleteMany({ _id: { $in: response.note } }, function(err, res) {
      console.log("deleting project references");
    });
  });
});

//update article to saved:true
router.put("/article-save/:id", function(req, res) {
  Article.findOneAndUpdate({ _id: req.body.id }, { saved: req.body.saved })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//show all saved articles
router.get("/article/saved", function(res, res) {
  Article.find({ saved: true })
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.render("savedArticles", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//create a note
router.post("/notes/:id", function(req, res) {
  Note.create({ body: req.body.note })
    .then(function(dbNote) {
      Article.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { note: dbNote._id }
        },
        {
          new: true
        }
      ).then(function(dbArticle) {
        console.log("yes created");
        console.log(dbArticle);
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//display notes per article
router.get("/notes/:id", function(req, res) {
  Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle);

      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.delete("/note/:id", function(req, res){
  Note.findOneAndDelete({_id:req.params.id})
})

//create an account after user signs in
router.post("/signin/", function(req, res) {
    console.log(req.body)
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })
    .then(function(dbUser) {
      console.log(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//create an account after user signs in
router.post("/login/", function(req, res) {
  User.findOne({})
    .then(function(dbUser) {
      console.log(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
