const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

router.get("/", userController.getAllUsers);
router.get("/monitors", userController.getAllMonitors);
router.patch("/update/:id", userController.updateUser);




module.exports = router;