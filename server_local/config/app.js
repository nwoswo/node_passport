const express = require("express");
const passport = require("passport");
const ModelUsuario = require("../model/user_model");
const app = express();
app.use(express.json());
require("../middleware/passport")(passport);
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

app.post("/signup", async (req, res, next) => {
  const data = ({ email, password, role } = req.body);
  const userExists = await ModelUsuario.findOne({ email: email });
  if (userExists) {
    return next(new Error("usuario ya existe"));
  }

  user = await ModelUsuario.create(data);
  return res.json(user);
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local-login", { session: false }, (err, user) => {
    if (err || !user) {
      return next(new Error("Usuario o Password Incorrecto"));
    }
    req.login(user, { session: false }, (err) => {
      if (err) return next(new Error("Error Servidor"));

      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, "TOP_SECRET");

      return res.json({ token });
    });
  })(req, res, next);
});

app.use((err, req, res, next) => {
  console.log(err);

  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;

  res.status(status).json({
    message,
    data,
  });
});

module.exports = app;
