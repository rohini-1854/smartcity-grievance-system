// File: routes/userRoutes.js
const express = require("express");
const router = express.Router();
const Complaint = require("../models/ComplaintModel");

// GET /api/complaints/user/:email
// Optional query params: date=YYYY-MM-DD, complaintNumber=xxx
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { date, complaintNumber } = req.query;

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    let filter = { userEmail: email };

    // Filter by complaint number if provided
    if (complaintNumber) {
      filter.complaintNumber = complaintNumber;
    }

    // Filter by date if provided
    if (date) {
      // Match complaints created on that specific date
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email department")
      .sort({ createdAt: -1 }); // latest first

    res.json(complaints);
  } catch (err) {
    console.error("Failed to fetch user complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

module.exports = router;
