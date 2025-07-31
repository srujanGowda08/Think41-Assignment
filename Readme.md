# 🛒 Think41 Full-Stack E-Commerce Assignment

This project is a complete full-stack e-commerce web application built from scratch using **React (Frontend)** and **Node.js + Express + SQLite (Backend)**. It was developed as part of the Think41 Full-Stack Engineer Interview Assignment, covering 6 progressive milestones.

---

## 🚀 Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express, SQLite3
- **Other Tools**: Multer (for CSV upload), CSV-Parser, CORS

---

## ✅ Features

- Upload product data from CSV
- REST APIs for products
- Product listing & detail views
- Database refactoring using foreign keys
- Department API
- Filter products by department (in frontend)

---

## 📁 Project Structure

```
Think41-Assignment/
├── client/           # React frontend
├── server/           # Node.js + Express backend
│   ├── index.js      # Main backend logic
│   ├── products.db   # SQLite database
│   └── uploads/      # Temporary CSV uploads
├── .gitignore
├── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/srujanGowda08/Think41-Assignment.git
cd Think41-Assignment
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Running the App

#### Start Backend (Port: 5000)

```bash
cd server
node index.js
```

#### Start Frontend (Port: 3000)

```bash
cd ../client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📌 Milestones Completed

| Milestone | Description                          |
|-----------|--------------------------------------|
| 1         | Database Design & CSV Upload         |
| 2         | REST API for Products                |
| 3         | Frontend List & Detail View          |
| 4         | DB Refactoring with departments Table|
| 5         | Departments API                      |
| 6         | Department Filtering in Frontend     |

---

## 📂 Sample CSV Format

```csv
name,price,description,department
Laptop,49999,High-performance laptop,Electronics
T-Shirt,599,Cotton round-neck shirt,Clothing
Coffee Mug,199,Ceramic mug for coffee,Kitchen
```

You can upload this CSV via the `/upload` route using Postman or a frontend upload form.

---

## 🔥 Author

**Srujan G S**  
Full-Stack Developer | Java + React | Cognizant Intern  
[LinkedIn](https://www.linkedin.com/in/srujan-gs/)