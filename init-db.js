const sqlite3 = require('sqlite3').verbose()

const file = 'Users.db'
const db = new sqlite3.Database(file)

let errors = 0

db.serialize(() => {
	db.run(`
	CREATE TABLE Users (
		username TEXT NOT NULL PRIMARY KEY,
		name TEXT,
		role TEXT CHECK(role in ('student1', 'student2', 'teacher', 'admin')),
		password TEXT NOT NULL
	)`, {}, error => { errors++ })
})

console.log(`Number of errors: ` + errors)
