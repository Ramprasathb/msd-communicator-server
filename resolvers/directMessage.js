import { requiresUserLogin } from '../authenticator';

export default {
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
      return models.DirectMessageThread.findAll({ where: { messageId: id } });
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
    getDirectMessages: async (parent, { teamId, receiverId }, { models, user }) => models.DirectMessage.findAll(
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
    ),
  },
  Mutation: {
    createDirectMessage: requiresUserLogin.verifyAuthentication(
      async (parent, args, { models, user }) => {
        try {
          await models.DirectMessage.create({
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
