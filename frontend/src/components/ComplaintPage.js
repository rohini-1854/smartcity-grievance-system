// // // ComplaintPage.js
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./ComplaintPage.css";

// // const ComplaintPage = () => {
// //   const [complaints, setComplaints] = useState([]);
// //   const [department, setDepartment] = useState("");
// //   const [filteredComplaints, setFilteredComplaints] = useState([]);
// //   const [workers, setWorkers] = useState([]);
// //   const [statusFilter, setStatusFilter] = useState("All");

// //   useEffect(() => {
// //     fetchComplaints();
// //     fetchWorkers();
// //   }, []);

// //   const fetchComplaints = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/complaints");
// //       const sorted = res.data.sort(
// //         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// //       );
// //       setComplaints(sorted);
// //       setFilteredComplaints(sorted);
// //     } catch (error) {
// //       console.error("Error fetching complaints:", error);
// //     }
// //   };

// //   const fetchWorkers = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/workers");
// //       setWorkers(res.data);
// //     } catch (error) {
// //       console.error("Error fetching workers:", error);
// //     }
// //   };

// //   const handleDepartmentChange = (e) => {
// //     const selectedDept = e.target.value;
// //     setDepartment(selectedDept);

// //     if (!selectedDept) {
// //       setFilteredComplaints(complaints);
// //     } else {
// //       const filtered = complaints.filter(
// //         (c) => c.department.toLowerCase() === selectedDept.toLowerCase()
// //       );
// //       setFilteredComplaints(filtered);
// //     }
// //   };

// //   const handleStatusFilter = (status) => {
// //     setStatusFilter(status);
// //   };

// //   // Assign worker to complaint
// //   const assignWorker = async (complaintId, workerId) => {
// //     if (!workerId) return;
// //     const confirmed = window.confirm("Are you sure to assign this worker?");
// //     if (!confirmed) return;

// //     try {
// //       await axios.put(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
// //         workerId,
// //       });
// //       fetchComplaints();
// //     } catch (error) {
// //       console.error("Error assigning worker:", error);
// //     }
// //   };

// //   // Update complaint status
// //   const updateComplaintStatus = async (id, newStatus) => {
// //     try {
// //       await axios.put(`http://localhost:5000/api/complaints/${id}`, {
// //         status: newStatus,
// //       });
// //       fetchComplaints();
// //     } catch (error) {
// //       console.error("Error updating status:", error);
// //     }
// //   };

// //   // Filter complaints by status
// //   const filteredByStatus = filteredComplaints.filter((c) => {
// //     if (statusFilter === "All") return true;
// //     if (statusFilter === "Pending") return c.status === "Pending";
// //     if (statusFilter === "InProgress") return c.status === "In Progress";
// //     if (statusFilter === "Resolved") return c.status === "Resolved";
// //     return true;
// //   });

// //   return (
// //     <div className="complaint-page">
// //       <h2>Complaint Management Dashboard</h2>

// //       <div className="filter-bar">
// //         <label>Choose Department: </label>
// //         <select value={department} onChange={handleDepartmentChange}>
// //           <option value="">-- Select Department --</option>
// //           <option value="Public Works">Public Works</option>
// //           <option value="Healthcare">Healthcare</option>
// //           <option value="Roads & Transport">Roads & Transport</option>
// //           <option value="Water Supply">Water Supply</option>
// //         </select>

// //         <div className="status-buttons">
// //           <button onClick={() => handleStatusFilter("All")}>All</button>
// //           <button onClick={() => handleStatusFilter("Pending")}>Pending</button>
// //           <button onClick={() => handleStatusFilter("InProgress")}>In Progress</button>
// //           <button onClick={() => handleStatusFilter("Resolved")}>Resolved</button>
// //         </div>
// //       </div>

// //       <div className="table-wrapper">
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>S.No</th>
// //               <th>Date & Time</th>
// //               <th>User Details</th>
// //               <th>Department / Issue</th>
// //               <th>Status</th>
// //               <th>Assigned Worker</th>
// //               <th>Assign Worker</th>
// //               <th>Change Status</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredByStatus.length > 0 ? (
// //               filteredByStatus.map((c, index) => (
// //                 <tr key={c._id}>
// //                   <td>{index + 1}</td>
// //                   <td>
// //                     {new Date(c.createdAt).toLocaleDateString()}
// //                     <br />
// //                     {new Date(c.createdAt).toLocaleTimeString()}
// //                   </td>
// //                   <td>
// //                     <strong>{c.user?.name || c.userName || c.userEmail}</strong>
// //                     <br />
// //                     📞 {c.user?.phone || c.phone}
// //                     <br />
// //                     Zone - Ward: {c.zone} - {c.ward}
// //                     <br />
// //                     Address - Street: {c.street}
// //                     <br />
// //                     Area: {c.area}
// //                     <br />
// //                     Pincode: {c.pincode}
// //                   </td>
// //                   <td>
// //                     {c.department} <br />
// //                     <strong>{c.issueType}</strong>
// //                   </td>
// //                   <td>
// //                     <span
// //                       className={`status-badge ${
// //                         c.status === "Resolved"
// //                           ? "status-resolved"
// //                           : c.status === "In Progress"
// //                           ? "status-inprogress"
// //                           : c.status === "Assigned"
// //                           ? "status-assigned"
// //                           : "status-pending"
// //                       }`}
// //                     >
// //                       {c.status}
// //                     </span>
// //                   </td>
// //                   <td>
// //                     {c.assignedTo ? (
// //                       <>
// //                         {c.assignedTo.name} (
// //                         {
// //                           complaints.filter(
// //                             (cmp) =>
// //                               cmp.assignedTo?._id === c.assignedTo._id &&
// //                               cmp.status !== "Resolved"
// //                           ).length
// //                         }
// //                         /5)
// //                       </>
// //                     ) : (
// //                       "-"
// //                     )}
// //                   </td>
// //                   <td>
// //                     <select
// //                       onChange={(e) => assignWorker(c._id, e.target.value)}
// //                       defaultValue=""
// //                     >
// //                       <option value="">Assign Worker</option>
// //                       {workers
// //                         .filter((w) => w.department === c.department)
// //                         .map((w) => {
// //                           const assignedCount = complaints.filter(
// //                             (cmp) =>
// //                               cmp.assignedTo?._id === w._id &&
// //                               cmp.status !== "Resolved"
// //                           ).length;

// //                           return (
// //                             <option
// //                               key={w._id}
// //                               value={w._id}
// //                               disabled={assignedCount >= 5}
// //                             >
// //                               {w.name} ({assignedCount}/5)
// //                             </option>
// //                           );
// //                         })}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <div className="status-change-btns">
// //                       <button
// //                         className="btn-assign"
// //                         onClick={() => updateComplaintStatus(c._id, "Assigned")}
// //                       >
// //                         Assigned
// //                       </button>
// //                       <button
// //                         className="btn-pending"
// //                         onClick={() => updateComplaintStatus(c._id, "Pending")}
// //                       >
// //                         Pending
// //                       </button>
// //                       <button
// //                         className="btn-inprogress"
// //                         onClick={() =>
// //                           updateComplaintStatus(c._id, "In Progress")
// //                         }
// //                       >
// //                         In Progress
// //                       </button>
// //                       <button
// //                         className="btn-resolved"
// //                         onClick={() => updateComplaintStatus(c._id, "Resolved")}
// //                       >
// //                         Resolved
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="8">No complaints found for this department</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ComplaintPage;


// // ComplaintPage.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ComplaintPage.css";

// const ComplaintPage = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [department, setDepartment] = useState("");
//   const [filteredComplaints, setFilteredComplaints] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("All");

//   useEffect(() => {
//     fetchComplaints();
//     fetchWorkers();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/complaints");
//       const sorted = res.data.sort(
//         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//       );
//       setComplaints(sorted);
//       setFilteredComplaints(sorted);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//   };

//   const fetchWorkers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/workers");
//       setWorkers(res.data);
//     } catch (error) {
//       console.error("Error fetching workers:", error);
//     }
//   };

//   const handleDepartmentChange = (e) => {
//     const selectedDept = e.target.value;
//     setDepartment(selectedDept);

//     if (!selectedDept) {
//       setFilteredComplaints(complaints);
//     } else {
//       const filtered = complaints.filter(
//         (c) => c.department.toLowerCase() === selectedDept.toLowerCase()
//       );
//       setFilteredComplaints(filtered);
//     }
//   };

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
//   };

//   // Assign worker to complaint
//   const assignWorker = async (complaintId, workerId) => {
//     if (!workerId) return;
//     const confirmed = window.confirm("Are you sure to assign this worker?");
//     if (!confirmed) return;

//     try {
//       await axios.put(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
//         workerId,
//       });
//       fetchComplaints();
//     } catch (error) {
//       console.error("Error assigning worker:", error);
//     }
//   };

//   // Filter complaints by status
//   const filteredByStatus = filteredComplaints.filter((c) => {
//     if (statusFilter === "All") return true;
//     if (statusFilter === "Pending") return c.status === "Pending";
//     if (statusFilter === "InProgress") return c.status === "In Progress";
//     if (statusFilter === "Resolved") return c.status === "Resolved";
//     return true;
//   });

//   return (
//     <div className="complaint-page">
//       <h2>Complaint Management Dashboard</h2>

//       <div className="filter-bar">
//         <label>Choose Department: </label>
//         <select value={department} onChange={handleDepartmentChange}>
//           <option value="">-- Select Department --</option>
//           <option value="Public Works">Public Works</option>
//           <option value="Healthcare">Healthcare</option>
//           <option value="Roads & Transport">Roads & Transport</option>
//           <option value="Water Supply">Water Supply</option>
//         </select>

//         <div className="status-buttons">
//           <button onClick={() => handleStatusFilter("All")}>All</button>
//           <button onClick={() => handleStatusFilter("Pending")}>Pending</button>
//           <button onClick={() => handleStatusFilter("InProgress")}>In Progress</button>
//           <button onClick={() => handleStatusFilter("Resolved")}>Resolved</button>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Date & Time</th>
//               <th>User Details</th>
//               <th>Department / Issue</th>
//               <th>Status</th>
//               <th>Assigned Worker</th>
//               <th>Assign Worker</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredByStatus.length > 0 ? (
//               filteredByStatus.map((c, index) => (
//                 <tr key={c._id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     {new Date(c.createdAt).toLocaleDateString()}
//                     <br />
//                     {new Date(c.createdAt).toLocaleTimeString()}
//                   </td>
//                   <td>
//                     <strong>{c.user?.name || c.userName || c.userEmail}</strong>
//                     <br />
//                     📞 {c.user?.phone || c.phone}
//                     <br />
//                     Zone : {c.location || "—"}
//                     <br />
//                     Address - Street: {c.street}
//                     <br />
//                     Town / Area: {c.town || "—"}
//                     <br />
//                     Pincode: {c.pincode}
//                   </td>
//                   <td>
//                     {c.department} <br />
//                     <strong>{c.issueType}</strong>
//                   </td>
//                   <td>
//                     <span
//                       className={`status-badge ${
//                         c.status === "Resolved"
//                           ? "status-resolved"
//                           : c.status === "In Progress"
//                           ? "status-inprogress"
//                           : c.status === "Assigned"
//                           ? "status-assigned"
//                           : "status-pending"
//                       }`}
//                     >
//                       {c.status}
//                     </span>
//                   </td>
//                   <td>
//                     {c.assignedTo ? (
//                       <>
//                         {c.assignedTo.name} (
//                         {
//                           complaints.filter(
//                             (cmp) =>
//                               cmp.assignedTo?._id === c.assignedTo._id &&
//                               cmp.status !== "Resolved"
//                           ).length
//                         }
//                         /5)
//                       </>
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                   <td>
//                     <select
//                       onChange={(e) => assignWorker(c._id, e.target.value)}
//                       defaultValue=""
//                     >
//                       <option value="">Assign Worker</option>
//                       {workers
//                         .filter((w) => w.department === c.department)
//                         .map((w) => {
//                           const assignedCount = complaints.filter(
//                             (cmp) =>
//                               cmp.assignedTo?._id === w._id &&
//                               cmp.status !== "Resolved"
//                           ).length;

//                           return (
//                             <option
//                               key={w._id}
//                               value={w._id}
//                               disabled={assignedCount >= 5}
//                             >
//                               {w.name} ({assignedCount}/5)
//                             </option>
//                           );
//                         })}
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7">No complaints found for this department</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ComplaintPage;


// ComplaintPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../api_config";
import "./ComplaintPage.css";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [department, setDepartment] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  

  useEffect(() => {
    fetchComplaints();
    fetchWorkers();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.COMPLAINTS.BASE);
      const sorted = res.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComplaints(sorted);
      setFilteredComplaints(sorted);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.WORKERS.BASE);
      setWorkers(res.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setDepartment(selectedDept);

    if (!selectedDept) {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(
        (c) => c.department.toLowerCase() === selectedDept.toLowerCase()
      );
      setFilteredComplaints(filtered);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // Assign worker to complaint
  const assignWorker = async (complaintId, workerId) => {
    if (!workerId) return;
    const confirmed = window.confirm("Are you sure to assign this worker?");
    if (!confirmed) return;

    try {
      await axios.put(`${API_ENDPOINTS.COMPLAINTS.BASE}/${complaintId}/assign`, {
        workerId,
      });
      fetchComplaints();
    } catch (error) {
      console.error("Error assigning worker:", error);
    }
  };

  // Filter complaints by status
  const filteredByStatus = filteredComplaints.filter((c) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "NotAssigned") return !c.assignedTo;
    if (statusFilter === "Assigned") return c.assignedTo && c.status !== "In Progress" && c.status !== "Resolved";
    if (statusFilter === "Pending") return c.assignedTo && c.status !== "In Progress" && c.status !== "Resolved";
    if (statusFilter === "InProgress") return c.status === "In Progress";
    if (statusFilter === "Resolved") return c.status === "Resolved";
    return true;
  });


  return (
    <div className="complaint-page">
      <h2>Complaint Management Dashboard</h2>

      <div className="filter-bar">
        <label>Choose Department: </label>
        <select value={department} onChange={handleDepartmentChange}>
          <option value="">-- Select Department --</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Roads & Transport">Roads & Transport</option>
          <option value="Electricity">Electricity</option>
          <option value="Public Works">Public Works</option>
        </select>


        <div className="status-buttons">
          <button onClick={() => handleStatusFilter("All")}>All</button>
          <button onClick={() => handleStatusFilter("Pending")}>Pending</button>
          <button onClick={() => handleStatusFilter("InProgress")}>In Progress</button>
          <button onClick={() => handleStatusFilter("Resolved")}>Resolved</button>
          <button onClick={() => handleStatusFilter("Assigned")}>Assigned</button>
          <button onClick={() => handleStatusFilter("NotAssigned")}>Not Assigned</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date & Time</th>
              <th>User Details</th>
              <th>Department / Issue</th>
              <th>Status</th>
              <th>Assigned Worker</th>
              <th>Assign Worker</th>
            </tr>
          </thead>
          <tbody>
            {filteredByStatus.length > 0 ? (
              filteredByStatus.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(c.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(c.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <strong>{c.user?.name || c.userName || c.userEmail}</strong>
                    <br />
                    📞 {c.user?.phone || c.phone}
                    <br />
                    Zone : {c.location || "—"}
                    <br />
                    Address - Street: {c.street}
                    <br />
                    Town / Area: {c.town || "—"}
                    <br />
                    Pincode: {c.pincode}
                  </td>
                  <td>
                    {c.department} <br />
                    <strong>{c.issueType}</strong>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        !c.assignedTo
                          ? "status-notassigned"
                          : c.status === "Resolved"
                          ? "status-resolved"
                          : c.status === "In Progress"
                          ? "status-inprogress"
                          : "status-assigned" // worker assigned but not started yet
                      }`}
                    >
                      {!c.assignedTo
                        ? "Not Assigned"
                        : c.status === "Resolved"
                        ? "Resolved"
                        : c.status === "In Progress"
                        ? "In Progress"
                        : "Pending"} 
                    </span>
                  </td>
                  <td>
                    {c.assignedTo ? (
                      <>
                        {c.assignedTo.name} (
                        {
                          complaints.filter(
                            (cmp) =>
                              cmp.assignedTo?._id === c.assignedTo._id &&
                              cmp.status !== "Resolved"
                          ).length
                        }
                        /5)
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {c.status === "Resolved" ? (
                      "-"
                    ) : (
                    <select
                      onChange={(e) => assignWorker(c._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Assign Worker</option>
                      {workers
                        .filter((w) => w.department === c.department)
                        .map((w) => {
                          const assignedCount = complaints.filter(
                            (cmp) => cmp.assignedTo?._id === w._id && cmp.status !== "Resolved"
                          ).length;

                          return { ...w, assignedCount };
                        })
                        // 🔽 Sort so recently assigned workers appear last
                        .sort((a, b) => a.assignedCount - b.assignedCount)
                        .map((w) => (
                          <option key={w._id} value={w._id} disabled={w.assignedCount >= 5}>
                            {w.name} ({w.assignedCount}/5)
                          </option>
                        ))}
                    </select>

                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No complaints found for this department</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintPage;
