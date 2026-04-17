// File: input-message/frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import AdminDashboard from './components/AdminDashboard';
import MessageForm from './components/MessageForm';
import Home from './components/Home';
import Grievance from './components/Grievance';
import ServicePage from './components/ServicePage';
import RegisterComplaint from './components/RegisterComplaint';
import ViewHistory from './components/ViewHistory';
import TrackComplaint from './components/TrackComplaint';
import ComplaintPage from "./components/ComplaintPage";
import WorkerFeedbackForm from './components/WorkerFeedbackForm';


function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/register-complaint" element={<RegisterComplaint />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/message" element={<MessageForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<ComplaintPage />} />
          <Route path="/servicepage" element={<ServicePage />} />
          <Route path="/worker-feedback" element={<WorkerFeedbackForm />} />
          <Route path="/view-history" element={<ViewHistory />} />

        </Routes>

    </Router>
  );
}

export default App;
