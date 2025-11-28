const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const app = express()
app.use(express.json())

// Database file
const dbPath = path.join(__dirname, "database.db")

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message)
  } else {
    console.log("Connected to SQLite database.")

    // Create table if not exists
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        )`,
      (err) => {
        if (err) console.error(err)
        else console.log("Table 'users' is ready.")

        // Insert sample user (only if table empty)
        db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
          if (row.count === 0) {
            db.run("INSERT INTO users (name) VALUES ('Alice')")
            console.log("Default user added.")
          }
        })
      }
    )
  }
})

// GET all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  });
});

// Add a user
app.post("/users", (req, res) => {
  const { name } = req.body
  db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name })
  })
})

// Start server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});
