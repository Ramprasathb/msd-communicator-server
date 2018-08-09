const properties = {};

// DB Properties
properties.DB_USERNAME = 'ramprasath';
properties.DB_PASSWORD = '123456';
properties.DB_HOST = 'localhost';
properties.DB_PORT = 5432;
properties.DB_SCHEMA = 'msd_comm';

// Application Server properties
properties.APPLICATION_PORT = 8071;

// Authenticator
properties.SECRET_KEY = 'justanothersecretforlogin';
properties.REFRESH_SECRET_KEY = 'thisisarefreshsecretkey';

export default properties;
