export default (sequelize, DataTypes) => {
  const DirectMessageOpen = sequelize.define('direct_message_opened', {
    opened: DataTypes.DATE,
  });

  DirectMessageOpen.associate = (models) => {
    // 1:M
    DirectMessageOpen.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
    DirectMessageOpen.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id',
      },
    });
    DirectMessageOpen.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return DirectMessageOpen;
};
