const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group")

router.get("/", groupController.getAllGroups);

router.post("/new-group", groupController.createGroup);

router.patch("/update/:id", groupController.updateGroup);

module.exports = router;