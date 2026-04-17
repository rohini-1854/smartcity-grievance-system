import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api_config';

const HistoryPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')); // logged-in user

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/complaints/user/${user.email}`);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load your complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (!user) return <p>Please login to see your complaints.</p>;
  if (loading) return <p>Loading your complaints...</p>;

  return (
    <div>
      <h2>📝 My Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Location</th>
              <th>Department</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c._id}>
                <td>{c.issueType}</td>
                <td>{c.location}</td>
                <td>{c.department || '-'}</td>
                <td>{c.status}</td>
                <td>{c.assignedTo ? c.assignedTo.name : '-'}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPage;
