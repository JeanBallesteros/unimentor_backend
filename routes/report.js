const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report")

router.post("/new-report", reportController.createReport);

router.get("/", reportController.getAllReports);

module.exports = router;