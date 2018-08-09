import utils from '../util/util';

export default {
  Mutation: {
    createTeam: (parent, args, { models, user }) => {
      try {
        models.Team.create({ ...args, owner: user.id });
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
    },
  },
};
