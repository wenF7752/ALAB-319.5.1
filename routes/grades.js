import express from "express";
import Grade from "../models/grades.js";

const router = express.Router();

// Get a single grade entry by ID
router.get("/:id", async (req, res, next) => {
  try {
    const result = await Grade.findById(req.params.id);

    if (!result) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Get grades for a learner
router.get("/learner/:id", async (req, res, next) => {
  try {
    const query = { learner_id: Number(req.params.id) };
    if (req.query.class) {
      query.class_id = Number(req.query.class);
    }

    const result = await Grade.find(query);

    if (!result.length) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Get grades for a class
router.get("/class/:id", async (req, res, next) => {
  try {
    const query = { class_id: Number(req.params.id) };
    if (req.query.learner) {
      query.learner_id = Number(req.query.learner);
    }

    const result = await Grade.find(query);

    if (!result.length) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Calculate learner average across all classes
router.get("/learner/:id/average", async (req, res, next) => {
  try {
    const grades = await Grade.find({ learner_id: Number(req.params.id) });
    let totalScore = 0, totalCount = 0;

    grades.forEach((grade) => {
      grade.scores.forEach((score) => {
        totalScore += score.score;
        totalCount++;
      });
    });

    const average = totalCount ? totalScore / totalCount : 0;
    res.status(200).send({ average });
  } catch (err) {
    next(err);
  }
});

// Create a grade entry
router.post("/", async (req, res, next) => {
  try {
    const newGrade = new Grade(req.body);
    const result = await newGrade.save();
    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res, next) => {
  try {
    const result = await Grade.findByIdAndUpdate(
      req.params.id,
      { $push: { scores: req.body } },
      { new: true }
    );

    if (!result) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res, next) => {
  try {
    const result = await Grade.findByIdAndUpdate(
      req.params.id,
      { $pull: { scores: req.body } },
      { new: true }
    );

    if (!result) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Delete a grade entry by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);

    if (!result) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Delete grades for a learner
router.delete("/learner/:id", async (req, res, next) => {
  try {
    const result = await Grade.deleteMany({ learner_id: Number(req.params.id) });

    if (!result.deletedCount) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

// Delete grades for a class
router.delete("/class/:id", async (req, res, next) => {
  try {
    const result = await Grade.deleteMany({ class_id: Number(req.params.id) });

    if (!result.deletedCount) res.status(404).send("Not Found");
    else res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
