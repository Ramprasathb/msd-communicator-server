export default {
  Mutation: {
    createChannelMessage: (parent, args, { models, user }) => {
      try {
        models.ChannelMessage.create({ ...args, userId: user.id });
        return true;
      } catch (err) {
        console.error("Error occurred while creating Channel");
        return false;
      }
    }
  }
};
