const express = require("express");
const router = express.Router();
const hourLogController = require("../controllers/hourlog")

router.get("/", hourLogController.getAllHoursLog);
router.get("/monitormonth/:id", hourLogController.getAllHoursLogByMonitorDate);
router.get("/monitormonthsemester/:id", hourLogController.getAllHoursLogByMonitorAndSemester);
router.post("/new-hourslog", hourLogController.createHourLog);
router.get("/:id", hourLogController.getHourLogById);
router.get("/group/:id", hourLogController.getAllDates);
router.get("/monitor/:id", hourLogController.getAllHoursLogByMonitorId);
router.get("/teacher/:id", hourLogController.getAllHoursLogByTeacherId);
router.delete("/delete/:id", hourLogController.hourLogDelete);
router.patch("/update/:id", hourLogController.updateHourLog);
router.get("/monitorinmonth/:id", hourLogController.getAllHoursLogByMonitorInMonth);

module.exports = router;