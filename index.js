import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';

import properties from './config/properties';
import models from './models';
import { refreshTokens } from './authenticator';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const SECRET = properties.SECRET_KEY;
const REFRESH_SECRET = properties.REFRESH_SECRET_KEY;
const appPath = properties.APPLICATION_PATH;

const appServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    models,
    user: req.user,
    SECRET,
    REFRESH_SECRET,
  }),
  playground: {
    endpoint: appPath,
    settings: {
      'editor.theme': 'dark',
    },
  },
});

const authenticateUserMiddleware = async (request, response, next) => {
  const token = request.headers.token;
  if (token) {
    try {
      const user = jwt.verify(token, SECRET);
      console.log('User is logged in');
      request.user = user;
    } catch (err) {
      const refreshToken = request.headers.refreshToken;
      const newUserToken = await refreshTokens(token, refreshToken, models, SECRET, REFRESH_SECRET);
      if (newUserToken.token && newUserToken.refreshToken) {
        response.set('Access-Control-Expose-Headers', 'token, refreshToken');
        reponse.set('token', token);
        response.set('refreshToken', refreshToken);
      }
      request.user = newUserToken.user;
    }
    console.log(request.user);
  }
  next();
};

const app = express();
app.use(authenticateUserMiddleware);
appServer.applyMiddleware({ app });

models.sequelize.sync({ force: false }).then(() => {
  app.listen(properties.APPLICATION_PORT);
});
