const express = require("express");
const router = express.Router();
const programController = require("../controllers/program")

router.post("/new-program", programController.createProgram);

module.exports = router;