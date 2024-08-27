export default () => ({
  port: parseInt(process.env['PORT'], 10),
  jwt_secret: process.env['JWT_SECRET'],

  dbHost: process.env['DB_HOST'],
  dbPort: parseInt(process.env['DB_PORT'], 10),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  dbName: process.env['DB_DATABASE'],
});
