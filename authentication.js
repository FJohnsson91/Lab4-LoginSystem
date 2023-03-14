const jwt = require('jsonwebtoken')
require("dotenv").config()

const secret = process.env.SECRET

function createToken(payload) {
  let token = jwt.sign(payload, secret)
  return token
}

function authenticatedToken(req) {
  let authHeader = req.headers['authorization']
  if (!authHeader) {
    return null
  }

  let token = authHeader.substring(7)

  try {
    let decoded = jwt.verify(token, secret)
    console.log('Decoded token: ', decoded)
    return decoded

  } catch (error) {
    console.log('Decoding JWT failed: ' + error.message)
    return null
  }
}

module.exports = { createToken, authenticatedToken }