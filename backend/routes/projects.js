const express = require('express');
const router = express.Router();
const { db } = require('../database/init');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', config.UPLOAD_PATH);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/projects - Get all active projects (public endpoint)
router.get('/', (req, res) => {
  const query = `
    SELECT id, title, description, category, features, live_url, image_url, image_alt, display_order
    FROM projects 
    WHERE is_active = 1 
    ORDER BY display_order ASC, created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
    
    // Parse features string back to array
    const projects = rows.map(project => ({
      ...project,
      features: project.features.split(', ').map(feature => feature.trim())
    }));
    
    res.json(projects);
  });
});

// GET /api/projects/admin - Get all projects (admin endpoint)
router.get('/admin', verifyToken, (req, res) => {
  const query = `
    SELECT * FROM projects 
    ORDER BY display_order ASC, created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
    
    // Parse features string back to array
    const projects = rows.map(project => ({
      ...project,
      features: project.features.split(', ').map(feature => feature.trim())
    }));
    
    res.json(projects);
  });
});

// GET /api/projects/:id - Get single project
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Parse features string back to array
    row.features = row.features.split(', ').map(feature => feature.trim());
    
    res.json(row);
  });
});

// POST /api/projects - Create new project (admin only)
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  const { title, description, category, features, live_url, image_alt, display_order } = req.body;
  
  // Validate required fields
  if (!title || !description || !category || !features) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Handle features array
  const featuresString = Array.isArray(features) ? features.join(', ') : features;
  
  // Handle image upload
  let image_url = null;
  if (req.file) {
    image_url = `/uploads/${req.file.filename}`;
  }
  
  const query = `
    INSERT INTO projects (title, description, category, features, live_url, image_url, image_alt, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    title,
    description,
    category,
    featuresString,
    live_url || null,
    image_url,
    image_alt || null,
    display_order || 0
  ], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create project' });
    }
    
    res.status(201).json({
      id: this.lastID,
      message: 'Project created successfully'
    });
  });
});

// PUT /api/projects/:id - Update project (admin only)
router.put('/:id', verifyToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, category, features, live_url, image_alt, display_order, is_active } = req.body;
  
  // Get existing project to preserve image if no new one uploaded
  db.get('SELECT image_url FROM projects WHERE id = ?', [id], (err, existingProject) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch existing project' });
    }
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Handle features array
    const featuresString = Array.isArray(features) ? features.join(', ') : features;
    
    // Handle image upload
    let image_url = existingProject.image_url;
    if (req.file) {
      // Delete old image if it exists
      if (existingProject.image_url) {
        const oldImagePath = path.join(__dirname, '..', existingProject.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }
    
    const query = `
      UPDATE projects 
      SET title = ?, description = ?, category = ?, features = ?, live_url = ?, 
          image_url = ?, image_alt = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [
      title,
      description,
      category,
      featuresString,
      live_url || null,
      image_url,
      image_alt || null,
      display_order || 0,
      is_active !== undefined ? is_active : 1,
      id
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update project' });
      }
      
      res.json({ message: 'Project updated successfully' });
    });
  });
});

// DELETE /api/projects/:id - Delete project (admin only)
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  
  // Get project to delete associated image
  db.get('SELECT image_url FROM projects WHERE id = ?', [id], (err, project) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete the project
    db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete project' });
      }
      
      // Delete associated image file
      if (project.image_url) {
        const imagePath = path.join(__dirname, '..', project.image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.json({ message: 'Project deleted successfully' });
    });
  });
});

module.exports = router;

