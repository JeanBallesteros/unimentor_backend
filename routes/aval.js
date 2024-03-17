const express = require("express");
const router = express.Router();
const avalController = require("../controllers/aval")

// router.get("/", userController.getAllUsers);

router.post("/:id", avalController.avalUpload);



module.exports = router;