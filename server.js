//package http permet d'avoir les outils pour créer le serveur
const http = require("http");

//import app
const app = require("./app");

//variable d'environnement pour cacher donnée
require("dotenv").config();

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT);
//attribue la valeur port à "port"
app.set("port", port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    //error.syscall = appel système qui a échoué
    throw error;
  }
  const address = server.address(); //methode qui renvoie l'addresse lié
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES": //Autorisation refusée
      console.error(bind + " requires elevated privileges.");
      process.exit(1); //code echec 1, code réussite 0
      break;
    case "EADDRINUSE": //serveur déjà utilisé
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//fonction appellé lors d'une requête
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

//Pour lier et ecouter les connexions sur l'hotes et le port
server.listen(port);
