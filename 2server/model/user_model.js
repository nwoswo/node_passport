const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
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
const User = mongoose.model("User", UserSchema);
module.exports = User;
