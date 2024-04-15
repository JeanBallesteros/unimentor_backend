const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject")

router.get("/", subjectController.getAllSubjects);

router.post("/new-subject", subjectController.createSubject);

router.patch("/update/:id", subjectController.updateSubject);

// router.put("/:id/monitor", subjectController.add);

module.exports = router;