// File: TrackComplaint.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../api_config";
import "./TrackComplaint.css";

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchNumber, setSearchNumber] = useState("");

  // Assume logged-in user's email is in localStorage
  const loggedInEmail = localStorage.getItem("userEmail");

  // Fetch complaints for logged-in user only
  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINTS.COMPLAINTS.BASE}/user/${loggedInEmail}`
        );
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComplaints(sorted);
        setFilteredComplaints(sorted);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    if (loggedInEmail) {
      fetchUserComplaints();
    }
  }, [loggedInEmail]);

  // Search by date or complaint number
  const handleSearch = () => {
    let filtered = complaints;

    if (searchDate) {
      const start = new Date(searchDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(searchDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (c) => new Date(c.createdAt) >= start && new Date(c.createdAt) <= end
      );
    }

    if (searchNumber) {
      filtered = filtered.filter(
        (c) =>
          c.complaintNumber.toLowerCase() === searchNumber.toLowerCase().trim()
      );
    }

    setFilteredComplaints(filtered);
  };

  // Reset search
  const handleReset = () => {
    setSearchDate("");
    setSearchNumber("");
    setFilteredComplaints(complaints);
  };

  // Get worker info
  const getWorkerInfo = (worker) => {
    return worker ? `${worker.name} (${worker.email})` : "-";
  };

  return (
    <div className="track-complaint-page">
      <h2>Track Your Complaints</h2>

      <div className="search-bar">
        <div>
          <label>Search by Date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        <div>
          <label>Search by Complaint Number:</label>
          <input
            type="text"
            placeholder="Enter Complaint Number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
        </div>

        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date & Time</th>
              <th>Complaint Number</th>
              <th>Department / Issue</th>
              <th>Status</th>
              <th>Assigned Worker</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(c.createdAt).toLocaleDateString()} <br />
                    {new Date(c.createdAt).toLocaleTimeString()}
                  </td>
                  <td>{c.complaintNumber}</td>
                  <td>
                    {c.department} <br />
                    <strong>{c.issueType}</strong>
                  </td>
                  <td>{c.status || "Pending"}</td>
                  <td>{getWorkerInfo(c.assignedTo)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackComplaint;
