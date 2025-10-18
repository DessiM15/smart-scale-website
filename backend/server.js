const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { initDatabase, insertSampleProjects } = require('./database/init');

// Import routes
const projectsRouter = require('./routes/projects');
const authRouter = require('./routes/auth');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Smart Scale Backend...');
    
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');
    
    // Insert sample projects
    await insertSampleProjects();
    console.log('✅ Sample data ready');
    
    // Start server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`🌟 Smart Scale Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Admin login: http://localhost:${PORT}/admin`);
      console.log(`📁 Upload directory: ${path.resolve(config.UPLOAD_PATH)}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Smart Scale Backend...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Smart Scale Backend...');
  process.exit(0);
});

startServer();

