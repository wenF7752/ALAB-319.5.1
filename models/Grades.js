import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["exam", "quiz", "homework"]
    },
    score: {
        type: Number,
        required: true,
        min: 0
    }
});

const gradeSchema = new mongoose.Schema({
    class_id: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    },
    learner_id: {
        type: Number,
        required: true,
        min: 0
    },
    scores: [scoreSchema]
});

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
