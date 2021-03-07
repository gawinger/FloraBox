if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// npm modules
const express = require("express");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session")({
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  expires: Date.now() + 1000 * 60 + 60 * 24 * 7,
  maxAge: 1000 * 60 + 60 * 24 * 7,
});

const app = express();
const path = require("path");

const User = require("./models/user");

const { checkPromotion, runEveryFullHours } = require("./public/utils/middleware");
app.use(methodOverride("_method"));

app.engine("ejs", engine);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// routes
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const homeRoutes = require("./routes/home");

// Database connection
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/scouter";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(session);

const LocalStrategy = require("passport-local").Strategy;
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(helmet({ contentSecurityPolicy: false }));

passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

runEveryFullHours(checkPromotion);

// flash and user locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoutes);
app.use("/", productsRoutes);
app.use("/", homeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
