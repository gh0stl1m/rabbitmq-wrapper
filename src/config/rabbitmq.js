// Utilities
const prefix = require('./environment');

module.exports = {
  uri: process.env[`${prefix}RABBITMQ_URI`],
};