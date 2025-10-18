# Smart Scale Portfolio Management System

A complete backend admin system for managing portfolio projects with a modern, responsive frontend.

## 🚀 Features

### Backend Admin System
- **Secure Authentication** - JWT-based admin login
- **Project Management** - Full CRUD operations for portfolio projects
- **Image Upload** - Automatic image handling and optimization
- **Database** - SQLite database with automatic initialization
- **REST API** - Clean API endpoints for all operations
- **Security** - Rate limiting, CORS protection, input validation

### Frontend Integration
- **Dynamic Portfolio** - Projects load automatically from API
- **Responsive Design** - Works on all devices
- **Loading States** - Professional loading and error handling
- **Real-time Updates** - Changes appear immediately on website

## 📁 Project Structure

```
Project 1/
├── index.html              # Main website (updated with dynamic portfolio)
├── about.html              # About page
├── services.html           # Services page
├── tech.html              # Tech stack page
├── admin/
│   └── index.html         # Admin dashboard
├── backend/
│   ├── server.js          # Main server file
│   ├── config.js          # Configuration
│   ├── package.json       # Dependencies
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── projects.js    # Project management routes
│   ├── database/
│   │   └── init.js        # Database initialization
│   └── uploads/           # Image upload directory
└── README.md              # This file
```

## 🛠️ Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
npm start
```

The server will start on `http://localhost:3001`

### 3. Access the Admin Dashboard

Open your browser and go to:
```
http://localhost:3001/admin
```

**Default Login Credentials:**
- Username: `admin`
- Password: `smartscale2024`

⚠️ **Important:** Change these credentials in production!

### 4. View Your Website

Open your main website:
```
http://localhost:3000/index.html
```

The portfolio section will now load projects dynamically from the API.

## 🔧 Configuration

### Backend Configuration

Edit `backend/config.js` to customize:

```javascript
module.exports = {
  PORT: 3001,                    // Server port
  JWT_SECRET: 'your-secret-key', // Change this!
  ADMIN_USERNAME: 'admin',       // Admin username
  ADMIN_PASSWORD: 'password',    // Admin password
  UPLOAD_PATH: './uploads',      // Image upload directory
  MAX_FILE_SIZE: 5242880,        // 5MB max file size
  CORS_ORIGIN: 'http://localhost:3000'
};
```

### API Endpoints

#### Public Endpoints
- `GET /api/projects` - Get all active projects
- `GET /api/health` - Health check

#### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify token
- `GET /api/projects/admin` - Get all projects (including inactive)
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 📊 Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  features TEXT NOT NULL,
  live_url TEXT,
  image_url TEXT,
  image_alt TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

## 🎨 Admin Dashboard Features

### Project Management
- **Add Projects** - Upload images, set details, configure display order
- **Edit Projects** - Update any project information
- **Delete Projects** - Remove projects with confirmation
- **Toggle Visibility** - Activate/deactivate projects
- **Drag & Drop** - Reorder projects (coming soon)

### Image Handling
- **Automatic Upload** - Images are processed and stored securely
- **Format Support** - JPEG, PNG, GIF, WebP
- **Size Limits** - 5MB maximum file size
- **Optimization** - Images are served efficiently

### Security Features
- **JWT Authentication** - Secure token-based login
- **Rate Limiting** - Prevents abuse
- **Input Validation** - All inputs are sanitized
- **File Type Checking** - Only images allowed
- **CORS Protection** - Configured for your domain

## 🔄 Adding New Projects

1. **Login to Admin Dashboard**
   - Go to `http://localhost:3001/admin`
   - Use your admin credentials

2. **Click "Add New Project"**
   - Fill in project details
   - Upload project image
   - Set category and features
   - Configure display order

3. **Save Project**
   - Project appears immediately on your website
   - No need to edit HTML files

## 🚀 Deployment

### Production Setup

1. **Change Default Credentials**
   ```javascript
   // In config.js
   ADMIN_USERNAME: 'your-secure-username',
   ADMIN_PASSWORD: 'your-secure-password',
   JWT_SECRET: 'your-very-secure-random-string'
   ```

2. **Set Environment Variables**
   ```bash
   export NODE_ENV=production
   export PORT=3001
   export JWT_SECRET=your-secure-secret
   ```

3. **Update CORS Origin**
   ```javascript
   CORS_ORIGIN: 'https://yourdomain.com'
   ```

4. **Start with PM2 (Recommended)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "smart-scale-backend"
   pm2 startup
   pm2 save
   ```

### Frontend Deployment

Update the API URL in your frontend:
```javascript
// In index.html, change:
const API_BASE_URL = 'https://yourdomain.com/api';
```

## 🛡️ Security Best Practices

1. **Change Default Passwords** - Never use default credentials in production
2. **Use HTTPS** - Always use SSL certificates in production
3. **Regular Backups** - Backup your database regularly
4. **Monitor Logs** - Keep an eye on server logs
5. **Update Dependencies** - Keep packages up to date

## 📱 Mobile Responsive

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Future Enhancements

- [ ] Drag & drop project reordering
- [ ] Bulk project operations
- [ ] Project analytics
- [ ] Email notifications
- [ ] Multi-user support
- [ ] Project templates
- [ ] SEO optimization tools

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Database Issues**
```bash
# Delete database to reset
rm backend/database/portfolio.db
# Restart server to recreate
```

**Image Upload Fails**
- Check file size (must be under 5MB)
- Ensure file is an image (JPEG, PNG, GIF, WebP)
- Check upload directory permissions

**API Connection Issues**
- Ensure backend server is running
- Check CORS configuration
- Verify API URL in frontend

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Ensure all dependencies are installed
4. Verify configuration settings

---

**Smart Scale Portfolio Management System** - Built with ❤️ for professional web design businesses.

