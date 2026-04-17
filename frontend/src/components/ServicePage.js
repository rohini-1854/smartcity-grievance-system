// ServicePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../api_config";
import "./ServicePage.css";

const ServicePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");


  const navigate = useNavigate();

  let worker = null;
  try {
    const savedWorker = localStorage.getItem("worker");
    if (savedWorker && savedWorker !== "undefined") worker = JSON.parse(savedWorker);
  } catch (err) {
    worker = null;
  }

  useEffect(() => {
    if (!worker) {
      navigate("/auth");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.COMPLAINTS.BASE}/assigned/${worker._id}`);
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [worker, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("worker");
    navigate("/auth");
  };

  if (!worker) return null;
  if (loading) return <h3>Loading complaints...</h3>;

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    try {
      await axios.put(`${API_ENDPOINTS.COMPLAINTS.BASE}/${id}/status`, { status });
      const res = await axios.get(`${API_ENDPOINTS.COMPLAINTS.BASE}/assigned/${worker._id}`);
      setComplaints(res.data);
      alert("Status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.issueType.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus ;
  });

  return (
    <div className="service-page">
      <div className="top-navbar">
        <h2>{worker.name || worker.email} {worker.department && `- ${worker.department}`}</h2>
        <div className="nav-right">
          <button onClick={handleLogout}>Logout</button>
          <button
            onClick={() => navigate("/worker-feedback")}
            style={{ backgroundColor: "#4CAF50", color: "white", marginLeft: "10px" }}
          >
            📝 Send Feedback
          </button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by Issue, Location, or User Email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

      </div>

      {filteredComplaints.length === 0 ? <p>No complaints found</p> :
        <div className="complaints-container">
          {filteredComplaints.map(c => (
            <div key={c._id} className={`complaint-card ${c.department}`}>
              <p><strong>User Email:</strong> {c.userEmail}</p>
              <p><strong>Phone:</strong> {c.phone || "—"}</p>
              <p><strong>Issue:</strong> {c.issueType}</p>
              <p><strong>Location:</strong> {c.location || "—"}</p>
              <p><strong>Area:</strong> {c.street || "—"}</p>
              <p><strong>Department:</strong> {c.department || "—"}</p>
              <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  backgroundColor:
                    c.status === "Pending"
                      ? "#f0ad4e"
                      : c.status === "In Progress"
                      ? "#5bc0de"
                      : c.status === "Resolved"
                      ? "#5cb85c"
                      : "#777",
                  color: "white", // text color
                  padding: "3px 8px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}
              >
                {c.status}
              </span>
            </p>
              <div className="status-buttons">
                {["Pending","In Progress","Resolved"].map(status => (
                  <button
                    key={status}
                    className={`status-btn ${status.replace(" ","-")} ${c.status === status ? "active" : ""}`}
                    onClick={() => updateStatus(c._id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <p>
                <strong>Assigned To:</strong>{" "}
                <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  Assigned to you
                </span>
              </p>


              <details>
                <summary>View Details</summary>
                <p>{c.description}</p>
                {c.image &&
                  <div className="complaint-image">
                    <p><strong>Attached Image:</strong></p>
                    <img src={`${API_BASE_URL}${c.image}`} alt="Complaint Evidence" className="task-img"/>
                  </div>
                }
              </details>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default ServicePage;
