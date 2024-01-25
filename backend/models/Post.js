const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
  },
  creationDate: Date,
  parentPost: {
    type: Schema.Types.ObjectId,
  },
  quotedPost: {
    type: Schema.Types.ObjectId,
  },
});

module.exports = model("Post", postSchema);
