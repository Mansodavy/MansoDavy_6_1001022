const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  if (req.body.password.length >= 8 && req.body.password.includes('@') 
  || req.body.password.includes('!') || req.body.password.includes('"') 
  || req.body.password.includes('$') || req.body.password.includes('#') 
  || req.body.password.includes('%') || req.body.password.includes('&') 
  || req.body.password.includes('(') || req.body.password.includes(')')
  || req.body.password.includes(',') || req.body.password.includes('-')
  || req.body.password.includes('.') || req.body.password.includes('/')
  || req.body.password.includes(':') || req.body.password.includes(';')
  || req.body.password.includes('<') || req.body.password.includes('=')
  || req.body.password.includes('>') || req.body.password.includes('?')
  || req.body.password.includes('[') || req.body.password.includes('\\')
  || req.body.password.includes('_') || req.body.password.includes(']')
  || req.body.password.includes('`') || req.body.password.includes('^')
  || req.body.password.includes('{') || req.body.password.includes('|')
  || req.body.password.includes('}') || req.body.password.includes('~')) {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  } else if (req.body.password.length < 8 )
  {
    res.status(500).json({ message:"Mot de passe trop court ! Minimum 8 Caractére avec un caractère spécial !$%(,.:<>[_`{}\#&)-/;=\\?]^|~ " });
  } else if (req.body.password !=  req.body.password.includes('@') 
  || req.body.password.includes('!') || req.body.password.includes('"') 
  || req.body.password.includes('$') || req.body.password.includes('#') 
  || req.body.password.includes('%') || req.body.password.includes('&') 
  || req.body.password.includes('(') || req.body.password.includes(')')
  || req.body.password.includes(',') || req.body.password.includes('-')
  || req.body.password.includes('.') || req.body.password.includes('/')
  || req.body.password.includes(':') || req.body.password.includes(';')
  || req.body.password.includes('<') || req.body.password.includes('=')
  || req.body.password.includes('>') || req.body.password.includes('?')
  || req.body.password.includes('[') || req.body.password.includes('\\')
  || req.body.password.includes('_') || req.body.password.includes(']')
  || req.body.password.includes('`') || req.body.password.includes('^')
  || req.body.password.includes('{') || req.body.password.includes('|')
  || req.body.password.includes('}') || req.body.password.includes('~') ) 
  {
    res.status(500).json({ message:"Pas de caractère spécial dans le mot de passe liste des caractères spécials !$%(,.:<>[_`{}\#&)-/;=\\?]^|~" });
  }

};


exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              config.secret,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};