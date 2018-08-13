import { PubSub, withFilter } from 'graphql-subscriptions';
import { requiresUserLogin } from '../authenticator';

const pubsub = new PubSub();
const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => {
          console.log(pubsub, '8**&&^**');
          return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE);
        },
        (payload, args) => payload.channelId === args.channelId,
      ),
    },
  },
  ChannelMessage: {
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne(
        {
          where: { id: userId },
        },
        { raw: true },
      );
    },
  },
  Query: {
    getMessages: requiresUserLogin.verifyAuthentication((parent, { channelId }, { models }) => {
      const messages = models.ChannelMessage.findAll(
        { where: { channelId }, order: [['created_at', 'ASC']] },
        { raw: true },
      );
      return messages;
    }),
  },
  Mutation: {
    createChannelMessage: requiresUserLogin.verifyAuthentication(
      async (parent, args, { models, user }) => {
        try {
          const message = await models.ChannelMessage.create({ ...args, userId: user.id });
          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id,
              },
            });
            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues,
              },
            });
          };
          asyncFunc();

          return {
            success: true,
            message,
          };
        } catch (err) {
          console.error('Error occurred while creating Channel');
          return {
            success: false,
            errors: [{ field: 'message', message: 'Unable to send message' }],
          };
        }
      },
    ),
  },
};
