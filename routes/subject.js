const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject")

router.get("/", subjectController.getAllSubjects);

router.post("/new-subject", subjectController.createSubject);

// router.put("/:id/monitor", subjectController.add);

module.exports = router;