export default {
  Mutation: {
    createTeam: (parent, args, { models, user }) => {
      try {
        models.Team.create({ ...args, owner: user.id });
        return true;
      } catch (err) {
        console.error("Error Occurred while creating team");
        return false;
      }
    }
  }
};
