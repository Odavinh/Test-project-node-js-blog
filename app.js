const express = require("express");
const bodyParser = require("body-parser");
const PATH = require("path");
const staticAsset = require("static-asset");
const mongoose = require("mongoose");
const db = require("./dataBase");
const config = require("./config");
const routrs = require("./routes/inx");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

let app = express();

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.set("view engin", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(PATH.join(__dirname, "public")));
app.use(express.static(PATH.join(__dirname, "public")));
app.use(
  "/scripts",
  express.static(PATH.join(__dirname, "node_modules", "jquery", "dist"))
);

db()
  .then(info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}!`);
  })
  .catch(() => {
    console.log("Connection to the database did not take place");
  });

app.get("/", (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render("index.ejs", {
    user:{
      id,
      login
    }
  });
});
app.use("/api/auth", routrs.auth);
app.use("/post", routrs.post);

/////error 404
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error.ejs", {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

module.exports = app;
