const jwt = require('jsonwebtoken')
const { userExists } = require('./database')

require("dotenv").config()
const secret = process.env.SECRET

function createToken(payload) {
  let token = jwt.sign(payload, secret)
  return token
}

function verifyToken(object) {
  let token = jwt.verify(object, secret)
  return token
}

async function getToken(req) {
  const token = req.cookies.jwt
  const decryptedToken = jwt.verify(token, secret)
  const user = await userExists(decryptedToken.username)
  return user
}

function checkToken(req, res, next) {
  const token = req.cookies.jwt
  if (!token) return res.redirect('/identify')
  try {
    jwt.verify(token, secret)
    next()
  } catch (error) {
    console.error(error)
    res.status(403).redirect('/identify')
  }
}

const checkRole = roles => async (req, res, next) => {
  try {
    const user = await getToken(req)
    roles.includes(user.role) ? next() : res.sendStatus(401)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { checkRole, checkToken, getToken, verifyToken, createToken }