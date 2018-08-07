import express from "express";
import { ApolloServer } from "apollo-server-express";
import properties from "./config/properties";

import typeDefs from "./schema";
import resolvers from "./resolvers";

import models from "./models";

const SERVER = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: {
    endpoint: "/graphql",
    settings: {
      "editor.theme": "dark"
    }
  }
});

const app = express();

SERVER.applyMiddleware({ app });

models.sequelize.sync({ force: true }).then(() => {
  app.listen(properties.APPLICATION_PORT);
});
