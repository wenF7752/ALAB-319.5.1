import express from "express";
import "dotenv/config";
import mongoose from "./db/conn.js";  // Import the Mongoose connection
import grades from "./routes/grades.js";
import grades_agg from "./routes/grades_agg.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Body parser middleware
app.use(express.json());

// Test route to ensure the API is working
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Route handlers
app.use("/grades", grades);
app.use("/grades", grades_agg);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Seems like we messed up somewhere...");
});

// Connect to the database and start the server
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
