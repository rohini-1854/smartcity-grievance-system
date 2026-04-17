// // WorkerPage.js
// import React, { useState } from 'react';
// import './Workerpage.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const WorkerPage = () => {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = isSignIn ? '/worker/login' : '/worker/signup';

//     try {
//       const res = await axios.post(`http://localhost:5000${url}`, formData);

//       if (isSignIn) {
//         if (res.data.success) {
//           localStorage.setItem("worker", JSON.stringify(res.data.worker));
//           navigate('/service'); // Go to Service Page
//         } else {
//           alert(res.data.message || 'Login failed');
//         }
//       } else {
//         alert(res.data.message || 'Worker registered successfully');
//         setIsSignIn(true); // switch to login after signup
//       }

//     } catch (err) {
//       alert(err.response?.data?.message || 'Error occurred');
//     }
//   };

//   return (
//     <div className="worker-container">
//       <h2>{isSignIn ? "Worker Sign In" : "Worker Sign Up"}</h2>
//       <form onSubmit={handleSubmit}>
//         {!isSignIn && (
//           <input
//             name="name"
//             type="text"
//             placeholder="Name"
//             onChange={handleChange}
//             required
//           />
//         )}
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">{isSignIn ? "Login" : "Register"}</button>
//       </form>
//       <p onClick={() => setIsSignIn(!isSignIn)} className="toggle-link">
//         {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
//       </p>
//     </div>
//   );
// };

// export default WorkerPage;

// // ServicePage.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ServicePage.css";

// const ServicePage = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Get logged-in worker
//   let worker = null;
//   try {
//     const savedWorker = localStorage.getItem("worker");
//     if (savedWorker && savedWorker !== "undefined") {
//       worker = JSON.parse(savedWorker);
//     }
//   } catch (error) {
//     console.error("Failed to parse worker from localStorage:", error);
//     worker = null;
//   }

//   useEffect(() => {
//     if (!worker) {
//       navigate("/auth");
//       return;
//     }

//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/complaints");
//         setComplaints(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load complaints");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, [worker, navigate]);

//   if (!worker) return null;
//   if (loading) return <h3>Loading complaints...</h3>;

//   const updateStatus = async (complaintId, status) => {
//     try {
//       await axios.put(`http://localhost:5000/complaints/${complaintId}/status`, { status });
//       const res = await axios.get("http://localhost:5000/complaints");
//       setComplaints(res.data);
//       alert("Status updated successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="service-page">
//       {/* Welcome message */}
//       <h2>Welcome, {worker.name || worker.email} 👋</h2>

//       {complaints.length === 0 ? (
//         <p>No complaints found</p>
//       ) : (
//         <div className="complaints-container">
//           {complaints.map((c) => {
//             // Check if complaint is assigned to the logged-in worker
//             const isAssignedToMe =
//               c.assignedTo?.email?.trim().toLowerCase() === worker.email?.trim().toLowerCase();

//             return (
//               <div
//                 key={c._id}
//                 className={`complaint-card ${isAssignedToMe ? "highlight" : ""}`}
//               >
//                 <p><strong>User Email:</strong> {c.userEmail}</p>
//                 <p><strong>Issue:</strong> {c.issueType}</p>
//                 <p><strong>Location:</strong> {c.location || "—"}</p>
//                 <p><strong>Department:</strong> {c.department || "—"}</p>
//                 <p><strong>Status:</strong> {c.status}</p>
//                 <p>
//                   <strong>Assigned To:</strong>{" "}
//                   {c.assignedTo ? c.assignedTo.email : "Not assigned yet"}
//                   {isAssignedToMe && (
//                     <span className="assigned-badge">🔔 Assigned to YOU!</span>
//                   )}
//                 </p>

//                 <div className="status-buttons">
//                   <button onClick={() => updateStatus(c._id, "Pending")}>Pending</button>
//                   <button onClick={() => updateStatus(c._id, "In Progress")}>In Progress</button>
//                   <button onClick={() => updateStatus(c._id, "Resolved")}>Resolved</button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServicePage;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../api_config";
import MapComponent from "./MapComponent"; // Make sure this path is correct
import "./ServicePage.css";

const ServicePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [visibleMapIds, setVisibleMapIds] = useState([]);

  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("worker");
  navigate("/home");
};

  // Get logged-in worker
  let worker = null;
  try {
    const savedWorker = localStorage.getItem("worker");
    if (savedWorker && savedWorker !== "undefined") {
      worker = JSON.parse(savedWorker);
    }
  } catch (error) {
    console.error("Failed to parse worker from localStorage:", error);
    worker = null;
  }

  useEffect(() => {
    if (!worker) {
      navigate("/auth");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINTS.COMPLAINTS.BASE}/assigned/${worker._id}`
        );
        // Sort assigned tasks on top
        const sorted = res.data.sort((a, b) =>
          a.assignedTo?.email === worker.email ? -1 : 1
        );
        setComplaints(sorted);
      } catch (err) {
        console.error(err);
        alert("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [worker, navigate]);

  if (!worker) return null;
  if (loading) return <h3>Loading complaints...</h3>;

  const updateStatus = async (complaintId, status) => {
    if (!window.confirm(`Are you sure you want to change status to "${status}"?`))
      return;

    try {
      await axios.put(
        `${API_ENDPOINTS.COMPLAINTS.BASE}/${complaintId}/status`,
        { status }
      );
      const res = await axios.get(
        `${API_ENDPOINTS.COMPLAINTS.BASE}/assigned/${worker._id}`
      );
      setComplaints(res.data);
      alert("Status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const toggleMap = (id) => {
    if (visibleMapIds.includes(id)) {
      setVisibleMapIds(visibleMapIds.filter((mapId) => mapId !== id));
    } else {
      setVisibleMapIds([...visibleMapIds, id]);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.issueType.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesDept = departmentFilter === "All" || c.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
  <div className="service-page">
    <div className="service-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>
        Welcome, {worker.name || worker.email} 👋
        {worker.department ? ` - ${worker.department}` : ""}
      </h2>
      <button onClick={handleLogout} style={{ padding: "6px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Logout
      </button>
    </div>

      {/* Search & Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Issue, Location, or User Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Electricity">Electricity</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Roads">Roads</option>
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        <div className="complaints-container">
          {filteredComplaints.map((c) => {
            const isAssignedToMe =
              c.assignedTo?.email?.trim().toLowerCase() ===
              worker.email?.trim().toLowerCase();

            return (
              <div
                key={c._id}
                className={`complaint-card ${isAssignedToMe ? "highlight" : ""} ${
                  c.department
                }`}
              >
                <p>
                  <strong>User Email:</strong> {c.userEmail}
                </p>
                <p>
                  <strong>Issue:</strong> {c.issueType}
                </p>
                <p>
                  <strong>Location:</strong> {c.location || "—"}
                </p>
                <p>
                  <strong>Department:</strong> {c.department || "—"}
                </p>

                <div className="status-buttons">
                  <button
                    className={`status-btn Pending ${
                      c.status === "Pending" ? "active" : ""
                    }`}
                    onClick={() => updateStatus(c._id, "Pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`status-btn In-Progress ${
                      c.status === "In Progress" ? "active" : ""
                    }`}
                    onClick={() => updateStatus(c._id, "In Progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className={`status-btn Resolved ${
                      c.status === "Resolved" ? "active" : ""
                    }`}
                    onClick={() => updateStatus(c._id, "Resolved")}
                  >
                    Resolved
                  </button>
                </div>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {c.assignedTo ? c.assignedTo.email : "Not assigned yet"}
                  {isAssignedToMe && (
                    <span className="assigned-badge">🔔 Assigned to YOU!</span>
                  )}
                </p>

                {/* View Map toggle button */}
                <button
                  className="view-map-btn"
                  onClick={() => toggleMap(c._id)}
                  style={{ margin: "10px 0" }}
                >
                  {visibleMapIds.includes(c._id) ? "Hide Map" : "View Map"}
                </button>

                {/* Conditionally render map */}
                {visibleMapIds.includes(c._id) && c.latitude && c.longitude && (
                  <div
                    style={{
                      height: "250px",
                      width: "100%",
                      marginBottom: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <MapComponent
                      formData={{
                        latitude: c.latitude,
                        longitude: c.longitude,
                        street: c.address || "",
                        town: "",
                        pincode: "",
                      }}
                      setFormData={() => {}}
                    />
                  </div>
                )}

                {/* View Details */}
                <details>
                  <summary>View Details</summary>
                  <p>{c.description}</p>

                  {/* Show uploaded image if exists */}
                  {c.image && (
                    <div className="complaint-image">
                      <p><strong>Attached Image:</strong></p>
                      <img
                        src={`${API_BASE_URL}${c.image}`} // backend serves /uploads
                        alt="Complaint Evidence"
                        className="task-img"
                        style={{
                          maxWidth: "100%",
                          margin: "10px 0",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                </details>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicePage;
