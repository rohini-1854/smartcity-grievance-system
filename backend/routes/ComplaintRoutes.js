// File: backend/routes/ComplaintRoutes.js
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/ComplaintModel');
const Worker = require('../models/WorkerModel');

// ------------------ Multer Config ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ------------------ Create Complaint ------------------
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const {
      userEmail, department, issueType, description,
      phone, zone, ward, street, town, pincode,
      latitude, longitude,
    } = req.body;

    if (!userEmail) return res.status(400).json({ error: 'User email is required' });

    // Generate complaint number
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const complaintNumber = `CMP${datePart}${randomPart}`;

    const complaint = new Complaint({
      complaintNumber,
      userEmail,
      department,
      issueType,
      description,
      phone,
      location: `${zone} - Ward ${ward}`,
      wardNo: ward,
      street,
      town,
      pincode,
      latitude,
      longitude,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      imageType: req.file ? req.file.mimetype : null,
      createdAt: new Date(),
    });

    await complaint.save();
    res.status(201).json({
      message: 'Complaint registered successfully',
      complaintNumber: complaint.complaintNumber,
      data: complaint
    });
  } catch (err) {
    console.error('Error saving complaint:', err);
    res.status(500).json({ error: 'Failed to register complaint' });
  }
});

// ------------------ Get All Complaints (Admin) ------------------
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// ------------------ Get Complaints Assigned to Worker ------------------
router.get('/assigned/:workerId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.params.workerId })
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    if (!complaints.length) return res.status(404).json({ message: 'No complaints found for this worker' });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch worker complaints' });
  }
});

// ------------------ Assign Complaint to Worker ------------------
router.put('/:id/assign', async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: workerId, status: 'Assigned' },
      { new: true }
    ).populate('assignedTo', 'name email department');

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    res.json({ message: 'Complaint assigned successfully', complaint });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign complaint' });
  }
});

// ------------------ Update Complaint Status ------------------
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ message: 'Status updated successfully', complaint });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ------------------ Get Complaints by User Email ------------------
router.get('/user/:email', async (req, res) => {
  try {
    const userComplaints = await Complaint.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email department');
    res.json(userComplaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user complaints' });
  }
});

// ------------------ Track Complaint ------------------
router.get('/track', async (req, res) => {
  const { query } = req.query;
  try {
    const complaints = await Complaint.find({
      $or: [
        { complaintNumber: query },
        { userEmail: query },
        { phone: query }
      ]
    })
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// File: routes/complaints.js
router.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    // Directly search by userEmail instead of user._id
    const complaints = await Complaint.find({ userEmail: email })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching user complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});


module.exports = router;
