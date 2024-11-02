import express from "express";
import Grade from "../models/grades.js";

const router = express.Router();

// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  try {
    const result = await Grade.aggregate([
      { $match: { learner_id: Number(req.params.id) } },
      { $unwind: "$scores" },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: [{ $eq: ["$scores.type", "quiz"] }, "$scores.score", "$$REMOVE"],
            },
          },
          exam: {
            $push: {
              $cond: [{ $eq: ["$scores.type", "exam"] }, "$scores.score", "$$REMOVE"],
            },
          },
          homework: {
            $push: {
              $cond: [{ $eq: ["$scores.type", "homework"] }, "$scores.score", "$$REMOVE"],
            },
          },
        },
      },
      {
        $project: {
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ]);

    if (!result.length) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    console.error("Error in aggregation:", err);
    res.status(500).send("An error occurred while processing the aggregation.");
  }
});

export default router;
