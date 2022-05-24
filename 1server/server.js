const express = require("express");
const app = express();

require("dotenv").config();
const passport = require("passport");
require("./store/passport")(passport);
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const PORT = 3000;

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }
        res.json({
          token,
        });
      }
    );
  }
);

// Redirect the user to the Google signin page

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile/");
  }
);

app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json("Welcome");
  }
);

//"mongoose": "^5.12.2"
mongoose.connect("mongodb://127.0.0.1/user_google").then(() => {
  console.log("Mongo Ok");

  app.listen(PORT, () => {
    console.log("Server Up port 3000");
  });
});
