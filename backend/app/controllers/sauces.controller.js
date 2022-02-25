const { sauces } = require("../models");
const db = require("../models");
const Sauces = db.sauces;
const url = require("url");
const fs = require("fs");
const path = require("path");

exports.createSauces = (req, res) => {
  const saucesObject = JSON.parse(req.body.sauce);
  saucesObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  (saucesObject.likes = 0),
    (saucesObject.dislikes = 0),
    console.log(saucesObject);
  const sauces = new Sauces({
    ...saucesObject,
  });
  sauces
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res) => {
  Sauces.find()
    .then((Sauces) => res.status(200).json(Sauces))
    .catch((error) => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res) => {
  Sauces.findOne({ _id: req.params.id })
    .then((Sauces) => res.status(200).json(Sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateOneSauce = (req, res) => {
  let sauceObject = req.body;
  if (req.file) {
    sauceObject = JSON.parse(req.body.sauce);
    Sauces.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          console.log(err);
        });
      })
      .catch((error) => res.status(500).json({ error }));
    sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  Sauces.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: "La Sauce a été modifiée sans image !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res) => {
  Sauces.findOne({ _id: req.params.id }).then((Sauces) => {
    const filename = Sauces.imageUrl.split("/images/")[1];
    Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce supprimée" }))
      .catch((error) => res.status(404).json(error));
    fs.unlinkSync(`images/${filename}`, () => {
      if (err) throw err;
    });
  });
};
exports.getLikeDislike = (req, res) => {
  let getLikeDislike = req.body.like;
  switch (getLikeDislike) {
    case 1:
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error }));
      break;
    case -1:
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error }));
      break;
    case 0:
      Sauces.findOne({ _id: req.params.id }).then((sauces) => {
        if (sauces.usersLiked.find((user) => user === req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(404).json({ error }));
        }
        if (sauces.usersDisliked.find((user) => user === req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(404).json({ error }));
        }
      });
      break;
    default:
      console.log("Aucune action reçue.");
      break;
  }
};
