import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
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
  subscriptions: {
    execute,
    subscribe,
    onConnect: async ({ token, refreshToken }, webSocket) => {
      if (token && refreshToken) {
        console.log('_--------- TOken and Ref Token are set');
        let user = null;
        try {
          const payload = jwt.verify(token, SECRET);
          user = payload.user;
        } catch (err) {
          const newTokens = await refreshTokens(
            token,
            refreshToken,
            models,
            SECRET,
            REFRESH_SECRET,
          );
          user = newTokens.user;
        }
        if (!user) {
          throw new Error('Invalid auth tokens');
        }

        return true;
      }

      throw new Error('Missing auth tokens!');
    },
    path: '/subscriptions',
  },
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
  // eslint-disable-next-line prefer-destructuring
  const token = request.headers.token;
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      request.user = user;
    } catch (err) {
      // eslint-disable-next-line prefer-destructuring
      const refreshToken = request.headers.refreshToken;
      const newUserToken = await refreshTokens(token, refreshToken, models, SECRET, REFRESH_SECRET);
      if (newUserToken.token && newUserToken.refreshToken) {
        response.set('Access-Control-Expose-Headers', 'token, refreshToken');
        response.set('token', token);
        response.set('refreshToken', refreshToken);
      }
      request.user = newUserToken.user;
    }
  }
  next();
};

const app = express();
app.use(authenticateUserMiddleware);
appServer.applyMiddleware({ app });

const httpServer = createServer(app);
appServer.installSubscriptionHandlers(httpServer);

models.sequelize.sync({ force: false }).then(() => {
  httpServer.listen(properties.APPLICATION_PORT, () => {
    console.log(`🚀 Server ready at ${appServer.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ${appServer.subscriptionsPath}`);
  });
});
