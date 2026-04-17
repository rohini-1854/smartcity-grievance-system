// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import './MessageForm.css'; // Make sure path is correct


// // function MessageForm() {
// //   const [form, setForm] = useState({ name: '', message: '' });
// //   const [success, setSuccess] = useState('');

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const res = await axios.post('http://localhost:5000/api/messages', form);
// //     setSuccess(`✅ ${res.data.message}`);
// //     setForm({ name: '', message: '' });
// //   } catch (err) {
// //     console.error(err);
// //     setSuccess('❌ Failed to send message');
// //   }
// // };

// //   return (
// //     <div className="message-container">
// //       <h3>Send a Message</h3>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           name="name"
// //           placeholder="Your Name"
// //           value={form.name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <textarea
// //           name="message"
// //           placeholder="Type your message..."
// //           value={form.message}
// //           onChange={handleChange}
// //           required
// //         />
// //         <button type="submit">Submit</button>
// //       </form>
// //       {success && <p>{success}</p>}
// //     </div>
// //   );
// // }

// // export default MessageForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./MessageForm.css";

// function MessageForm() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   const [role, setRole] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     // 🔹 Check if worker is logged in
//     const worker = localStorage.getItem("worker");
//     if (worker && worker !== "undefined") {
//       const parsed = JSON.parse(worker);
//       setRole("worker");
//       setForm((prev) => ({ ...prev, name: parsed.name, email: parsed.email }));
//       return;
//     }

//     // 🔹 Else check if user is logged in
//     const user = localStorage.getItem("userEmail");
//     if (user) {
//       setRole("user");
//       setForm((prev) => ({ ...prev, email: user }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:5000/api/messages", {
//         ...form,
//         role,
//       });
//       setSuccess(`✅ ${res.data.message}`);
//       setForm({ name: "", email: "", message: "" });
//     } catch (err) {
//       console.error(err);
//       setSuccess("❌ Failed to send feedback");
//     }
//   };

//   if (!role) return <p>Loading feedback form...</p>; // prevent showing wrong role

//   return (
//     <div className="message-container">
//       <h3>Send Feedback ({role})</h3>
//       <form onSubmit={handleSubmit}>
//         {role === "user" && (
//           <input
//             name="name"
//             placeholder="Your Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//         )}
//         <input
//           type="email"
//           name="email"
//           placeholder="Your Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           disabled // email comes from login, not editable
//         />
//         <textarea
//           name="message"
//           placeholder="Type your feedback..."
//           value={form.message}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//       {success && <p>{success}</p>}
//     </div>
//   );
// }

// export default MessageForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../api_config";
import "./MessageForm.css";

function MessageForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // ✅ Check if user is logged in
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsUser(true);
      setForm((prev) => ({ ...prev, email: userEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API_ENDPOINTS.MESSAGES.BASE, {
        ...form,
        role: "user", // always user feedback
      });
      setSuccess(`✅ ${res.data.message}`);
      setForm({ name: "", email: form.email, message: "" });
    } catch (err) {
      console.error(err);
      setSuccess("❌ Failed to send feedback");
    }
  };

  if (!isUser) {
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
        ⚠️ Only users can send feedback. Please log in as a user.
      </p>
    );
  }

  return (
    <div className="message-container">
      <h3>🙋‍♀️ User Feedback</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Your Email"
          disabled
        />
        <textarea
          name="message"
          placeholder="Type your feedback or complaint..."
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Feedback</button>
      </form>
      {success && <p className="success-text">{success}</p>}
    </div>
  );
}

export default MessageForm;
