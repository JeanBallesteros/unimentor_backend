const express = require("express");
const router = express.Router();
const avalController = require("../controllers/aval")

router.post("/:id", avalController.avalUpload);

module.exports = router;