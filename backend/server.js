const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const authRoutes = require('./routes/auth');
const forumRoutes = require('./routes/forum');
const eventsRoutes = require('./routes/events');
const resourcesRoutes = require('./routes/resources');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Indians in Frankfurt Hub API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 
