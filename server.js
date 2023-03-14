const express = require('express')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

const { userExists, registerUser, getAllUsers, getAllStudents } = require('./database.js')
const { createToken, authenticatedUserInfo } = require('./authentication.js')
const port = 1337

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url}  `, req.body)
  next()
})

app.set("view-engine", "ejs")


app.listen(port, () => {
  console.log(`Server is listening on ${port}...`)
})

app.get("/", (req, res) => {
  res.redirect("/login");
})

app.get("/login", (req, res) => {
  res.render("login.ejs")
})

app.get("/register", (req, res) => {
  res.render("register.ejs")
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

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
  await registerUser(username, dbEncryption)
  res.sendStatus(200)
})

function isValidPassword(password) {
  if (!password) {
    return false
  }
  return password.length >= 8
}