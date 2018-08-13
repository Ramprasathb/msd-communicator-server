import passwordHash from 'password-hash';
import utils from '../util/util';
import { authenticateLogin } from '../authenticator';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    registerUser: async (parent, { ...args, password }, { models }) => {
      try {
        if (!(password.length > 5 && password.length < 51)) {
          return {
            success: false,
            errors: [{ field: 'password', message: 'Password must be 6 - 50 Characters in length' }],
          };
        }
        const hashedPassword = passwordHash.generate(password);
        const user = await models.User.create({ ...args, password: hashedPassword });
        return {
          success: true,
          user,
        };
      } catch (err) {
        console.log('Error occured while registering User', err);
        return {
          success: false,
          errors: utils.generateErrorModel(err, models),
        };
      }
    },
    loginUser: (parent, { email, password }, { models, SECRET, REFRESH_SECRET }) => (
      authenticateLogin(email, password, models, SECRET, REFRESH_SECRET)
    ),
  },
};
