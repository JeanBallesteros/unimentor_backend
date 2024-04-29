const express = require("express");
const router = express.Router();
const hourLogController = require("../controllers/hourlog")

router.post("/new-hourslog", hourLogController.createHourLog);
router.get("/:id", hourLogController.getAllHourLog);
router.get("/group/:id", hourLogController.getAllDates);

module.exports = router;