const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

//modele de base de donnée pour nouvel utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
//plugin => addresse email unique

module.exports = mongoose.model("User", userSchema);
