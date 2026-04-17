// Centralized API configuration for the Smart City Grievance System
// In development, this uses localhost:5000
// In production, this uses the URL defined in your deployment settings (e.g., Vercel)

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
  },
  COMPLAINTS: {
    BASE: `${API_BASE_URL}/api/complaints`,
  },
  WORKERS: {
    LOGIN: `${API_BASE_URL}/api/workers/login`,
    BASE: `${API_BASE_URL}/api/workers`,
  },
  MESSAGES: {
    BASE: `${API_BASE_URL}/api/messages`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/api`, // includes /users etc
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    MESSAGES: `${API_BASE_URL}/admin/messages`,
    WORKERS: `${API_BASE_URL}/admin/workers`,
  }
};

export { API_BASE_URL, API_ENDPOINTS };
