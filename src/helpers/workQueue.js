// Libraries
const _debug = require('debug');
const Promise = require('bluebird');
// Utilities
const config = require('../config/rabbitmq');
const errors = require('../errors');
const ModuleError = require('../moduleError');
const { rabbitMQ: RabbitmqConnection } = require('../drivers');

const debugError = _debug('rabbitmq-wrapper:simpleQueue:error');
const debugData = _debug('rabbitmq-wrapper:simpleQueue:data');

// Instance from rabbitMQ connection
const rabbitMQConnection = new RabbitmqConnection(config.uri);

/**
 * Object that allow send and receive data from queue directly
 * @class WorkQueue
 */
class WorkQueue {
  /**
   * @constructor
   * @param { String } channelName - Name of channel
   * @param { Object } options - options for assertQueue
   */
  constructor(channelName, options) {
    this.channelName = channelName || '';
    this.options = options || {};

    // Channel configuration for queue
    this.waitChann = rabbitMQConnection.connect()
      .then((chann) => {
        chann.prefetch(1);
        return chann.assertQueue(this.channelName, this.options)
          .then(() => {
            debugData('Queue assert success with name: ', this.channelName);
            this.queueChann = chann;
          });
      })
      .catch((err) => {
        debugError('Error asserting queue', err.message);
        this.error = err;
      });
  }
  /**
   * Method to send data to queue
   * @function
   * @param {*} message - Message to send to queue
   * @param {*} options - Message options
   */
  async sendData(message, options = {}) {
    // Validate error in queue
    await this._validateAssert();
    const data = JSON.stringify(message);
    if (!message) throw new ModuleError(errors.FIELDS_REQUIRED, 'helpers:workqueue');

    await this.queueChann.sendToQueue(this.channelName, Buffer.from(data), options);
  }

/**
 * Method to receive data from queue
 * @function
 * @param {*} options - Options consume method
 * @returns {*} data - Data received from queue
 */
  async receiveData(callback, options = {}) {
    // Validate error in queue
    await this._validateAssert();
    await this.queueChann.consume(
        this.channelName,
        (message) => {
          debugData('Message received from queue: ', message.content);
          let data;
          data = JSON.parse(message.content.toString());
          Promise.resolve(callback(data))
          .then(() => {
            this.queueChann.ack(message);
          });
        }, options);
  }
/**
 * @private
 * private method to check errors
 */
  async _validateAssert() {
    await this.waitChann;
    if (!this.queueChann || this.error) {
      debugError('Error asserting queue: ', this.error);
      throw new ModuleError(errors.RABBITMQ_CONNECTION, 'helpers:workqueue');
    }
  }
}

module.exports = WorkQueue;
