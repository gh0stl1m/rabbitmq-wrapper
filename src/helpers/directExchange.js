// Libraries
const _debug = require('debug');
const Promise = require('bluebird');
// Utilities
const config = require('../config/rabbitmq');
const errors = require('../errors');
const ModuleError = require('../moduleError');
const { rabbitMQ: RabbitmqConnection } = require('../drivers');

const debugError = _debug('rabbitmq-wrapper:directExchange:error');
const debugData = _debug('rabbitmq-wrapper:directExchange:data');

// Instance from rabbitMQ connection
const rabbitMQConnection = new RabbitmqConnection(config.uri);

/**
 * Object that allow send and receive data to a queue with a direct exchange
 * @class DirectExchange
 */
class DirectExchange {
  /**
   * @constructor
   * @param { String } channelName - Name of channel
   * @param { String } exchangeName - Name of exchange
   * @param { Object } options - Options for assertQueue and assertExchange
   */
  constructor({ channelName, exchangeName, options = { queue: {}, exchange: {} } }) {
    this.channelName = channelName || '';
    this.exchangeName = exchangeName || '';
    this.options = options;

    // Channel configuration for queue
    this.waitChann = rabbitMQConnection.connect()
      .then((chann) => {
        chann.prefetch(1);
        const promiseExchange = chann.assertExchange(this.exchangeName, 'direct', this.options.exchange);
        const promiseQueue = chann.assertQueue(this.channelName, this.options.queue);
        return Promise.all([promiseExchange, promiseQueue])
          .then(() => {
            debugData('Exchange configuration success');
            this.queueChann = chann;
          })
          .catch((err) => {
            debugError('Error asserting queue or exchange: ', err.message);
            this.error = err;
          });
      });
  }
  /**
   * Method to send data to queue
   * @function
   * @param { String } message - Message to send
   * @param { String } routingKey - key to make binding
   * @param { Object } options - Options for message
   */
  async sendData(message, routingKey, options = {}) {
    // Validate errors in queue
    await this._validateAssert();
    const data = JSON.stringify(message);
    if (!message || !routingKey) throw new ModuleError(errors.FIELDS_REQUIRED, 'helper:directExchange');

    await this.queueChann.publish(this.exchangeName, routingKey, Buffer.from(data), options);
  }

  /**
   * Method to receive data from queue
   * @function
   * @param { String } routingKey - Key to make binding
   * @param { Function } Function to get message
   * @param { Objetc } options - Options for message
   */
  async receiveData(routingKey, callback, options = {}) {
    // Validate error in queue
    await this._validateAssert();
    await this.queueChann.bindQueue(this.channelName, this.exchangeName, routingKey);
    await this.queueChann.consume(
      this.channelName,
      (message) => {
        let data;
        debugData('Message received from queue: ', message.content);
        data = JSON.parse(message.content.toString());
        Promise.resolve(callback(data))
          .then(() => {
            this.queueChann.ack(message);
          });
      }, options);
  }

/**
 * @private
 * Private method to check errors
 */
  async _validateAssert() {
    await this.waitChann;
    if (!this.queueChann || this.error) {
      debugError('Error asserting queue: ', this.error);
      throw new ModuleError(errors.RABBITMQ_CONNECTION, 'helper:directExchange');
    }
  }
}

module.exports = DirectExchange;
