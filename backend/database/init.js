const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure database directory exists
const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(config.DB_PATH);

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
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
        )
      `);

      // Admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `);

      // Insert default admin user if not exists
      db.get('SELECT COUNT(*) as count FROM admin_users', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count === 0) {
          const bcrypt = require('bcryptjs');
          const hashedPassword = bcrypt.hashSync(config.ADMIN_PASSWORD, 10);
          
          db.run(
            'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
            [config.ADMIN_USERNAME, hashedPassword],
            (err) => {
              if (err) {
                reject(err);
              } else {
                console.log('✅ Default admin user created');
                resolve();
              }
            }
          );
        } else {
          console.log('✅ Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Insert sample projects if database is empty
function insertSampleProjects() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (row.count === 0) {
        const sampleProjects = [
          {
            title: 'Arbor Cove Funding',
            description: 'A boutique business funding brokerage needed a professional, conversion-focused website to establish credibility and capture qualified leads.',
            category: 'FINANCIAL SERVICES',
            features: 'Lead qualification forms, Custom branding, Mobile-responsive',
            live_url: 'https://preview--arborcove-capital-connect.lovable.app/',
            image_url: 'assets/arbor-cove-screenshot.png',
            image_alt: 'Arbor Cove Funding custom website design',
            display_order: 1
          },
          {
            title: 'Law Office of Sylvester R. Jaime',
            description: 'A professional law practice needed a clean, authoritative website to attract clients and showcase legal expertise.',
            category: 'LEGAL SERVICES',
            features: 'Professional design, Easy navigation, Contact integration',
            live_url: 'https://preview--sylvester-jaime-website.lovable.app/',
            image_url: 'assets/sylvester-jaime-screenshot.png',
            image_alt: 'Law office website design by Smart Scale',
            display_order: 2
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO projects (title, description, category, features, live_url, image_url, image_alt, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleProjects.forEach(project => {
          stmt.run([
            project.title,
            project.description,
            project.category,
            project.features,
            project.live_url,
            project.image_url,
            project.image_alt,
            project.display_order
          ]);
        });

        stmt.finalize((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Sample projects inserted');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  initDatabase,
  insertSampleProjects
};

