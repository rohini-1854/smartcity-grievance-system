// File: routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/UserModel');
const Message = require('../models/MessageModel');
const Complaint = require('../models/ComplaintModel');
const WorkerModel = require('../models/WorkerModel');

// ------------------ USERS ------------------
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ------------------ MESSAGES ------------------
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ------------------ COMPLAINTS ------------------
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('assignedTo', 'name email department');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.put("/complaints/:id/assign", async (req, res) => {
  try {
    const { workerId } = req.body;
    const worker = await WorkerModel.findById(workerId);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: worker._id, status: "In Progress" }, // ✅ match frontend
      { new: true }
    ).populate("assignedTo", "name email department");

    if (!updatedComplaint) return res.status(404).json({ error: "Complaint not found" });

    res.json({ message: "Worker assigned", complaint: updatedComplaint });
  } catch (err) {
    console.error("Error assigning worker:", err);
    res.status(500).json({ error: "Failed to assign worker" });
  }
});


// ------------------ WORKERS ------------------
router.get('/workers', async (req, res) => {
  try {
    const workers = await WorkerModel.find({}, '-password').sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

router.post('/workers', async (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const existingWorker = await WorkerModel.findOne({ email });
    if (existingWorker) return res.status(400).json({ message: 'Worker already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new WorkerModel({ name, email, password: hashedPassword, department });
    await newWorker.save();

    res.status(201).json({ message: 'Worker registered successfully', worker: newWorker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register worker' });
  }
});

module.exports = router;
