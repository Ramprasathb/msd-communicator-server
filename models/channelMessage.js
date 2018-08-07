export default (sequelize, DataTypes) => {
  const ChannelMessage = sequelize.define(
    "channel_message",
    {
      message: DataTypes.STRING
    },
    {
      underscored: true
    }
  );

  ChannelMessage.associate = models => {
    ChannelMessage.belongsTo(models.Channel, {
      foreignKey: { name: "channelId", field: "channel_id" }
    });
    ChannelMessage.belongsTo(models.User, {
      foreignKey: { name: "userId", field: "user_id" }
    });
  };

  return ChannelMessage;
};
