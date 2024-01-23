const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  surname: String,
  phoneNumber: String,
});

module.exports = model("User", userSchema);
