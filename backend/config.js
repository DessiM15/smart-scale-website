// Smart Scale Backend Configuration
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT Secret (change this to a secure random string in production)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  
  // Admin Credentials (change these in production)
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'smartscale2024',
  
  // Database
  DB_PATH: process.env.DB_PATH || './database/portfolio.db',
  
  // File Upload
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880, // 5MB
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

