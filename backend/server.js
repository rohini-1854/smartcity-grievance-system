const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const User = require('./models/UserModel');
const Worker = require('./models/WorkerModel');
const Message = require('./models/MessageModel');
const workerRoutes = require('./routes/workerRoutes');
const ComplaintRoutes = require('./routes/ComplaintRoutes');
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/authroutes'); // adjust filename exactly
const messageRoutes = require('./routes/messageRoutes'); // check exact filename
const geoRoutes = require('./routes/GeoRoutes');
const userRoutes = require('./routes/userRoutes');

console.log('workerRoutes:', typeof workerRoutes);
console.log('ComplaintRoutes:', typeof ComplaintRoutes);
console.log('taskRoutes:', typeof taskRoutes);
console.log('adminRoutes:', typeof adminRoutes);
console.log('authRoutes:', typeof authRoutes);
console.log('messageRoutes:', typeof messageRoutes);
console.log('geoRoutes:', typeof geoRoutes);

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:8081', 
  'http://192.168.29.225:19006',
  process.env.FRONTEND_URL // Will be set in production
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/tasks", taskRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);      // for signup/signin
app.use('/api/messages', messageRoutes); // messages API
app.use('/api/complaints', ComplaintRoutes); 
app.use('/api/workers', workerRoutes);
app.use('/api', userRoutes);
app.use('/api', geoRoutes);


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grievancesystem';
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));



// Admin Login
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = 'admin@collegeproject.com';
  const adminPassword = 'Secure@123';

  if (email === adminEmail && password === adminPassword) {
    return res.json({ success: true, role: 'admin' });
  } else {
    return res.status(401).json({ message: 'Invalid Admin Credentials' });
  }
});

// Save Message
app.post('/api/messages', async (req, res) => {
  const { name, message } = req.body;
  try {
    const newMessage = new Message({ userEmail: name, message });
    await newMessage.save();
    res.json({ message: 'Message saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});



// ---------------------- ADMIN ROUTES ----------------------

app.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/admin/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/admin/workers', async (req, res) => {
  try {
    const workers = await Worker.find({}, '-password').sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


