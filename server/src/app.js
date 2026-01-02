const express = require('express');
const cors = require('cors');
const applicationRoutes = require('./routes/application.routes');
const userRoutes = require('./routes/users.routes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Job Application Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    hint: 'Did you mean /api/applications (plural)?'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
