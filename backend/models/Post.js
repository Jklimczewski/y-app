const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    content: String,
    author: {
      type: Schema.Types.ObjectId,
    },
    parentPost: {
      type: Schema.Types.ObjectId,
    },
    quotedPost: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
