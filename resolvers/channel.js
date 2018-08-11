import utils from '../util/util';
import { requiresUserLogin } from '../authenticator';

export default {
  Mutation: {
    createChannel: requiresUserLogin.verifyAuthentication(async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          success: true,
          channel,
        };
      } catch (err) {
        console.error('Error occurred while creating Channel');
        return {
          success: false,
          errors: utils.generateErrorModel(err, models),
        };
      }
    }),
  },
};
