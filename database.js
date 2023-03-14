const sqlite3 = require('sqlite3').verbose()

const file = 'Users.db'
const db = new sqlite3.Database(file)

async function userExists(username) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Users WHERE username = $username `, { $username: username }, (error, rows) => {
      if (error) reject(error)
      else resolve(rows.length > 0)
    })
  })
}

async function registerUser(username, password) {
  const sql = `INSERT INTO Users (username, password) VALUES ($username, $password)`
  const params = { $username: username, $password: password }

  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Users", (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

async function getAllStudents() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Users WHERE role LIKE 'STUDENT%'", (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = { userExists, registerUser, getAllUsers, getAllStudents }
