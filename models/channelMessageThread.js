export default (sequelize, DataTypes) => {
  const ChannelMessageThread = sequelize.define('channel_message_thread', {
    message: DataTypes.STRING,
  });

  ChannelMessageThread.associate = (models) => {
    // 1:M
    ChannelMessageThread.belongsTo(models.ChannelMessage, {
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
      },
    });
    ChannelMessageThread.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id',
      },
    });
  };

  return ChannelMessageThread;
};
