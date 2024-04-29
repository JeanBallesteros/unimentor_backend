const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group")

router.get("/", groupController.getAllGroups);

router.get("/:id", groupController.getGroup);

router.get("/monitor", groupController.getAllGroupsMonitorEmpty);

router.get("/monitor/:id", groupController.getAllGroupsMonitor);

router.get("/monitornotempty", groupController.getAllGroupsMonitorNotEmpty);

router.post("/new-group", groupController.createGroup);

router.patch("/update/:id", groupController.updateGroup);

router.patch("/updatetonull/:id", groupController.updateGroupToNull);

module.exports = router;