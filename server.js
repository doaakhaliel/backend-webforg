const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

// Create tables if not exists (same as before)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    level TEXT,
    duration TEXT,
    instructor TEXT,
    rating REAL,
    students INTEGER,
    lessons_count INTEGER,
    price INTEGER,
    image_url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    course_id INTEGER,
    title TEXT,
    content TEXT,
    "order" INTEGER,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  )`);
});

// API routes
app.get('/api/courses', (req, res) => {
  db.all(`SELECT * FROM courses`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/courses/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, course) => {
    if (err) res.status(500).json({ error: err.message });
    else if (!course) res.status(404).json({ error: 'Course not found' });
    else {
      db.all(`SELECT * FROM lessons WHERE course_id = ? ORDER BY "order"`, [id], (err, lessons) => {
        course.lessons = lessons || [];
        res.json(course);
      });
    }
  });
});

// Export for Vercel
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
module.exports = app;