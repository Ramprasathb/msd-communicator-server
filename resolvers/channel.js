export default {
  Mutation: {
    createChannel: (parent, args, { models }) => {
      try {
        models.Channel.create(args);
        return true;
      } catch (err) {
        console.error("Error occurred while creating Channel");
        return false; 
      }
    }
  }
};
