const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  id: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  method: {
    type: String,
  },
  role: {
    type: String,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
    default: "USER_ROLE",
  },
});

UserSchema.methods.isValidPassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) {
    return next();
  }

  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
