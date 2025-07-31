const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./products.db');

// Create product table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      description TEXT,
      department TEXT
    )
  `);
});

// CSV Upload
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const stmt = db.prepare("INSERT INTO products (name, price, description, department) VALUES (?, ?, ?, ?)");
      results.forEach(p => {
        stmt.run(p.name, p.price, p.description, p.department);
      });
      stmt.finalize();
      res.json({ message: "CSV uploaded and data inserted." });
    });
});


// Get all products
app.get('/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
