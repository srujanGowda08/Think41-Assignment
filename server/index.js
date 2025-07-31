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

// =============================
// Step 1: Migrate to Departments Table
// =============================
function migrateToDepartmentsTable() {
  db.serialize(() => {
    // 1. Create departments table
    db.run(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // 2. Create new products_temp table with FK
    db.run(`
      CREATE TABLE IF NOT EXISTS products_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        description TEXT,
        department_id INTEGER,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    // 3. Migrate old product rows to temp table
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) return console.error("Error reading products:", err.message);

      rows.forEach((row) => {
        db.get("SELECT id FROM departments WHERE name = ?", [row.department], (err, dept) => {
          if (err) return console.error(err.message);

          if (dept) {
            insertProduct(row, dept.id);
          } else {
            db.run("INSERT INTO departments (name) VALUES (?)", [row.department], function (err) {
              if (err) return console.error(err.message);
              insertProduct(row, this.lastID);
            });
          }
        });
      });
    });

    function insertProduct(product, deptId) {
      db.run(`
        INSERT INTO products_temp (name, price, description, department_id)
        VALUES (?, ?, ?, ?)`,
        [product.name, product.price, product.description, deptId]
      );
    }

    // 4. Drop old products and rename new one
    db.run("DROP TABLE IF EXISTS products");
    db.run("ALTER TABLE products_temp RENAME TO products");
  });
}

// ⚠️ Uncomment and run once, then comment to avoid re-migrating
// migrateToDepartmentsTable();

// =============================
// Step 2: CSV Upload with Department Handling
// =============================
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach(p => {
        db.get("SELECT id FROM departments WHERE name = ?", [p.department], (err, dept) => {
          if (err) return console.error(err.message);

          const insertProduct = (deptId) => {
            db.run(`
              INSERT INTO products (name, price, description, department_id)
              VALUES (?, ?, ?, ?)`,
              [p.name, p.price, p.description, deptId]
            );
          };

          if (dept) {
            insertProduct(dept.id);
          } else {
            db.run("INSERT INTO departments (name) VALUES (?)", [p.department], function (err) {
              if (err) return console.error(err.message);
              insertProduct(this.lastID);
            });
          }
        });
      });

      res.json({ message: "CSV uploaded and products inserted with department references." });
    });
});

// =============================
// Step 3: GET APIs with JOIN
// =============================

// Get all products with department name
app.get('/products', (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.price, p.description, d.name AS department
    FROM products p
    JOIN departments d ON p.department_id = d.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single product by ID with department name
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.id, p.name, p.price, p.description, d.name AS department
    FROM products p
    JOIN departments d ON p.department_id = d.id
    WHERE p.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// =============================
// Start Server
// =============================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
