// src/components/Grievance.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Grievance.css';

const Grievance = () => {
  const navigate = useNavigate();
  return (
    <div className="grievance-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h1>Public Grievance and Redressal System</h1>
      </div>

      <div className="card-section">
        <div className="grievance-card">
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="Internet" />
          <h3>Register Your Complaints</h3>
          <p>Register Complaints via Internet</p>
          <button className="action-link" onClick={() =>  navigate('/register-complaint')}>
          Get Started →
          </button>

        </div>

        {/* <div className="grievance-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png" alt="Phone" />
          <h3>Register Complaint via Phone</h3>
          <p>Call 1913 to register your complaint.</p>
          <button className="action-link" onClick={() => window.location.href = 'tel:1913'}>
          Call Now →
          </button>
        </div> */}

        <div className="grievance-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3242/3242257.png" alt="Paper" />
          <h3>Complaint via Paper Form</h3>
          <p>
            Send to: The Commissioner,<br />
            Tirunelveli City Municipal Corporation,<br />
            S.N. High Road, Tirunelveli - 627001, Tamil Nadu, India.
          </p>
        </div>
      </div>

      {/* <div className="status-check">
        <h3>Check Your Complaint Status</h3>
        <div className="radio-options">
          <label><input type="radio" name="method" defaultChecked /> Check by Complaint Number</label>
          <label><input type="radio" name="method" /> Check by Mobile Number</label>
        </div>
        <input type="text" placeholder="Enter Complaint Number" className="input-box" />
        <button className="check-btn">Check Now →</button>
      </div> */}

      <footer className="footer-bar">
        Public Grievance System provided to Greater Nellai Corporation.
      </footer>
    </div>
  );
};

export default Grievance;
