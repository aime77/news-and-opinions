const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: false
  },
  link: {
    type: String,
    unique: false
  },
  userID: {
    type: String,
  },
  summary: {
    type: String,
    unique: false
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});
//ArticleSchema.plugin(uniqueValidator);
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
