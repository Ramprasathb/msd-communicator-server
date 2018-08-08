import express from "express";
import { ApolloServer } from "apollo-server-express";
import properties from "./config/properties";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import models from "./models";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schemas")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);
const SERVER = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: {
    models,
    user: {
      id: 1
    }
  },
  playground: {
    endpoint: "/graphql",
    settings: {
      "editor.theme": "dark"
    }
  }
});

const app = express();

SERVER.applyMiddleware({ app });

models.sequelize.sync({ force: false }).then(() => {
  app.listen(properties.APPLICATION_PORT);
});
