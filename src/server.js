// dikerjakan oleh: distania_9

require('dotenv').config();
const createApp = require('./app');

const app = createApp();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = app.listen(port, host, () => {
  console.log(`Server OpenJob API berjalan pada http://${host}:${port}`);
});

module.exports = server;
