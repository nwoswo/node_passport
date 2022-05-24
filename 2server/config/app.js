const express = require("express");
const passport = require("passport");
const User = require("../model/user_model");
const app = express();

require("./passport")(app, passport);

roleAuthorization = function (roles) {
  return function (req, res, next) {
    let user = req.user.user;
    User.findById(user._id, function (err, foundUser) {
      console.log("foundUser", foundUser);
      if (err) {
        res.status(422).json({ error: "No user found." });
        return next(err);
      }
      if (roles.indexOf(foundUser.role) > -1) {
        return next();
      }
      res
        .status(401)
        .json({ error: "You are not authorized to view this content" });
      return next("Unauthorized");
    });
  };
};

const JWT = passport.authenticate("jwt", { session: false });

app.get(
  "/profile",
  JWT,
  roleAuthorization(["USER_ADMIN"]),

  (req, res, next) => {
    res.json("Welcome");
  }
);

module.exports = app;
