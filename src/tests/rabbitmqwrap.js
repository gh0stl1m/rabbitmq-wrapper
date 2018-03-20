// Set global promise
global.Promise = require('bluebird');

// Libraries
const test = require('ava');

// Utilities
const RabbitMQConn = require('../drivers/rabbitmqConn');
const DirectExchange = require('../helpers/directExchange');

let directExchange;
test.before(() => {
  directExchange = new DirectExchange({
  channelName: 'testChann',
  exchangeName: 'testExchange',
  });
});

// You need to be ensure that the rabbitmq server is running
test.serial('Will connect with the rabbitqm server', async(t) =>{
  const rabbitmqUri = 'amqp://localhost';
  const rabbitmqInstance = new RabbitMQConn(rabbitmqUri);
  const conn = await rabbitmqInstance.connect();
  t.pass();
});

// Direct Exchange tests
test.serial('Will send data to "testChann" with direct exchange', async(t) => {
  const messageToSend = await directExchange.sendData('testMessage', 'testkeyDirect');
  t.pass();
});

test.cb('Will receive message "testMessage" from the direct exchange', (t) => {
  const messageReceived = directExchange.receiveData('testkeyDirect', (data) => {
    t.deepEqual(data, 'testMessage');
    t.end()
  });
});