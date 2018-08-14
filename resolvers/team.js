import utils from '../util/util';
import { requiresUserLogin } from '../authenticator';

export default {
  Mutation: {
    createTeam: requiresUserLogin.verifyAuthentication(async (parent, args, { models, user }) => {
      try {
        const teamCreationResponse = await models.sequelize.transaction(async () => {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({ name: 'general', teamId: team.id, public: true });
          await models.Channel.create({ name: 'random', teamId: team.id, public: true });
          return team;
        });
        return {
          success: true,
          team: teamCreationResponse.dataValues,
        };
      } catch (err) {
        console.error('Error Occurred while creating team');
        return {
          success: false,
          errors: utils.generateErrorModel(err, models),
        };
      }
    }),
    addUserToTeam: requiresUserLogin.verifyAuthentication(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamLoadingPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
          const addedUserLoadingPromise = models.User.findOne({ where: { email } }, { raw: true });
          const [team, userToAdd] = await Promise.all([
            teamLoadingPromise,
            addedUserLoadingPromise,
          ]);

          if (team.owner !== user.id) {
            return {
              success: false,
              errors: [
                { feild: 'email', message: 'You are not authorized to add users to this team' },
              ],
            };
          }
          await models.Member.create({ userId: userToAdd.id, teamId });
          return {
            success: true,
          };
        } catch (err) {
          console.error('Error Occurred while adding user to team', err);
          return {
            success: false,
            errors: utils.generateErrorModel(err, models),
          };
        }
      },
    ),
  },
  Query: {
    ownedTeams: requiresUserLogin.verifyAuthentication((parent, args, { models, user }) => {
      console.log('User ID for Teams as Owner : ', user.id);
      return models.Team.findAll({ where: { owner: user.id } }, { raw: true });
    }),
    memberOfTeams: requiresUserLogin.verifyAuthentication((parent, args, { models, user }) => {
      console.log('User ID for Teams as Member', user.id);
      return models.Team.findAll(
        {
          include: {
            model: models.User,
            where: { id: user.id },
          },
        },
        { raw: true },
      );
    }),
    getTeamMembers: requiresUserLogin.verifyAuthentication(async (parent, { teamId }, { models }) => models.sequelize.query(
      'select * from users as u join members as m on m.user_id = u.id where m.team_id = ?',
      {
        replacements: [teamId],
        model: models.User,
        raw: true,
      },
    )),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
    directMessageMembers: ({ id }, args, { models, user }) => models.sequelize.query(
      'select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId',
      {
        replacements: { currentUserId: user.id, teamId: id },
        model: models.User,
        raw: true,
      },
    ),
  },
};
