// workerRoutes.js 
const express = require('express');
const bcrypt = require('bcryptjs');
const Worker = require('../models/WorkerModel');
const router = express.Router();

// Worker Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, department } = req.body; // added department
  try {
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) return res.status(400).json({ message: 'Worker already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      department // store department
    });
    await newWorker.save();

    res.status(201).json({ success: true, message: 'Worker registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Worker signup failed' });
  }
});


// Worker Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const worker = await Worker.findOne({ email });
    if (!worker) return res.status(400).json({ success: false, message: "Worker not found" });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

     await Worker.findByIdAndUpdate(worker._id, { status: 'Active', leaveStatus: 'Working' });


    res.status(200).json({
      success: true,
      message: "Login successful",
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        department: worker.department,
        status: 'Active',      // send updated status to frontend
        leaveStatus: 'Working' // send updated leave status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Get all workers (optional department filter)
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const query = department ? { department } : {};
    const workers = await Worker.find(query).select('name email department createdAt');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});


// ✅ Update worker status or leave mode (for Admin or Auto updates)
router.put('/:workerId/status', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { status, leaveStatus } = req.body;

    // Build dynamic update object
    const updateData = {};
    if (status) updateData.status = status;
    if (leaveStatus) updateData.leaveStatus = leaveStatus;

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { $set: updateData },
      { new: true }
    ).select('-password'); // exclude password field

    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({
      message: '✅ Worker status updated successfully',
      worker: updatedWorker
    });
  } catch (error) {
    console.error('Error updating worker status:', error);
    res.status(500).json({ message: '❌ Server error updating worker status' });
  }
});

// ✅ Auto set Active on login (worker)
router.put('/:workerId/active', async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { status: 'Active', leaveStatus: 'Working' },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: '✅ Worker set to Active', worker });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to set active status' });
  }
});

// ✅ Auto set Inactive on logout (worker)
router.put('/:workerId/inactive', async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { status: 'Inactive' },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: '✅ Worker set to Inactive', worker });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to set inactive status' });
  }
});


module.exports = router;