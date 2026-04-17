const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  title: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", TaskSchema);

// Assign task to a specific worker (Admin action)
router.post("/assign", async (req, res) => {
  try {
    const { workerId, title } = req.body;

    if (!workerId || !title) {
      return res.status(400).json({ message: "Worker ID and task title are required" });
    }

    const newTask = new Task({ workerId, title });
    await newTask.save();

    res.json({ success: true, message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign task" });
  }
});

// Get tasks for a specific worker
router.get("/worker/:workerId", async (req, res) => {
  try {
    const tasks = await Task.find({ workerId: req.params.workerId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;
