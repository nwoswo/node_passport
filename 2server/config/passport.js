const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const User = require("../model/user_model");

module.exports = (app, passport) => {
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
    passport.authenticate("google", { session: false })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ id: profile.id });
          // if user exists return the user
          if (existingUser) {
            return done(null, existingUser);
          }
          // if user does not exist create a new user
          console.log("Creating new user...");
          const newUser = new User({
            method: "google",

            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          let doc = await newUser.save();
          return done(null, doc);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        // fromAuthHeader
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "secretKey",
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload;
          console.log(user);
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
