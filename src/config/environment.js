const dotenv = require('dotenv');

let environment;
let path;
const env = '.env';

switch (process.env.NODE_ENV) {
  case 'develop':
    environment = 'DEV_';
    path = `/src/${env}`;
    break;
  case 'production':
    environment = '';
    path = `/src/${env}`;
    break;
  default:
    environment = 'TEST_';
    path = `${process.env.HOME}/${env}`;
    break;
}
dotenv.config({ path });
const prefix = environment;

module.exports = dotenv;
