const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const Note = require("./../models/Note.js");
const Article = require("./../models/Article.js");
const User = require("./../models/User.js");
const Image = require("./../models/Image.js");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.Promise = require('bluebird');

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

router.get("/", function(err, res) {
  res.render("intro");
});

// router.get("/", (req, res) => {
//   axios.get("https://medium.com/").then(function(response) {
//     let $ = cheerio.load(response.data);

//     $("article").each(function(i, element) {
//       let result = {};
//       console.log("test");
//       result.imageURL = $(this)
//         .find("div.extremePostPreview-image.u-flex0")
//         .children("a");
// .css('background-image');
// console.log("test");
//.replace(/url\(("|')(.+)("|')\)/gi, '$2');
//       console.log(result);
//       Image.create(result)
//         .then(function(dbImage) {
//           console.log(dbImage);
//         })
//         .catch(function(err) {
//           res.json(err);
//         });
//     });
//     res.render("intro", { images: dbImage });
//   });
// });

// router.get("/scrape/:id", (req, res) => {
//   axios.get("https://medium.com/topic/technology").then(function(response) {
//     //-----------------------------------------------  
      
//       const titleArray = [];

//     const query= User.findOne({ _id: req.params.id }).select("article");
//     console.log(query);
//     query.exec(function(err, docs) {
//       console.log("docs " +docs);
//       Article.find({ _id: { $in: docs.article } }, "title", function(
//         articleTitles
//       ) {
//         if (articleTitles) titleArray.push(articleTitles.title);
//         else {
//           console.log("articles to scrape");
//         }
//       });
//     });

//     console.log(titleArray);
// //---------------------------------------------------------------

//     let $ = cheerio.load(response.data);

//     $("section.m.n.o.fl.q.c").each(async function(i, element) {
  
//       let result = {};
//       result.summary = $(this)
//         .find("p.bo.bp.bj.b.bk.bl.bm.bn.c.an.ct.cr.dv.ef")
//         .children("a")
//         .text();

//       result.link = $(this)
//         .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
//         .children("a")
//         .attr("href");

//       result.title = $(this)
//         .find("h3.ai.y.cl.bj.cm.bk.ec.fs.ft.c.an.ee.cr")
//         .children("a")
//         .text();

       
//       if(titleArray.length>=1){
//         console.log("array length" + titleArray.length)
//         titleArray.forEach(val=>{
         
//         if (result.title === val) {
       
//           console.log(`already have ${result.title}`)
//         }else {    Article.create(result).then(function(dbArticle) {
//           console.log(dbArticle);
//           User.findOneAndUpdate(
//             { _id: req.params.id },
//             {
//               $push: { article: dbArticle._id }
//             },
//             {
//               new: true
//             }
//           )
//             .then(function(dbUser) {
//               console.log("yes created");
//               console.log(dbUser);
//             })
//             .catch(function(err) {
//               res.json(err);
//             });
//         }); 
//       }
//       });
//     } else{
      
//     console.log("CREATE")
//      await Article.create(result).then(function(dbArticle) {
//         if(dbArticle){
//          User.findOneAndUpdate(
//               { _id: req.params.id },
//               {
//                 $push: { article: dbArticle._id }
//               },
//               {
//                 new: true
//               }
//             );
//           }else{
//             console.log("not today")
//           }
//               // .then(function(dbUser) {
//               //   console.log("yes created");
//               //  console.log(update);
//               // })
//               // .catch(function(err) {
//               //   res.json(err);
//               // });
         
//      });
      
//     };
//   });
// });
//     res.redirect(`/home/${req.params.id}`);
//   });




  router.get("/scrape/:id", (req, res) => {
    axios.get("https://medium.com/topic/technology").then(function(response) {
  
      let $ = cheerio.load(response.data);
  
      $("section.m.n.o.fl.q.c").each(async function(i, element) {
    
        let result = {};
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

          result.userID=req.params.id;

       Article.create(result).
       then(function(dbArticle) {
        console.log(dbArticle);
        User.findOneAndUpdate(
  
          { _id: req.params.id },
          {
            $push: {article: dbArticle._id }
          },
          {
            new: true
          }
        ).then(function(allusers){
        console.log(allusers);
        });
      });
    });
  });
      res.redirect(`/home/${req.params.id}`);
    });



router.get("/user/:id", function(req, res){
Article.find({userID:req.params.id}).
then(function(all){
 const array= []; 
  console.log(all)
all.forEach(val=>{
  console.log(typeof val);
array.push((val._id).toString());
console.log(val._id);
})
// return array;

// then(function(array){
//   console.log(array);

console.log(array);

User.findOneAndUpdate(
  
    { _id: req.params.id },
    {
      $push: {article: {$each: array }}
    },
    {
      new: true
    }
  ).then(function(allusers){
  console.log(allusers);
  });
})
})
// })

// app.use('/user/:id', function (req, res, next) {
//   console.log('Request URL:', req.originalUrl)
//   next()
// }, function (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// })

// User.findOneAndUpdate(
  
//   { _id: req.params.id },
//   {
//     $push: {article: {$each: array }}
//   },
//   {
//     new: true
//   }
// ).then(function(allusers){
// console.log(allusers);
// });
// }).then(function(test){
//   console.log(test)
// })
// })
  


//show all scraped articles
router.get("/home/:id", function(req, res) {
  User.findOne({ _id: req.params.id })
    .populate("article")
    .then(function(dbArticle) {
      console.log(dbArticle);
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
router.get("/article/saved/:id", function(req, res) {
  User.findOne({ _id: req.params.id })
    .populate("article")
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
        res.json(dbNote);
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

//delte individual notes
router.delete("/note/:id", function(req, res) {
  console.log(req.params.id);
  Note.findOneAndDelete({ _id: req.params.id }).then((err, res) => {
    console.log(res);
  });
});

//create an account after user signs in
router.post("/signin/", function(req, res) {
  console.log(req.body);
  const user = new User(req.body);
  user.setFullName();
  user.lastUpdatedDate();
  User.create(user)
    .then(function(dbUser) {
      console.log(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//login into account
router.post("/login/", function(req, res) {
  console.log(req.body.username);
  console.log(req.body);
  User.findOneAndUpdate({ password: req.body.password }, { signInCheck: true })

    .then(function(dbUser) {
      console.log(dbUser._id);

      res.json(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articlefind/", function(req, res) {
  Article.find({}).then(function(all) {
    console.log(all);
  });
});

router.get("/Userfind/", function(req, res) {
  User.find({})
    .populate("article")
    .then(function(all) {
      console.log(all);
    });
});

router.get("/articlesDelete/", function(req, res) {
  Article.deleteMany({ saved: false}).then(function(all) {
    console.log(all);
  });
});

router.get("/UserDelete/", function(req, res) {
  User.deleteMany({}).then(function(all) {
    console.log(all);
  });
});

router.get("/NotesDelete/", function(req, res) {
  Note.deleteMany({}).then(function(all) {
    console.log(all);
  });
});
module.exports = router;
