const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    sparse: true
  },
  link: {
    type: String
  },
  userID: {
    type: String,
  },
  summary: {
    type: String
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
