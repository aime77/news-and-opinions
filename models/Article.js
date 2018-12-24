const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique:true,
  },
  link: {
    type: String,
    unique:true,
  },
 summary: {
   type: String,
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    res: "Note"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
