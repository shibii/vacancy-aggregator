"strict";

const JWTCookieError = require("./jwt-cookie-error");

module.exports = () => {
  return async (err, req, res, next) => {
    try {
      if (err instanceof JWTCookieError) return res.sendStatus(err.code);
      return next(err);
    } catch (err) {
      // handle unexpected errors gracefully
      return next(err);
    }
  };
};
