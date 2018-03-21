// Libraries
const _ = require('lodash');
// Helpers
const {
  WorkQueue,
  TopicExchange,
  FanautExchange,
  DirectExchange,
} = require('../helpers');
const ModuleError = require('../moduleError');
const errors = require('../errors');

// Kind of queues sopported
const kindOfQueues = ['topic', 'fanout', 'direct', 'work'];

const QueueFactory = ({
  kind,
  channelName,
  exchangeName,
  options = { queue: {}, exchange: {} },
} = {}) => {
  if (!kind || !channelName) {
    throw new ModuleError(errors.KIND_AND_CHANNELNAME_REQUIRED, 'interface:queueFactory');
  }
  if(!(_.includes(kindOfQueues, kind))) {
    throw new ModuleError(errors.KIND_OF_QUEUE_NOT_SUPPORTED, 'interface:queueFactory');
  }
  if((kind !== 'work') && !exchangeName) {
    throw new ModuleError(errors.EXCHANGE_NAME_REQUIRED, 'interface:queueFactory');
  }
  let queueInstance;
  switch (kind) {
    case 'topic':
      queueInstance = new TopicExchange({
        channelName,
        exchangeName,
        options,
      })
      break;
    case 'fanout':
      queueInstance = new FanautExchange({
        channelName,
        exchangeName,
        options,
      });
      break;
    case 'direct':
      queueInstance = new DirectExchange({
        channelName,
        exchangeName,
        options,
      });
      break;
    case 'work':
      break;
    default:
      queueInstance = new WorkQueue(channelName, options.queue);
  }
  return queueInstance;
};

module.exports = QueueFactory;