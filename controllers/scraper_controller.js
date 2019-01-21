const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const Note = require("./../models/Note.js");
const Article = require("./../models/Article.js");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.Promise = require("bluebird");

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

router.get(
  "/scrape/",
  (req, res, next) => {
    axios.get("https://medium.com/topic/technology").then(function(response) {
      const $ = cheerio.load(response.data);

      $("section.m.n.o.fl.q.c").each(function(i, element) {
        let result = {};
        result.summary = $(this)
          .find("p.bo.bp.bj.b.bk.bl.bm.bn.c.an.ct.cr.dv.ef")
          .children("a")
          .text();

        result.link = $(this)
          .find("h3.ai.y.cl.bj.cm.bk.ec.ft.fu.c.an.ee.cr")
          .children("a")
          .attr("href");

        result.title = $(this)
          .find("h3.ai.y.cl.bj.cm.bk.ec.ft.fu.c.an.ee.cr")
          .children("a")
          .text();

        console.log(result);

        Article.findOne({ title: result.title }).then(findArticles => {
          if (findArticles) {
            console.log(findArticles);
          } else {
            Article.create(result).then(article => {
              console.log(article);
            });
          }
        });
      });
    });
    next();
  },
  (req, res) => {
    res.redirect(`/`);
  }
);

router.get("/", (req, res) => {
  Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.render("index", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//delete article and note references
router.delete("/article-delete/:id", (req, res) => {
  Article.findOneAndDelete({ _id: req.body.id }, (err, response) => {
    console.log(response);
    Note.deleteMany({ _id: { $in: response.note } }, function(err, res) {
      console.log("deleting project references");
    });
  });
});

//update article to saved:true
router.put("/article-save/:id", (req, res) => {
  console.log(req.body);
  Article.findOneAndUpdate({ _id: req.body.id }, { saved: req.body.saved })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//show all saved articles
router.get("/article/saved/", (req, res) => {
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
router.post("/notes/:id", (req, res) => {
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
        res.json(dbNote);
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//display notes per article
router.get("/notes/:id", (req, res) => {
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

//delete individual notes
router.delete("/note/:id", (req, res) => {
  console.log(req.params.id);
  Note.findOneAndDelete({ _id: req.params.id }).then((err, res) => {
    console.log(res);
  });
});

router.get("/articlefind/", (req, res) => {
  Article.find({})
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/Notesfind/", (req, res) => {
  Note.find({})
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/Userfind/", (req, res) => {
  User.find({})
    .populate("article")
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articlesDelete/", (req, res) => {
  Article.deleteMany({})
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/UserDelete/", (req, res) => {
  User.deleteMany({})
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/NotesDelete/", (req, res) => {
  Note.deleteMany({})
    .then(function(all) {
      console.log(all);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
