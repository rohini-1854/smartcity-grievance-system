
// RegisterComplaint.js
import React, { useState, useRef, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { API_ENDPOINTS } from "../api_config";
import "./RegisterComplaint.css";

// Zones & wards
const zones = {
  THACHANALLUR: [1, 2, 3, 4, 10, 11, 12, 13, 14, 28, 29, 30],
  PALAYAMKOTTAI: [5, 6, 7, 8, 9, 32, 33, 34, 35, 36, 37, 38, 39, 55],
  MELAPALAYAM: [31, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
  TIRUNELVELI: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
};

const departments = {
  "Public Works": ["Road Damage", "Street Light Issue", "Potholes", "Sidewalk Damage", "Traffic Sign Issue", "Bus Stop Damage"],
  "Water Supply": ["No Water", "Leakage", "Low Pressure", "Contaminated Water", "Pipe Burst"],
  "Sanitation": ["Garbage Not Collected", "Drain Blockage", "Sewage Overflow", "Odor Complaint"],
  "Electricity": ["Power Cut", "Wire Down", "Meter Issue", "Flickering Lights", "Transformer Issue"],
  "Roads & Transport": ["Bus Shelter Damage", "Signage Issue", "Potholes", "Traffic Signal Issue", "Road Markings Faded"],
  "Healthcare": ["Hospital Cleanliness", "Medical Staff Shortage", "Ambulance Delay", "Equipment Malfunction", "Vaccination Issue"],
};


export default function RegisterComplaint() {
  const steps = ["Personal Details",  "Complaint", "Location","Review"];
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: localStorage.getItem("userEmail") || "", 
    phone: "",
    town: "", // personal detail town
    street: "",
    pincode: "",
    zone: "",
    ward: "",
    // latitude: 8.7139, // default Tirunelveli
    // longitude: 77.7567,
    department: "",
    issueType: "",
    description: "",
    media: null,
  });

  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userPhone = localStorage.getItem("userPhone");

    if (!userEmail) {
      alert("❌ Please login or register to submit a complaint!");
      navigate("/auth?mode=user&redirect=/register-complaint");
    } else {
      setFormData(prev => ({
        ...prev,
        email: userEmail || "",
        name: userName || "",
        phone: userPhone || "",
      }));
    }
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // For file inputs
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      return;
    }

    // Update zone/ward
    if (name === "zone") {
      setFormData(prev => ({ ...prev, zone: value, ward: "" }));
      return;
    }

    if (name === "ward") {
      setFormData(prev => ({ ...prev, ward: value }));
      return;
    }

    // Update normal inputs
    setFormData(prev => ({ ...prev, [name]: value }));

    // Save name and phone to localStorage automatically
    if (name === "name") localStorage.setItem("userName", value);
    if (name === "phone") localStorage.setItem("userPhone", value);
  };


  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    const userEmail = localStorage.getItem("userEmail") || formData.email;
    data.append("userEmail", userEmail);
    try {
      const res = await fetch(API_ENDPOINTS.COMPLAINTS.BASE, {
        method: "POST",
        body: data,
      });
      let result;
      try {
        result = await res.json(); // ✅ only once
      } catch {
        return alert("❌ Invalid server response");
      }

      if (!res.ok) {
        return alert("❌ " + (result.error || "Server error"));
      }

      alert(`✅ Complaint registered! Number: ${result.complaintNumber}`);

      // reset form
      setStep(1);
      setFormData({
        name: localStorage.getItem("userName") || "", email: localStorage.getItem("userEmail") || "", phone: localStorage.getItem("userPhone") || "", town: "", pincode: "",
        zone: "", ward: "", latitude: 8.7139, longitude: 77.7567,
        department: "", issueType: "", description: "", media: null
      });
      if (fileRef.current) fileRef.current.value = null;

    } catch (err) {
      console.error(err);
      alert("❌ Server error"); // only triggers if backend really down
    }
 };

  return (
    <div className="complaint-container">
      <h2>📍 Register Complaint - Tirunelveli</h2>

      {/* Step Progress */}
      <div className="steps-indicator">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          let statusClass =
            stepNumber < step
              ? "completed"
              : stepNumber === step
              ? "active"
              : "pending";
          return (
            <div key={label} className={`step-item ${statusClass}`}>
              <div className="step-number">{statusClass === "completed" ? "✓" : stepNumber}</div>
              <div className="step-label">{label}</div>
              {index !== steps.length - 1 && <div className="step-line"></div>}
            </div>
          );
        })}
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div>
          <h3>Step 1: Personal Details</h3>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} readOnly />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="town" placeholder="Town / City" value={formData.town} onChange={handleChange} required />
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Step 2: Complaint */}
      {step === 2 && (
        <div>
          <h3>Step 2: Complaint</h3>
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {Object.keys(departments).map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          <select name="issueType" value={formData.issueType} onChange={handleChange} required>
            <option value="">Select Issue</option>
            {departments[formData.department]?.map((issue) => (
              <option key={issue} value={issue}>{issue}</option>
            ))}
          </select>
          <textarea name="description" placeholder="Describe the issue" value={formData.description} onChange={handleChange} required />
          <input type="file" name="media" accept="image/*,video/*" onChange={handleChange} ref={fileRef} />
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}



      {/* Step 3: Location */}
      {step === 3 && (
        <div>
          <h3>Step 3: Location</h3>

          {/* Zone & Ward */}
          <select name="zone" value={formData.zone} onChange={handleChange} required>
            <option value="">Select Zone</option>
            {Object.keys(zones).map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>

          <select name="ward" value={formData.ward} onChange={handleChange} required>
            <option value="">Select Ward</option>
            {zones[formData.zone]?.map((ward) => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>

          {/* Manual address inputs */}
          <input
            type="text"
            name="street"
            placeholder="Street / Area"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="town"
            placeholder="Town / City"
            value={formData.town}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

{/*          
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                      ...prev,
                      latitude,
                      longitude
                    }));
                  },
                  (err) => alert("Unable to get your location: " + err.message)
                );
              } else {
                alert("Geolocation is not supported by your browser");
              }
            }}
          >
          </button> */}

          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div>
          <h3>Step 4: Review</h3>
          <div className="table-wrapper">
            <table>
              <tbody>
                {Object.entries(formData).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v?.name || v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
