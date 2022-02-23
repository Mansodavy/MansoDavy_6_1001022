const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {


    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Erreur : L'email est deja utiliser !" });
        return;
      }

      next();
    });
};


const verifySignUp = {
  checkDuplicateEmail,
};

module.exports = verifySignUp;