const logger = require("morgan");
const express = require("express");
var bodyParser = require("body-parser");
const exphbs = require("express-handlebars");


const PORT = process.env.PORT || 3000;

const app = express();

/*handlebars*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "hbs");
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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


