const express = require("express");
const router = express.Router();
const avalController = require("../controllers/aval")

router.post("/:id", avalController.avalUpload);
router.get("/", avalController.avalUsers);

module.exports = router;