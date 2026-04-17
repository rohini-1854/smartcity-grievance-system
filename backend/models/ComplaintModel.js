const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintNumber: { type: String, unique: true },
  userEmail: String,
  department: String,
  issueType: String,
  description: String,
  phone: String,
  location: String, // you can keep as "zone - ward" or full address
  wardNo: String,
  street: String,    // new
  town: String,      // new
  pincode: String,   // new
  latitude: Number,  // new
  longitude: Number, // new
  image: String,
  imageType: String,
  status: { type: String, default: "Pending" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
complaintSchema.pre("save", function (next) {
  if (!this.complaintNumber) {
    this.complaintNumber = "CMP-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);

