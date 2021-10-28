//importation express
const express = require("express");
const helmet = require('helmet');//protège l'application express

const morgan = require("morgan");

require("dotenv").config();
const path = require('path');

//import routes
const userRoutes = require('./routes/user');

const sauceRoutes = require('./routes/sauce');

//crée une application express
const app = express();
//app.use ==> s'éxécute sur toutes les routes
app.use(helmet());
//importation fichier mongoDB
const mongoose = require('./database/db');

//degug mongoose
mongoose.set('debug', true);


//problémes de CORS, securiser requêtes serveurs differents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



//express remplace body-parser qui est deprécié depuis v4.16
app.use(express.json());


//logger les requetes et les reponses
app.use(morgan("dev"));


//route authentification

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//__dirname pointe vers images qui contient les fichiers static
app.use('/images', express.static(path.join(__dirname, 'images')));

//export pour pouvoir y accéder dans n'importe quel autre fichier
module.exports = app;
