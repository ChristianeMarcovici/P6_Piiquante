//import model database User
const User = require("../models/User");

//variable d'environnement pour cacher donnée
require("dotenv").config();

//securisé mot de passe
const bcrypt = require("bcrypt");

//chiffrer email RGPD
const cryptojs = require("crypto-js");

//authentification
const jwt = require("jsonwebtoken");

//variable d'environnement pour cacher donnée
require("dotenv").config();
////////////signup////////////////////////////

exports.signup = (req, res, next) => {
  const emailCryptojs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
    .toString();

  bcrypt
    .hash(req.body.password, 10) //nbre de fois d'execution
    .then((hash) => {
      const user = new User({
        email: emailCryptojs,
        password: hash,
      });
      console.log(user);
      //envoie les donnees dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res.status(400).json({error})
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

///////login/////////////////////
exports.login = (req, res, next) => {
  const emailCryptojs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
    .toString();

  User.findOne({ email: emailCryptojs })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
          
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, //user visible
              `${process.env.JWT_KEY_TOKEN}`, //user crypter
              { expiresIn: "10h" } //délai
            ),
          });
        })
        .catch((error) => res.status(500).json({ message: "error catch" }));
    })
    .catch((error) => res.status(500).json({ message: "error catch" }));
};
