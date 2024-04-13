const express = require("express");
const router = express.Router();
const avalController = require("../controllers/aval")

router.post("/:id", avalController.avalUpload);
router.get("/", avalController.avalUsers);
router.delete("/delete/:id", avalController.avalDelete);

module.exports = router;