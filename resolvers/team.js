import utils from '../util/util';
import { requiresUserLogin } from '../authenticator';

export default {
  Mutation: {
    createTeam: requiresUserLogin.verifyAuthentication(async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.create({ ...args, owner: user.id });
        await models.Channel.create({ name: 'general', teamId: team.id, public: true });
        await models.Channel.create({ name: 'random', teamId: team.id, public: true });
        return {
          success: true,
          team,
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
  Query: {
    allTeams: requiresUserLogin.verifyAuthentication((parent, args, { models, user }) => {
      console.log('User ID for Teams ', user.id);
      return models.Team.findAll({ where: { owner: user.id } }, { raw: true });
    }),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
