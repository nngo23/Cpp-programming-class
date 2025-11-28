const sqlite = require("sqlite3").verbose()
const bcrypt = require("bcrypt")

const dbFile = new sqlite.Database("storage.db")

dbFile.serialize(() => {
  dbFile.run(`
    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temp_val REAL,
      hum_val REAL,
      light_val INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  dbFile.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT UNIQUE,
      hash TEXT
    )
  `)
})

function addMeasurement(t, h, l) {
  return new Promise((resolve, reject) => {
    dbFile.run(
      `INSERT INTO measurements (temp_val, hum_val, light_val) VALUES (?, ?, ?)`,
      [t, h, l],
      function (err) {
        err ? reject(err) : resolve(this.lastID)
      }
    )
  })
}

function getMeasurements(limit = 100) {
  return new Promise((resolve, reject) => {
    dbFile.all(
      `SELECT * FROM measurements ORDER BY created_at DESC LIMIT ?`,
      [limit],
      (err, data) => (err ? reject(err) : resolve(data))
    )
  })
}

async function register(username, password) {
  const hashed = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    dbFile.run(
      `INSERT INTO accounts (user, hash) VALUES (?, ?)`,
      [username, hashed],
      err => (err ? reject(err) : resolve())
    )
  })
}

async function login(username, password) {
  return new Promise((resolve, reject) => {
    dbFile.get(
      `SELECT * FROM accounts WHERE user = ?`,
      [username],
      async (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(false);
        resolve(await bcrypt.compare(password, row.hash));
      }
    )
  })
}

module.exports = {
  addMeasurement,
  getMeasurements,
  register,
  login
}