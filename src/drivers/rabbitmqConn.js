// Libraries
const amqp = require('amqplib');
const _debug = require('debug');
// Utilities
const errors = require('../errors');
const BusinessError = require('../businessError');


const debugData = _debug('rabbitmq-wrapper:connection:data');
/**
 * Object that creates a connection with the rabbitMQ server,
 * this object receive an uri for make the connection
 * @class Connection
 */
class Connection {
  /**
   * @constructor
   * @param { String } uri - Server amqp uri connection
   */
  constructor(uri) {
    if (!uri) {
      throw new BusinessError(errors.RABBITMQ_CONNECTION, 'driver:connection');
    } else {
      this.uri = uri;
    }
  }

  /**
   * Method to create connection with rabbitMQ server
   * @method
   */
  async connect() {
    // Make connection ro rabbitMq server
    this.conn = await amqp.connect(this.uri);
    if (!this.conn) throw new Error(Errors.RABBITMQ_ERROR_CONNECTION);
    debugData('RabbitMQ connection success: ', this.conn);

    return await this.conn.createChannel();
  }
  /**
   * Method to discconect connection with rabbitMQ server
   * @method
   */
  async disconnect() {
    // Disconnect from rabbitMQ server
    const connectionClose = await this.conn.close();
    debugData('Closing connection ro rabbitMQ: ', connectionClose);
    return connectionClose;
  }
}

module.exports = Connection;
