export default () => {
  const {
    NODE_ENV = 'development',
    PORT = 3000,
    PASSWORD_SALT_ROUNDS = '10',
    JWT_SECRET_KEY = 'secret-key',
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASSWORD = 'password',
    DB_NAME = 'bookstore',
    DB_POOL_SIZE = '10',
  } = process.env;

  return {
    NODE_ENV,
    PORT,
    PASSWORD_SALT_ROUNDS,
    JWT_SECRET_KEY,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_POOL_SIZE,
  };
};
