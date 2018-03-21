// Set global promise
global.Promise = require('bluebird');

// Libraries
const test = require('ava');

// Utilities
const errors = require('../errors');
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
test.serial('Should connect with the rabbitqm server', async(t) =>{
  const rabbitmqUri = 'amqp://localhost';
  const rabbitmqInstance = new RabbitMQConn(rabbitmqUri);
  const conn = await rabbitmqInstance.connect();
  t.pass();
});

// Direct Exchange tests
test.serial('Should send data to "testChann" with direct exchange', async(t) => {
  const messageToSend = await directExchange.sendData('testMessage', 'testkeyDirect');
  t.pass();
});

test.serial('Should throw an error if a message is not passed to send it to the direct queue', async(t) => {
  try {
    const messageToSend = await directExchange.sendData();
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helper:directExchange');
  }
});

test.serial('Should throw an error if a routing key is not passed to send it to the direct queue', async(t) => {
  try {
    const messageToSend = await directExchange.sendData('testMessage');
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helper:directExchange');
  }
});

test.cb('Should receive message "testMessage" from the direct exchange', (t) => {
  const messageReceived = directExchange.receiveData('testkeyDirect', (data) => {
    t.deepEqual(data, 'testMessage');
    t.end()
  });
});

// Topic Exchange tests
test.serial('Should send data to "testChannT" with topic exchange', async(t) => {
  const messageToSend = await topicExchange.sendData('testMessageTopic', 'testkeyTopic');
  t.pass();
});

test.serial('Should throw an error if a message is not passed to send it to the topic queue', async(t) => {
  try {
    const messageToSend = await topicExchange.sendData();
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helper:topicExchange');
  }
});

test.serial('Should throw an error if a routing key is not passed to send it to the topic queue', async(t) => {
  try {
    const messageToSend = await topicExchange.sendData('testMessageTopic');
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helper:topicExchange');
  }
});

test.cb('Should receive message "testMessageTopic" from the topic exchange', (t) => {
  const messageReceived = topicExchange.receiveData('testkeyTopic', (data) => {
    t.deepEqual(data, 'testMessageTopic');
    t.end()
  });
});

// Fanaut Exchange tests
test.serial('Should send data to "testChannF" with fanaut exchange', async(t) => {
  const messageToSend = await fanautExchange.sendData('testMessageFanaut');
  t.pass();
});

test.serial('Should throw an error if a message is not passed to send it to the fanout queue', async(t) => {
  try {
    const messageToSend = await fanautExchange.sendData();
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helper:fanautExchange');
  }
});

test.cb('Should receive message "testMessageFanaut" from the fanout exchange', (t) => {
  const messageReceived = fanautExchange.receiveData((data) => {
    t.deepEqual(data, 'testMessageFanaut');
    t.end()
  });
});

// Work Queue tests
test.serial('Should send data to "workQueueChann" with work queues', async(t) => {
  const messageToSend = await workQueue.sendData('testMessageWQ');
  t.pass();
});

test.serial('Should throw an error if a message is not passed to send it to the work queue', async(t) => {
  try {
    const messageToSend = await workQueue.sendData();
  } catch (err) {
    t.is(err.message, errors.FIELDS_REQUIRED);
    t.is(err.entity, 'helpers:workqueue');
  }
});

test.cb('Should receive message "testMessageWQ" with work queues', (t) => {
  const messageReceived = workQueue.receiveData((data) => {
    t.deepEqual(data, 'testMessageWQ');
    t.end()
  });
});