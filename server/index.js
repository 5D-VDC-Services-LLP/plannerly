import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import "./db/mongoose.js";
import saveRouter from "./routes/save.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Plannerly-lite backend running!" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api", saveRouter);


// ✨ MODIFIED: This route now handles a streaming request body
// app.post("/api/save", (req, res) => {
//   const { scope, milestones } = req.body;
//   console.log("✅ Received Data:", { scope, milestones });
//   res.status(200).json({ message: "Data received successfully" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
