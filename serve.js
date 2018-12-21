const cheerio = require("cheerio");
const logger = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
const Article = require("./models/User.js");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials"
  })
);

app.use(logger("dev"));

const routes = require("./controllers/scraper_controller.js");

app.use(routes);

mongoose.Promise = Promise;
mongoose.connect(
  MONGODB_URI,
  { useMongoClient: true }
);

const db=mongoose.connection;

db.once("open", ()=>{
    console.log("Successful connection!");
});

db.on("error", (error)=>{
    console.log("Error MongooseDB:", error);
});
