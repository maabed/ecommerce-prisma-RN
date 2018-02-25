const jwt = require('jsonwebtoken')

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  const token = Authorization.replace('Bearer ', '')

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return userId
  }

  throw new AuthError()
}

const createToken = (userId) => jwt.sign({ userId: userId, expiresIn: '7d' }, process.env.APP_SECRET)

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  createToken,
  AuthError
}