import utils from '../util/util';
import { requiresUserLogin } from '../authenticator';

export default {
  Mutation: {
    createTeam: requiresUserLogin.verifyAuthentication(async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          success: true,
        };
      } catch (err) {
        console.error('Error Occurred while creating team');
        return {
          success: false,
          errors: utils.generateErrorModel(err, models),
        };
      }
    }),
  },
};
