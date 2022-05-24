//Module core
const http = require("http");

//Module npm
require("dotenv").config();
const mongoose = require("mongoose");

//My Modules
const app = require("./config/app");

const server = http.createServer(app);

//"mongoose": "^5.12.2"
mongoose.connect("mongodb://127.0.0.1/user_google").then(() => {
  console.log("Mongo Ok");

  server.listen("3000", () => {
    console.log("Server Up port 3000");
  });
});
