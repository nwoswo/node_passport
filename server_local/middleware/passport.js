const JwtStrategy = require("passport-jwt").Strategy;
const localStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user_model");

module.exports = (passport) => {
  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      (email, password, done) => {
        UserModel.findOne({ email }, (err, user) => {
          if (err) return done(err);

          if (!user) return done(null, false);

          if (!user.isValidPassword(password)) return done(null, false);

          return done(null, user);
        });
      }
    )
  );

  // passport.use(
  //   new JwtStrategy(
  //     {
  //       // fromAuthHeader
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: "TOP_SECRET",
  //     },
  //     async (jwtPayload, done) => {
  //       try {
  //         // Extract user
  //         const user = jwtPayload;
  //         console.log(user);
  //         done(null, user);
  //       } catch (error) {
  //         done(error, false);
  //       }
  //     }
  //   )
  // );
};
