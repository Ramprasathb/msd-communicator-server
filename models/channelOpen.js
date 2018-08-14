export default (sequelize, DataTypes) => {
  const ChannelOpen = sequelize.define('channel_opened', {
    opened: DataTypes.DATE,
  });

  ChannelOpen.associate = (models) => {
    // 1:M
    ChannelOpen.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
    ChannelOpen.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return ChannelOpen;
};
