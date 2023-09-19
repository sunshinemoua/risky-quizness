const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb+srv://sunshinemoua21:hello123@user.8ymipx7.mongodb.net/")
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3001, (req, res) => {
      console.log("listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });

console.log("hello db");
