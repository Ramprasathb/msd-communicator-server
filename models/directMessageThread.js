export default (sequelize, DataTypes) => {
  const DirectMessageThread = sequelize.define('direct_message_thread', {
    message: DataTypes.STRING,
  });

  DirectMessageThread.associate = (models) => {
    // 1:M
    DirectMessageThread.belongsTo(models.DirectMessage, {
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
      },
    });
    DirectMessageThread.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id',
      },
    });
  };

  return DirectMessageThread;
};
