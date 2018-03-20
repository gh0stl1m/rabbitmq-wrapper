// Set global promise
global.Promise = require('bluebird');

// Libraries
const test = require('ava');

// Utilities
const RabbitMQConn = require('./rabbitmqConn');

// You need to be ensure that the rabbitmq server is running
test('Will connect with the rabbitqm server', async(t) =>{
  const rabbitmqUri = 'amqp://localhost';
  const rabbitmqInstance = new RabbitMQConn(rabbitmqUri);
  const conn = await rabbitmqInstance.connect();
  t.pass();
});