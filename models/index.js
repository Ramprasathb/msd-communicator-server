import Sequelize from "sequelize";
import properties from "../config/properties";

const sequelize = new Sequelize(
  properties.DB_SCHEMA,
  properties.DB_USERNAME,
  properties.DB_PASSWORD,
  {
    dialect: "postgres",
    define: {
      underscored: true
    }
  }
);

const models = {
  User: sequelize.import("./user"),
  Team: sequelize.import("./team"),
  Channel: sequelize.import("./channel"),
  ChannelMessage: sequelize.import("./channelMessage")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;