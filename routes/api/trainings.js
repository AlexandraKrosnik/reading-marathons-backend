const express = require("express");
const { trainings: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");

const {
  joiSchemaAddTraining,
  joiSchemaAddStatistic,
} = require("../../models/training");

const router = express.Router();

router.get("/", auth, ctrlWrapper(ctrl.getAll));
router.get("/:trainingId", auth, ctrlWrapper(ctrl.getById));
router.post("/", auth, validation(joiSchemaAddTraining), ctrlWrapper(ctrl.add));
router.patch(
  "/:trainingId/statistic",
  auth,
  validation(joiSchemaAddStatistic),
  ctrlWrapper(ctrl.updateStatistic)
);
router.delete("/:trainingId", auth, ctrlWrapper(ctrl.removeById));

module.exports = router;
