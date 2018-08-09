import jwt from 'jsonwebtoken';
import _ from 'lodash';
import passwordHash from 'password-hash';

export const createTokens = async (user, secret, refreshSecret) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '30m',
      issuer: 'msd',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    refreshSecret,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models, SECRET, REFRESH_SECRET) => {
  let userId = -1;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshTokenSecret = user.password + REFRESH_SECRET;

  try {
    jwt.verify(refreshToken, refreshTokenSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const authenticateLogin = async (email, password, models, SECRET, REFRESH_SECRET) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      success: false,
      errors: [{ field: 'email', message: 'e-mail not registered' }],
    };
  }

  const valid = await passwordHash.verify(password, user.password);
  if (!valid) {
    return {
      success: false,
      errors: [{ field: 'password', message: 'Password is not valid' }],
    };
  }

  const refreshSecretToken = user.password + REFRESH_SECRET;
  console.log(SECRET, ' --- ', refreshSecretToken);
  try {
    const [token, refreshToken] = await createTokens(user, SECRET, refreshSecretToken);

    return {
      success: true,
      token,
      refreshToken,
    };
  } catch (err) {
    console.log('Error occured while generating Token');
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Could not generate token' }],
    };
  }
};
