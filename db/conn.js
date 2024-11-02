import "dotenv/config";
import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

export default mongoose;
