const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createToken, getUserId } = require('../../utils');

const auth = {
  async refreshToken(parent, args, ctx, info) {
    const userId = getUserId(ctx);
    return createToken(userId);
  },

  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {...args, password}
    });

    return {
      token: createToken(user.id),
      user
    };
  },

  async login(parent, {email, password}, ctx, info) {
    const user = await ctx.db.query.user({where: {email}});
    if (!user) {
      return {
        error: {
          field: 'email',
          msg: 'No such user found for email'
        }
      };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
      return {
        error: {
          field: 'password',
          msg: 'Invalid password'
        }
      };
    }

    return {
      payload: {
        token: createToken(user.id),
        user
      }
    };
  }
};

module.exports = {auth};
