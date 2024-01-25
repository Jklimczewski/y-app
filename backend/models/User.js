const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  name: String,
  surname: String,
  phoneNumber: String,
  follows: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  lastPostsRefresh: Date,
});

module.exports = model("User", userSchema);
