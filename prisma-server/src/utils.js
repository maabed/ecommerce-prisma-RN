const jwt = require('jsonwebtoken')

function getUserId(ctx, jwtToken) {
  let token = '';

  if (jwtToken) {
    token = jwtToken;
  } else {
    const Authorization = ctx.request.get('Authorization')
    token = Authorization.replace('Bearer ', '')
  }

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