// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ViewHistory = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       const email = localStorage.getItem('userEmail');
//       if (!email) {
//         setError('User not logged in');
//         return;
//       }

//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints/user', {
//           params: { email },
//         });
//         setComplaints(res.data);
//         if (res.data.length === 0) setError('No complaints found.');
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch complaints');
//       }
//     };

//     fetchComplaints();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Your Complaint History</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {complaints.length > 0 ? (
//         <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
//           <thead style={{ background: '#f5f5f5' }}>
//             <tr>
//               <th>Complaint Number</th>
//               <th>Issue</th>
//               <th>Department</th>
//               <th>Status</th>
//               <th>Assigned Worker</th>
//               <th>Time</th>
//               <th>Image</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.map((c) => (
//               <tr key={c._id}>
//                 <td>{c.complaintNumber}</td>
//                 <td>{c.issueType}</td>
//                 <td>{c.department}</td>
//                 <td>{c.status}</td>
//                 <td>{c.assignedTo ? c.assignedTo.name : 'Not assigned'}</td>
//                 <td>{new Date(c.createdAt).toLocaleString()}</td>
//                 <td>
//                   {c.image ? (
//                     <a
//                       href={`http://localhost:5000${c.image}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <img
//                         src={`http://localhost:5000${c.image}`}
//                         alt="Complaint"
//                         style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
//                       />
//                     </a>
//                   ) : (
//                     'No image'
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No complaints found.</p>
//       )}
//     </div>
//   );
// };

// export default ViewHistory;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api_config';
import './ViewHistory.css'; // 👈 add this

const ViewHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError('User not logged in');
        return;
      }

      try {
        const res = await axios.get(`${API_ENDPOINTS.COMPLAINTS.BASE}/user`, {
          params: { email },
        });
        setComplaints(res.data);
        if (res.data.length === 0) setError('No complaints found.');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="history-container">
      <h2 style={{ color: '#1d3557' }}>Your Complaint History</h2>
      {error && <p className="error">{error}</p>}

      {complaints.length > 0 ? (
        <div className="grid-container"   
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 cards per row
            gap: "20px",
            marginTop: "20px",
          }} >
          {complaints.map((c) => (
            <div key={c._id} className="complaint-card">
              <p><strong>Complaint No:</strong> {c.complaintNumber}</p>
              <p><strong>Issue:</strong> {c.issueType}</p>
              <p><strong>Department:</strong> {c.department}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p><strong>Assigned Worker:</strong> {c.assignedTo ? c.assignedTo.name : 'Not assigned'}</p>
              <p><strong>Time:</strong> {new Date(c.createdAt).toLocaleString()}</p>
              {c.image ? (
                <a
                  href={`http://localhost:5000${c.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${API_BASE_URL}${c.image}`}
                    alt="Complaint"
                    className="complaint-img"
                  />
                </a>
              ) : (
                <p>No image</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default ViewHistory;
