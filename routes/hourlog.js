const express = require("express");
const router = express.Router();
const hourLogController = require("../controllers/hourlog")

router.post("/new-hourslog", hourLogController.createHourLog);
router.get("/:id", hourLogController.getHourLogById);
router.get("/group/:id", hourLogController.getAllDates);
router.get("/monitor/:id", hourLogController.getAllHoursLog);
router.get("/teacher/:id", hourLogController.getAllHoursLogByTeacherId);
router.delete("/delete/:id", hourLogController.hourLogDelete);
router.patch("/update/:id", hourLogController.updateHourLog);

module.exports = router;