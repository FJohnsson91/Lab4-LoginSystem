const express = require('express')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

const { userExists, registerUser, getAllUsers, getAllStudents, getPasswordForUser } = require('./database.js')
const { createToken, authenticatedToken } = require('./authentication.js')
const port = 1337

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url}  `, req.body)
  next()
})

var dbEncryption

app.set("view-engine", "ejs")

app.listen(port, () => {
  console.log(`Server is listening on ${port}...`)
})

app.get("/", (req, res) => {
  res.redirect("/login")
})

app.get("/login", (req, res) => {
  res.render("login.ejs")
})

app.get("/register", (req, res) => {
  res.render("register.ejs")
})

app.get('/identify', (req, res) => {
  res.redirect('login')
})

app.post('/login', async (req, res) => {
  const { userID, password } = req.body
  if (userID && password) {
    var correctPassword = await getPasswordForUser(userID)
    var passwordMatches = await bcrypt.compare(password, correctPassword)
    if (passwordMatches) {
      let token = createToken(userID)
      res.render("start.ejs")
    }
    else {
      res.render("fail.ejs")
    }
  }
})

app.post('/register', async (req, res) => {
  const { username, name, role, password } = req.body

  if (await userExists(username)) {
    console.log('Username not available')
    res.sendStatus(400)
    return
  }

  if (!isValidPassword(password)) {
    console.log('Too easy password')
    res.sendStatus(400)
    return
  }
  dbEncryption = await bcrypt.hash(password, 10)
  await registerUser(username, name, role, dbEncryption)
  res.redirect('/login')
})

function isValidPassword(password) {
  if (!password) {
    return false
  }
  return password.length >= 8
}

/*createUsers('id1', 'user1', 'student1', 'password')
createUsers('id2', 'user2', 'student2', 'password2')
createUsers('id3', 'user3', 'teacher', 'password3')
createUsers('admin', 'admin', 'admin', 'admin')

async function createUsers(username, name, role, password) {
  dbEncryption = await bcrypt.hash(password, 10)
  await registerUser(username, name, role, dbEncryption)
}*/