// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../api_config';
import './AdminDashboard.css';
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [workerData, setWorkerData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'inprogress', 'resolved'
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerForm, setWorkerForm] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });

const navigate = useNavigate();
  useEffect(() => {
    
    const fetchAllData = async () => {
      try {
        const usersRes = await axios.get(API_ENDPOINTS.ADMIN.USERS);
        setUsers(usersRes.data);

        const messagesRes = await axios.get(API_ENDPOINTS.ADMIN.MESSAGES);
        setMessages(messagesRes.data);

        const workersRes = await axios.get(API_ENDPOINTS.ADMIN.WORKERS);
        setWorkerData(workersRes.data);

        const complaintsRes  = await axios.get(`${API_BASE_URL}/api/admin/complaints`);
        setComplaints(complaintsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAllData();
  }, []);

  const assignWorker = async (complaintId, workerId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/complaints/${complaintId}/assign`, { workerId });
      const updatedComplaints = await axios.get(`${API_BASE_URL}/api/admin/complaints`);
      setComplaints(updatedComplaints.data);
      alert("✅ Worker assigned successfully!");
    } catch (error) {
      console.error('Error assigning worker:', error);
      alert("❌ Failed to assign worker");
    }
  };
  // Handle Worker Registration
  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.WORKERS.SIGNUP || `${API_BASE_URL}/api/workers/signup`, workerForm);
      alert("✅ Worker registered successfully!");
      setShowWorkerForm(false);
      setWorkerForm({ name: "", email: "", password: "", department: "" });

      // refresh worker data
      const workersRes = await axios.get(API_ENDPOINTS.ADMIN.WORKERS);
      setWorkerData(workersRes.data);
    } catch (error) {
      console.error("Error registering worker:", error);
      alert("❌ Failed to register worker");
    }
  };
  
  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/complaints/${complaintId}/status`, { status: newStatus });
      
      // Option 1: Refresh all complaints
      const updatedComplaints = await axios.get(`${API_BASE_URL}/api/admin/complaints`);
      setComplaints(updatedComplaints.data);
      
      // Option 2 (better): Update only this complaint in state
      // setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: newStatus } : c));
      
      alert(`✅ Complaint marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      alert("❌ Failed to update status");
    }
  };

  const handleLogout = () => {
  // Optional: clear any auth tokens if stored
  localStorage.removeItem("adminToken"); // if you are storing token
  navigate("/auth"); // redirect to auth/login page
};


// 🔽 Filter complaints based on statusFilter
  const filteredComplaints =
  statusFilter === "all"
    ? complaints
    : complaints.filter((c) => {
        const statusDB = c.status.toLowerCase().replace(/\s+/g, '');
        const filterStatus = statusFilter.toLowerCase().replace(/\s+/g, '');
        return statusDB === filterStatus;
      });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📋 Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card" onClick={() => setActiveTab("users")}>
          <h3>👤 Users</h3>
          <p>{users.length} Registered</p>
        </div>
        <div className="card" onClick={() => setActiveTab("workers")}>
          <h3>👷 Workers</h3>
          <p>{workerData.length} Registered</p>
        </div>
        <div className="card" onClick={() => navigate("/admin/complaints")}>
          <h3>🚨 Complaints</h3>
          <p>{complaints.length} Submitted</p>
        </div>
        <div className="card" onClick={() => setActiveTab("manage")}>
          <h3>🛠 Manage</h3>
          <p>Feedback & Messages</p>
        </div>
      </div>

      {/* Manage Section */}
      {activeTab === "manage" && (
        <div className="manage-cards">
          <div className="manage-card" onClick={() => setActiveTab("feedback")}>
            <h3>💬 User Feedback</h3>
            <p>View all user feedback messages</p>
          </div>
          <div className="manage-card" onClick={() => setActiveTab("workermessages")}>
            <h3>📨 Worker Message Box</h3>
            <p>View all messages from workers</p>
          </div>
        </div>
      )}

      {/* User Feedback Messages */}
      {activeTab === "feedback" && (
        <section>
          <h2 style={{ color: '#1d3557', fontWeight: 600 }}>💬 User Feedback</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>User Email</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Feedback</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Sent At</th>
                </tr>
              </thead>
              <tbody>
              {messages.length > 0 ? (
                messages
                  .filter((m) => m.role === "user") //  only show user feedback
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) //  latest first
                  .map((m) => (
                    <tr key={m._id}>
                      <td>{m.email ? `${m.name || ""} (${m.email})` : "—"}</td>
                      <td>{m.message}</td>
                      <td>{new Date(m.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
              ) : (
  
                  <tr>
                    <td colSpan="3">No feedback messages.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Worker Message Box */}
      {activeTab === "workermessages" && (
        <section>
          <h2 style={{ color: '#1d3557', fontWeight: 600 }} >📨 Worker Messages</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Worker Name / Email</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Message</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {messages.filter(m => m.role === "worker").length > 0 ? (
                  messages
                    .filter(m => m.role === "worker")
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((m) => (
                      <tr key={m._id}>
                        <td>{m.name ? `${m.name} (${m.email})` : m.email}</td>
                        <td>{m.message}</td>
                        <td>{new Date(m.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3">No messages from workers.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}


      {/* Users Table */}
      {activeTab === "users" && (
        <section>
          <h2 style={{ color: '#1d3557', fontWeight: 600 }} >🧑‍💻 Registered Users</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Name</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Email</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Signup Time</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : 'No date'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Workers Table */}
      {activeTab === "workers" && (
        <section>
          <h2 style={{ color: '#1d3557', fontWeight: 600 }} >👷‍♂️ Registered Workers</h2>
          <button 
            className="add-worker-btn" 
            onClick={() => setShowWorkerForm(true)}
          >
            ➕ Add Worker
          </button>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Name</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Email</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Department</th>
                  <th style={{ color: 'black', fontWeight: 'bold' }}>Signup Time</th>
                </tr>
              </thead>
              <tbody>
                {workerData.length > 0 ? (
                  workerData.map((worker, index) => (
                    <tr key={index}>
                      <td>{worker.name}</td>
                      <td>{worker.email}</td>
                      <td>{worker.department || '—'}</td>
                      <td>{worker.createdAt ? new Date(worker.createdAt).toLocaleString() : 'No date'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No workers registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Worker Registration Modal */}
          {showWorkerForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>➕ Register New Worker</h3>
                <form onSubmit={handleWorkerSubmit}>
                  <input 
                    type="text" 
                    placeholder="Worker Name" 
                    value={workerForm.name} 
                    onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })} 
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Worker Email" 
                    value={workerForm.email} 
                    onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })} 
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={workerForm.password} 
                    onChange={(e) => setWorkerForm({ ...workerForm, password: e.target.value })} 
                    required
                  />
                  <select
                    value={workerForm.department}
                    onChange={(e) => setWorkerForm({ ...workerForm, department: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Roads">Roads & Transport</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Healthcare">Health Care</option>
                    <option value="Public Works">Public Works</option>
                  </select>

                  <div className="modal-actions">
                    <button type="submit">✅ Register</button>
                    <button type="button" onClick={() => setShowWorkerForm(false)}>❌ Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </section>
      )}
      
      {/* Complaints Table */}
      {/* {activeTab === "complaints" && (
        <section>
          <h2>🚨 Complaints</h2>
          <div style={{ marginBottom: "10px" }}>
            <button onClick={() => setStatusFilter('all')}>All</button>
            <button onClick={() => setStatusFilter('pending')}>Pending</button>
            <button onClick={() => setStatusFilter('inprogress')}>In Progress</button>
            <button onClick={() => setStatusFilter('resolved')}>Resolved</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Department</th>
                <th>Status</th>
                <th>Assign Worker</th>
                <th>Assigned To</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((comp) => (
                  <tr key={comp._id}>
                    <td>{comp.userEmail}</td>
                    <td>{comp.issueType}</td>
                    <td>
                      {comp.street ? `${comp.street}, ` : ""}
                      {comp.town ? `${comp.town}, ` : ""}
                      {comp.pincode ? comp.pincode : ""}
                      <br />
                      {comp.latitude && comp.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${comp.latitude},${comp.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue", textDecoration: "underline" }}
                        >
                          📍 View Map
                        </a>
                      ) : (
                        comp.location || "—"
                      )}
                    </td>
                    <td>{comp.department || "—"}</td>
                    <td>{comp.status}</td>
                    <td>
                      {comp.assignedTo ? (
                        "Assigned"
                      ) : (
                        <select
                          onChange={(e) => assignWorker(comp._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Worker
                          </option>
                          {workerData
                            .filter((worker) => worker.department === comp.department)
                            .map((worker) => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name}
                              </option>
                            ))}
                        </select>
                      )}
                    </td>
                    <td>{comp.assignedTo ? comp.assignedTo.name : "—"}</td>
                    <td>{new Date(comp.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No complaints submitted.</td>
                </tr>
              )}
            </tbody>

          </table>
        </section>
      )} */}
      {activeTab === "complaints" && (
      <section>
        <h2>🚨 Complaints</h2>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => setStatusFilter('all')}>All</button>
          <button onClick={() => setStatusFilter('pending')}>Pending</button>
          <button onClick={() => setStatusFilter('inprogress')}>In Progress</button>
          <button onClick={() => setStatusFilter('resolved')}>Resolved</button>
        </div>

        <div className="grid-container">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((comp) => (
              <div className="grid-card" key={comp._id}>
                <h3>{comp.issueType}</h3>
                <p><b>User:</b> {comp.userEmail}</p>
                <p><b>Location:</b> {comp.street}, {comp.town}, {comp.pincode}</p>
                <p><b>Status:</b> {comp.status}</p>
                <p><b>Department:</b> {comp.department}</p>
                {comp.assignedTo ? (
                  <p><b>Assigned To:</b> {comp.assignedTo.name}</p>
                ) : (
                  <select onChange={(e) => assignWorker(comp._id, e.target.value)} defaultValue="">
                    <option value="" disabled>Select Worker</option>
                    {workerData
                      .filter(worker => worker.department === comp.department)
                      .map(worker => (
                        <option key={worker._id} value={worker._id}>{worker.name}</option>
                      ))}
                  </select>
                )}
                {/* 🔽 Status Update Buttons */}
                <div className="status-buttons">
                  <button onClick={() => updateComplaintStatus(comp._id, "Pending")}>
                     Pending
                  </button>
                  <button onClick={() => updateComplaintStatus(comp._id, "In Progress")}>
                     In Progress
                  </button>
                  <button onClick={() => updateComplaintStatus(comp._id, "Resolved")}>
                    Resolved
                  </button>
                </div>
                <p><b>Submitted:</b> {new Date(comp.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No complaints submitted.</p>
          )}
        </div>
      </section>
    )}

    </div>
  );
};

export default AdminDashboard;

