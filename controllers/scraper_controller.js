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
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successful connection!");
});

db.on("error", error => {
  console.log("Error MongooseDB:", error);
});

// function getArticles() {
//   axios.get("https://medium.com/topic/technology").then(function(response) {
//     const $ = cheerio.load(response.data);

//     $("section").each(async function(index, element) {
//       return result = await {
//         summary: $(this)
//           .find("p.bo.bp.bj.b.bk.bl.bm.bn.c.an.ct.cr.dv.ef").children("a")
//           .text(),

//         link: $(this)
//           .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
//           .children("a")
//           .attr("href"),

//         title: $(this)
//           .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
//           .children("a")
//           .text()
//       };});

//       const articleDoc = new Article(result);
//       console.log("see" + index + articleDoc);
//       articleDoc.save((err, res) => {
//         if (err) {
//           throw err;
//         } else {
//           console.log(res);
//         }
//       });
    
//   });
// }

//get new scraped articles
router.get("/scrape", (req, res) => {
  axios.get("https://medium.com/topic/technology").then(function(response) {
    const $ = cheerio.load(response.data);

    $("section").each(async function(index, element) {
      const result = await {};
        result.summary= $(this)
          .find("p.bo.bp.bj.b.bk.bl.bm.bn.c.an.ct.cr.dv.ef").children("a")
          .text();

        result.link= $(this)
          .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
          .children("a")
          .attr("href");

        result.title= $(this)
          .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
          .children("a")
          .text();


          Article.create(result)
          .then(function(result) {
            console.log(result);
           
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.redirect("/");
    });
    });

     
  
//show all scraped articles
router.get("/", function(err, res) {

  Article.find({})
    .then(function(dbArticle) {
      res.render("index", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//delete article
router.delete("/article-delete/:id", function(req, res){
    console.log(req.body.id)

  Article.findOneAndDelete({_id:req.body.id})
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  })
  
  }); 

//update article to saved:true
router.put("/article-save/:id", function(req,res){
Article.findOneAndUpdate({_id:req.body.id},{saved:req.body.saved}).
then(function(dbArticle){
  res.json(dbArticle);
})
.catch(function(err){
  res.json(err);
})

})

//show all saved articles
router.get("/article/saved", function(res, res){
Article.find({saved:true}).then(function(dbArticle) {
    res.render("savedArticles", { article: dbArticle });
  })
  .catch(function(err) {
    res.json(err);
  });
});

//create a note
router.post("/note:id", function(req,res){
Note.create(req.body.note)
.then(function(dbNote){

    return Article.findOneAndUpdate({_id:req.params.id},{note:dbNote._id}, {new:true});
})
.then(function(dbArtcile){
    res.json(dbArtcile);
})
.catch(function(err){
    res.json(err)
})
})


//
router.get("/article-save/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
module.exports = router;
