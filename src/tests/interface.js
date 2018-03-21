// Set global promise
global.Promise = require('bluebird');

// Libraries
const test = require('ava');

// Utilities
const errors = require('../errors');

// Interfaces
const { QueueFactory } = require('../interfaces');

test.serial('Should thrown an error if "kind" param is no passed', (t) => {
  try {
    const failInstance = QueueFactory({});
  } catch(err) {
    t.is(err.message, errors.KIND_AND_CHANNELNAME_REQUIRED);
    t.is(err.entity, 'interface:queueFactory');
  }
});

test.serial('Should thrown an error if "channelName" param is no passed', (t) => {
  try {
    const failInstance = QueueFactory({ kind: 'test' });
  } catch(err) {
    t.is(err.message, errors.KIND_AND_CHANNELNAME_REQUIRED);
    t.is(err.entity, 'interface:queueFactory');
  }
});

test.serial('Should thrown an error if kind of queue is not supported', (t) => {
  try {
    const failInstance = QueueFactory({ kind: 'test', channelName: 'testChann' });
  } catch(err) {
    t.is(err.message, errors.KIND_OF_QUEUE_NOT_SUPPORTED);
    t.is(err.entity, 'interface:queueFactory');
  }
});

test.serial('Should thrown an error if "exchangeName" param not passed', (t) => {
  try {
    const failInstance = QueueFactory({ kind: 'topic', channelName: 'testChannT' });
  } catch(err) {
    t.is(err.message, errors.EXCHANGE_NAME_REQUIRED);
    t.is(err.entity, 'interface:queueFactory');
  }
});

test.serial('Should create an instance of a work queue', (t) => {
  const workQueue = QueueFactory({ kind: 'work', channelName: 'workChann' });
  t.pass();
});

test.serial('Should create an instance of a direct exchange', (t) => {
  const directQueue = QueueFactory({
    kind: 'direct',
    channelName: 'directTestchann',
    exchangeName: 'directTestExchange',
  });
  t.pass();
});

test.serial('Should create an instance of a topic exchange', (t) => {
  const topicQueue = QueueFactory({
    kind: 'topic',
    channelName: 'topicTestchann',
    exchangeName: 'topicTestExchange',
  });
  t.pass();
});

test.serial('Should create an instance of a fanout exchange', (t) => {
  const fanoutQueue = QueueFactory({
    kind: 'fanout',
    channelName: 'fanoutTestchann',
    exchangeName: 'fanoutTestExchange',
  });
  t.pass();
});