/**
 * Error type thrown on expected errors states
 *
 * @class JWTCookieError
 * @extends {Error}
 */
class JWTCookieError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = JWTCookieError;
