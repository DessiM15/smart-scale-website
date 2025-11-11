#!/usr/bin/env python3
"""
Smart Scale Portfolio Management Backend
A simple Python Flask server for managing portfolio projects
"""

import os
import json
import sqlite3
import hashlib
import secrets
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import base64

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
DATABASE = 'database/portfolio.db'
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Admin credentials (change these in production!)
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'smartscale2024'
JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('database', exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def init_database():
    """Initialize the database with tables and sample data"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create projects table
    cursor.execute('''
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
    ''')
    
    # Create admin users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    ''')
    
    # Check if admin user exists
    cursor.execute('SELECT COUNT(*) FROM admin_users')
    if cursor.fetchone()[0] == 0:
        # Create default admin user
        password_hash = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
        cursor.execute('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', 
                      (ADMIN_USERNAME, password_hash))
        print(f"[INFO] Default admin user created: {ADMIN_USERNAME}")
    
    # Check if projects exist
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        # Insert sample projects
        sample_projects = [
            {
                'title': 'Arbor Cove Funding',
                'description': 'A boutique business funding brokerage needed a professional, conversion-focused website to establish credibility and capture qualified leads.',
                'category': 'FINANCIAL SERVICES',
                'features': 'Lead qualification forms, Custom branding, Mobile-responsive',
                'live_url': 'https://preview--arborcove-capital-connect.lovable.app/',
                'image_url': 'assets/arbor-cove-screenshot.png',
                'image_alt': 'Arbor Cove Funding custom website design',
                'display_order': 1
            },
            {
                'title': 'Law Office of Sylvester R. Jaime',
                'description': 'A professional law practice needed a clean, authoritative website to attract clients and showcase legal expertise.',
                'category': 'LEGAL SERVICES',
                'features': 'Professional design, Easy navigation, Contact integration',
                'live_url': 'https://preview--sylvester-jaime-website.lovable.app/',
                'image_url': 'assets/sylvester-jaime-screenshot.png',
                'image_alt': 'Law office website design by Smart Scale',
                'display_order': 2
            }
        ]
        
        for project in sample_projects:
            cursor.execute('''
                INSERT INTO projects (title, description, category, features, live_url, image_url, image_alt, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project['title'], project['description'], project['category'],
                project['features'], project['live_url'], project['image_url'],
                project['image_alt'], project['display_order']
            ))
        
        print("[INFO] Sample projects inserted")
    
    conn.commit()
    conn.close()
    print("[INFO] Database initialized successfully")

def verify_token(token):
    """Simple token verification (in production, use proper JWT)"""
    # For simplicity, we'll use a basic token system
    # In production, implement proper JWT verification
    return token == JWT_SECRET

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
        'environment': 'development'
    })

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all active projects (public endpoint)"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, title, description, category, features, live_url, image_url, image_alt, display_order
        FROM projects 
        WHERE is_active = 1 
        ORDER BY display_order ASC, created_at DESC
    ''')
    
    projects = []
    for row in cursor.fetchall():
        project = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'features': row[4].split(', ') if row[4] else [],
            'live_url': row[5],
            'image_url': row[6],
            'image_alt': row[7],
            'display_order': row[8]
        }
        projects.append(project)
    
    conn.close()
    return jsonify(projects)

@app.route('/api/projects/admin', methods=['GET'])
def get_projects_admin():
    """Get all projects (admin endpoint)"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not verify_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC')
    
    projects = []
    for row in cursor.fetchall():
        project = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'features': row[4].split(', ') if row[4] else [],
            'live_url': row[5],
            'image_url': row[6],
            'image_alt': row[7],
            'display_order': row[8],
            'is_active': bool(row[9]),
            'created_at': row[10],
            'updated_at': row[11]
        }
        projects.append(project)
    
    conn.close()
    return jsonify(projects)

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Admin login"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    # Verify credentials
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        # Update last login
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE username = ?', (username,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'token': JWT_SECRET,  # Simple token for demo
            'user': {
                'id': 1,
                'username': username
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/verify', methods=['POST'])
def verify_auth():
    """Verify authentication token"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token or not verify_token(token):
        return jsonify({'error': 'Invalid token'}), 401
    
    return jsonify({
        'valid': True,
        'user': {
            'id': 1,
            'username': ADMIN_USERNAME
        }
    })

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Create new project (admin only)"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not verify_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get form data
    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    features = request.form.get('features')
    live_url = request.form.get('live_url')
    image_alt = request.form.get('image_alt')
    display_order = int(request.form.get('display_order', 0))
    
    if not all([title, description, category, features]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Handle file upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to make filename unique
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{int(datetime.now().timestamp())}{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_url = f"/uploads/{filename}"
    
    # Save to database
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO projects (title, description, category, features, live_url, image_url, image_alt, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, category, features, live_url, image_url, image_alt, display_order))
    
    project_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': project_id,
        'message': 'Project created successfully'
    }), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Update project (admin only)"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not verify_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get form data
    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    features = request.form.get('features')
    live_url = request.form.get('live_url')
    image_alt = request.form.get('image_alt')
    display_order = int(request.form.get('display_order', 0))
    is_active = request.form.get('is_active') == 'true'
    
    # Handle file upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{int(datetime.now().timestamp())}{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_url = f"/uploads/{filename}"
    
    # Update database
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    if image_url:
        cursor.execute('''
            UPDATE projects 
            SET title = ?, description = ?, category = ?, features = ?, live_url = ?, 
                image_url = ?, image_alt = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (title, description, category, features, live_url, image_url, image_alt, display_order, is_active, project_id))
    else:
        cursor.execute('''
            UPDATE projects 
            SET title = ?, description = ?, category = ?, features = ?, live_url = ?, 
                image_alt = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (title, description, category, features, live_url, image_alt, display_order, is_active, project_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Project updated successfully'})

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete project (admin only)"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not verify_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Get project to delete associated image
    cursor.execute('SELECT image_url FROM projects WHERE id = ?', (project_id,))
    result = cursor.fetchone()
    
    if not result:
        conn.close()
        return jsonify({'error': 'Project not found'}), 404
    
    # Delete project
    cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    conn.commit()
    conn.close()
    
    # Delete associated image file
    if result[0] and result[0].startswith('/uploads/'):
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], result[0].replace('/uploads/', ''))
        if os.path.exists(image_path):
            os.remove(image_path)
    
    return jsonify({'message': 'Project deleted successfully'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/admin')
def admin_dashboard():
    """Serve admin dashboard"""
    return send_from_directory('..', 'admin/index.html')

if __name__ == '__main__':
    print("[START] Smart Scale Backend")
    init_database()
    print("[INFO] Smart Scale Backend running on http://localhost:3001")
    print("[INFO] Health check: http://localhost:3001/api/health")
    print("[INFO] Admin login: http://localhost:3001/admin")
    print("[INFO] Upload directory: uploads/")
    app.run(host='0.0.0.0', port=3001, debug=True)





