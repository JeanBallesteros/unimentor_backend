const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

router.get("/", userController.getAllUsers);

// router.post("/aval", userController.avalUpload);



module.exports = router;