const express = require("express");
const router = express.Router();
const avalController = require("../controllers/aval")

router.post("/new-aval", avalController.createAval);
router.post("/:id", avalController.avalUpload);
router.get("/", avalController.avalUsers);
router.get("/monitor", avalController.avalUsersMonitor);
router.delete("/delete/:id", avalController.avalDelete);
router.get("/user/:id", avalController.userIdInAval);

module.exports = router;