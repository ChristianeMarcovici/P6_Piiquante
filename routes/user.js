const express = require("express");


const password = require('../middleware/password');
const userController = require("../controllers/user");

/////////////Router/////////////////////////
const router = express.Router();

/////////////signup////////////////////////
router.post("/signup", password,  userController.signup);

////////////login////////////////////////////
router.post("/login", password,  userController.login);



//////////////export/////////////////////////
module.exports = router;
