import { withFilter } from 'graphql-subscriptions';
import { requiresUserLogin } from '../authenticator';
import pubsub from '../pubsub';

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) => {
          console.log(payload, args, user);
          return (
            payload.teamId === args.teamId
            && ((payload.senderId === args.senderId && payload.receiverId === args.userId)
              || (payload.senderId === args.userId && payload.receiverId === args.senderId))
          );
        },
      ),
    },
  },
  DirectMessage: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }
      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
    reply: ({ id, reply }, args, { models }) => {
      if (reply) {
        return reply;
      }
      return models.DirectMessageThread.findAll({
        where: { messageId: id },
        order: [['created_at', 'ASC']],
      });
    },
  },
  DirectMessageThread: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }
      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
  Query: {
    getDirectMessages: requiresUserLogin.verifyAuthentication(
      async (parent, { teamId, receiverId }, { models, user }) => {
        const messages = await models.DirectMessage.findAll(
          {
            order: [['created_at', 'ASC']],
            where: {
              teamId,
              [models.sequelize.Op.or]: [
                {
                  [models.sequelize.Op.and]: [{ receiverId }, { senderId: user.id }],
                },
                {
                  [models.sequelize.Op.and]: [{ receiverId: user.id }, { senderId: receiverId }],
                },
              ],
            },
          },
          { raw: true },
        );

        // Update last opened time
        models.DirectMessageOpen.findOne({
          where: {
            teamId,
            userId: user.id,
            receiverId,
          },
        }).then((dmOpenObj) => {
          if (dmOpenObj) {
            // update
            dmOpenObj.update({ opened: new Date() });
            return;
          }
          // insert
          models.DirectMessageOpen.create({
            teamId,
            receiverId,
            userId: user.id,
            opened: new Date(),
          });
        });

        return messages;
      },
    ),
  },
  Mutation: {
    createDirectMessage: requiresUserLogin.verifyAuthentication(
      async (parent, args, { models, user }) => {
        try {
          const message = await models.DirectMessage.create({
            ...args,
            senderId: user.id,
          });

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            teamId: args.teamId,
            senderId: user.id,
            receiverId: args.receiverId,
            newDirectMessage: {
              ...message.dataValues,
              sender: {
                username: user.username,
              },
            },
            reply: [],
          });
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
    ),
    createDirectMessageThread: requiresUserLogin.verifyAuthentication(
      async (parent, args, { models, user }) => {
        try {
          await models.DirectMessageThread.create({
            ...args,
            senderId: user.id,
          });
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
    ),
  },
};
