/**
 * Class that create an error instance
 * @class BussinessError
 */
class BussinessError extends Error {
  /**
   * @constructor
   * @param {String} message - Error message
   * @param {String} entity - Who produces the error.
   */
  constructor(message, entity) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use the name of entity of who produces the error
    this.entity = entity;
  }
}

module.exports = BussinessError;
