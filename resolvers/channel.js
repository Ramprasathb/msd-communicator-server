import utils from '../util/util';
import { requiresUserLogin } from '../authenticator';

export default {
  Mutation: {
    createChannel: requiresUserLogin.verifyAuthentication(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.findOne({ where: { id: args.teamId } });
          if (team.owner !== user.id) {
            return {
              success: false,
              errors: [{ field: 'name', message: 'Not Authorized to create channels' }],
            };
          }
          const channels = await models.Channel.findAll({ where: { name: args.name } });
          if (channels) {
            let isDuplicateChannel = false;
            channels.forEach((channel) => {
              if (channel.teamId === args.teamId) {
                isDuplicateChannel = true;
              }
            });
            if (isDuplicateChannel) {
              return {
                success: false,
                errors: [{ field: 'name', message: 'Channel name has to be unique' }],
              };
            }
          }

          const channel = await models.Channel.create(args);
          return {
            success: true,
            channel,
          };
        } catch (err) {
          console.error('Error occurred while creating Channel', err);
          return {
            success: false,
            errors: utils.generateErrorModel(err, models),
          };
        }
      },
    ),
  },
};
