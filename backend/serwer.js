const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookie());
app.use(passport.initialize());
app.use(passport.session());
const initializePassport = require("./passport-config");
initializePassport(passport);

const users = require("./routes/users");
const posts = require("./routes/posts");
app.use("/posts", posts);
app.use("/users", users);

mongoose
  .connect(`mongodb+srv://${process.env.CREDENTIALS}${process.env.MONGO_URI}`)
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const apiPort = process.env.PORT || 3000;
    const apiHost = process.env.API_HOST || "localhost";
    app.listen(apiPort, () => {
      console.log(`API server available from: http://${apiHost}:${apiPort}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
