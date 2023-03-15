const { checkRole, checkToken, verifyToken, createToken } = require('./authentication.js')
const { registerUser, userExists, getUsers, getStudents } = require('./database')
const express = require('express')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.set('view-engine', 'ejs')

let PORT = 1337
var dbEncryption

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`)
})

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const dbUser = await userExists(username)

  if (!dbUser) return res.status(400).render('fail.ejs')
  if (!password || !username) return res.status(400).render('fail.ejs')

  try {
    if (await bcrypt.compare(password, dbUser.password)) {
      const userObj = { username, role: dbUser.role }
      const token = createToken(userObj)
      res.cookie("jwt", token, { httpOnly: true }).status(200).redirect(`/users/${dbUser.username}`)
    } else {
      res.status(401).render('fail.ejs')
    }
  } catch (error) {
    console.log(error)
  }
})

app.get('/student1', checkToken, checkRole(['STUDENT1', 'TEACHER', 'ADMIN']), async (req, res) => {
  const user = await getToken(req)
  res.render('student1.ejs', { user })
})

app.get('/student2', checkToken, checkRole(['STUDENT2', 'TEACHER', 'ADMIN']), async (req, res) => {
  const user = await getToken(req)
  res.render('student2.ejs', { user })
})

app.get('/teacher', checkToken, checkRole(['TEACHER', 'ADMIN']), async (req, res) => {
  students = await getAllStudents()
  res.render('teacher.ejs', students)
})

app.get('/admin', checkToken, checkRole(['ADMIN']), async (req, res) => {
  users = await getAllUsers()
  res.render('admin.ejs', users)
})


app.get('/REGISTER', (req, res) => {
  res.render('register.ejs')
})

app.get('/users/:userid', checkToken, async (req, res) => {
  const { jwt: token } = req.cookies
  const { username: decryptedUsername } = verifyToken(token)
  const user = await userExists(decryptedUsername)

  decryptedUsername !== req.params.userid
    ? res.sendStatus(401)
    : {
      STUDENT1: () => res.render('student1.ejs', { user }),
      STUDENT2: () => res.render('student2.ejs', { user }),
      TEACHER: async () => {
        const students = await getStudents()
        res.render('teacher.ejs', { students })
      },
      ADMIN: async () => {
        const users = await getUsers()
        res.render('admin.ejs', { users })
      },
    }[user.role]?.()
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

/*createUsers('id1', 'user1', 'STUDENT1', 'password')
createUsers('id2', 'user2', 'STUDENT2', 'password2')
createUsers('id3', 'user3', 'TEACHER', 'password3')
createUsers('admin', 'admin', 'ADMIN', 'admin')

async function createUsers(username, name, role, password) {
  let encryptedPassword = await bcrypt.hash(password, 10)
  await registerUser(username, name, role, encryptedPassword)
}*/