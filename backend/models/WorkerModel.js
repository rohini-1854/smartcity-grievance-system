// WorkerModel.js
const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hash this before saving
  department: { type: String, required: true }, // e.g., "Electricity", "Public Works"
  status: { type: String, default: "Inactive" }, 
  leaveStatus: { type: String, default: "Working" }  // ✅ Working / Week Leave / 1 Month Leave
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
