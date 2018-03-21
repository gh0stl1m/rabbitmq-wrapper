// Set global promise
global.Promise = require('bluebird');

// Libraries
const test = require('ava');

// Utilities
const RabbitMQConn = require('../drivers/rabbitmqConn');
const DirectExchange = require('../helpers/directExchange');
const TopicExchange = require('../helpers/topicExchange');
const FanautExchange = require('../helpers/fanautExchange');
const WorkQueue = require('../helpers/workQueue');

let directExchange;
let topicExchange;
let fanautExchange;
let workQueue;
test.before(() => {
  // Instance direct exchange
  directExchange = new DirectExchange({
  channelName: 'testChann',
  exchangeName: 'testExchange',
  });
  // Instance topic exchange
  topicExchange = new TopicExchange({
    channelName: 'testChannTopic',
    exchangeName: 'testExchangeTopic',
    });
  // Instance fanaut exchange
  fanautExchange = new FanautExchange({
    channelName: 'testChannFan',
    exchangeName: 'testExchangeFan',
  });
  // Work queue
  workQueue = new WorkQueue('workQueueChann');
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

// Topic Exchange tests
test.serial('Will send data to "testChannT" with topic exchange', async(t) => {
  const messageToSend = await topicExchange.sendData('testMessageTopic', 'testkeyTopic');
  t.pass();
});

test.cb('Will receive message "testMessageTopic" from the topic exchange', (t) => {
  const messageReceived = topicExchange.receiveData('testkeyTopic', (data) => {
    t.deepEqual(data, 'testMessageTopic');
    t.end()
  });
});

// Fanaut Exchange tests
test.serial('Will send data to "testChannF" with fanaut exchange', async(t) => {
  const messageToSend = await fanautExchange.sendData('testMessageFanaut');
  t.pass();
});

test.cb('Will receive message "testMessageTopic" from the topic exchange', (t) => {
  const messageReceived = fanautExchange.receiveData((data) => {
    t.deepEqual(data, 'testMessageFanaut');
    t.end()
  });
});

// Work Queue tests
test.serial('Will send data to "workQueueChann" with work queues', async(t) => {
  const messageToSend = await workQueue.sendData('testMessageWQ');
  t.pass();
});

test.cb('Will receive message "testMessageWQ" with work queues', (t) => {
  const messageReceived = workQueue.receiveData((data) => {
    t.deepEqual(data, 'testMessageWQ');
    t.end()
  });
});