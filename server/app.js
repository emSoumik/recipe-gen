require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

// Validate environment variables
// const requiredEnvVars = ['GOOGLE_GEMINI_API_KEY', 'PORT'];
// const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// if (missingEnvVars.length > 0) {
//   console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
//   process.exit(1);
// }

const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes with prefix
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
