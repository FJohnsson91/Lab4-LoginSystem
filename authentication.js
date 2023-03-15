const { userExists } = require('./database.js')

const jwt = require('jsonwebtoken')
require("dotenv").config()

const secret = process.env.SECRET

function createToken(payload) {
  let token = jwt.sign(payload, secret)
  return token
}

function authenticatedToken(req) {
  if (!req.cookies.userToken) {
    res.redirect("/login")
  } else if (jwt.verify(req.cookies.userToken, secret)) {
    next()
  } else {
    res.redirect("/login")
  }
}

async function userFromToken(req) {
  const token = req.cookies.jwt
  const decryptedToken = jwt.verify(token, secret)
  const user = await userExists(decryptedToken.username)
  return user
}

function roleFromToken(requiredRoles) {
  return async (req, res, next) => {
    try {
      const user = await userFromToken(req)

      if (requiredRoles.includes(user.role)) {
        next()
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { createToken, authenticatedToken }