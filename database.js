const sqlite3 = require('sqlite3').verbose()

const file = 'Users.db'
const db = new sqlite3.Database(file)

async function registerUser(username, name, role, password) {
  const sql = `INSERT INTO Users (username, name, role, password) VALUES ($username, $name, $role, $password)`
  const params = { $username: username, $name: name, $role: role, $password: password }

  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

function userExists(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Users WHERE username = $username `, { $username: username }, (error, rows) => {
      if (error)
        reject(error)
      else {
        resolve(rows)
      }
    })
  })
}

function getUsers() {
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
function getStudents() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Users where role like 'STUDENT%'", (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = { registerUser, userExists, getUsers, getStudents }
