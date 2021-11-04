//logique metier
const Sauce = require("../models/Sauce");
const fs = require("fs-extra");

//////////////////////////////GET ///////////////////////////////////
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

///////////////////////////CREATE////////////////////////////////////
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
 

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });


  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "sauce sauvegardé",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//////////////////////////MODIFY/////////////////////////////////
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // si l'image n'est pas modifiée
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

///////////////////////////////DELETE////////////////////////////////////////////
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

////////////////////////////LIKE OR DISLIKE/////////////////////////////////////////////
exports.likeOrDislikeSauce = (req, res, next) => {

  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
 

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // nouvelles valeurs à modifier
      const likeListen = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };

      const userAlreadyLiked =
        likeListen.usersLiked.includes(userId) ||
        likeListen.usersDisliked.includes(userId);
      

      //Différents cas:
      switch (like) {
        case 1: // CAS: sauce liked
          if (!userAlreadyLiked) {
            likeListen.usersLiked.push(userId);
          }
          break;
        case -1: // CAS: sauce disliked
          if (!userAlreadyLiked) {
            likeListen.usersDisliked.push(userId);
          }
          break;
        case 0: // CAS: Annulation du like/dislike
          if (likeListen.usersLiked.includes(userId)) {
            // si on annule le like
            const index = likeListen.usersLiked.indexOf(userId);
            likeListen.usersLiked.splice(index, 1);
          } else {
            // si on annule le dislike
            const index = likeListen.usersDisliked.indexOf(userId);
            likeListen.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Totaux likes et dislikes
      likeListen.likes = likeListen.usersLiked.length;
      likeListen.dislikes = likeListen.usersDisliked.length;

      // Met à jour les likes
      Sauce.updateOne({ _id: sauceId }, likeListen)
        .then(() => res.status(200).json({ message: "Nouvelle note !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
