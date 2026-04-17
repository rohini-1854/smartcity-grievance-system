// WorkerFeedbackForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../api_config";
import "./MessageForm.css";

function WorkerFeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const workerData = localStorage.getItem("worker");
    if (workerData && workerData !== "undefined") {
      const worker = JSON.parse(workerData);
      setForm({ name: worker.name, email: worker.email, message: "" });
    } else {
      // Redirect if not logged in as worker
      window.location.href = "/auth";
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.MESSAGES.BASE, {
        ...form,
        role: "worker", // mark as worker feedback
      });
      setSuccess("✅ Feedback sent successfully!");
      setForm({ ...form, message: "" });
    } catch (err) {
      console.error(err);
      setSuccess("❌ Failed to send feedback");
    }
  };

  return (
    <div className="message-container">
      <h3>👷 Worker Feedback</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={form.name} disabled />
        <input type="email" name="email" value={form.email} disabled />
        <textarea
          name="message"
          placeholder="Type your feedback or report..."
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

export default WorkerFeedbackForm;
