const session = require("express-session");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.CREDENTIALS}${process.env.MONGO_URI}`,
  collection: "sessions",
});

store.on("error", (error) => console.log(error));

const sessionOptions = {
  secret: process.env.APP_SECRET || "app-secret",
  store: store,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: true,
    secure: true,
  },
};

const sessionMiddleware = session(sessionOptions);

module.exports = { sessionMiddleware };
