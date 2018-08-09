import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import properties from './config/properties';

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const SECRET = properties.SECRET_KEY;
const REFRESH_SECRET = properties.REFRESH_SECRET_KEY;
const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1,
    },
    SECRET,
    REFRESH_SECRET,
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'dark',
    },
  },
});

const app = express();

SERVER.applyMiddleware({ app });

models.sequelize.sync({ force: false }).then(() => {
  app.listen(properties.APPLICATION_PORT);
});
