const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const socketIo = require("socket.io");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  origin: "https://localhost:5173",
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

const key = fs.readFileSync(process.env.KEY_PATH);
const cert = fs.readFileSync(process.env.CERT_PATH);
const options = { key: key, cert: cert };
const httpsServer = https.createServer(options, app);
const io = socketIo(httpsServer, {
  cors: {
    origin: "https://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const initializeChat = require("./socket-config");
initializeChat(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

const users = require("./routes/users");
const posts = require("./routes/posts");
app.use("/api/posts", posts);
app.use("/api/users", users);

app.use(express.static(path.join(__dirname, "views/dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dist", "index.html"));
});

mongoose
  .connect(`mongodb+srv://${process.env.CREDENTIALS}${process.env.MONGO_URI}`)
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );

    const apiPort = process.env.PORT || 3000;
    const apiHost = process.env.API_HOST || "localhost";
    httpsServer.listen(apiPort, apiHost, () => {
      console.log(`API server available from: https://${apiHost}:${apiPort}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
