const mongoose = require("mongoose");

const Sauces = mongoose.model(
  "Sauces",
  new mongoose.Schema(
    {
      userId: String,
      name: String,
      manufacturer: String,
      description: String,
      mainPepper: String,
      imageUrl: String,
      heat: Number,
      likes: Number,
      dislikes: Number,
      usersLiked: [],
      usersDisliked: [],
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Sauces;
