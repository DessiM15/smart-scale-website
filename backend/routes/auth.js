const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');
const config = require('../config');

// POST /api/auth/login - Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Find user in database
  db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Update last login
      db.run('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });
    });
  });
});

// POST /api/auth/verify - Verify token
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Verify user still exists
    db.get('SELECT id, username FROM admin_users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Token verification failed' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      res.json({
        valid: true,
        user: {
          id: user.id,
          username: user.username
        }
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/change-password - Change admin password
router.post('/change-password', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { currentPassword, newPassword } = req.body;
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Get user and verify current password
    db.get('SELECT * FROM admin_users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Password change failed' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      // Verify current password
      bcrypt.compare(currentPassword, user.password_hash, (err, isMatch) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({ error: 'Password change failed' });
        }
        
        if (!isMatch) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Hash new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Password hashing error:', err);
            return res.status(500).json({ error: 'Password change failed' });
          }
          
          // Update password
          db.run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id], (err) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Password change failed' });
            }
            
            res.json({ message: 'Password changed successfully' });
          });
        });
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

