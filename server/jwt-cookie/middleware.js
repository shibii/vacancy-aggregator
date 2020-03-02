"strict";

const jwt = require("jsonwebtoken");
const JWTCookieError = require("./jwt-cookie-error");

/**
 * Cookie based jwt authentication middleware.
 * Reads token from 'req.cookies.token'.
 * On a successful token verification, payload
 * is added to the req object as 'payload'
 *
 * The implementation of this middleware is naive,
 * untested and most certainly unsafe.
 *
 * Not meant for public use.
 *
 * @example <caption>Example usage of the middleware.</caption>
 * require("dotenv").config();
 * const app = require("express")();
 * const cookieParser = require("cookie-parser");
 * app.use(cookieParser());
 * const jwtCookie = require("jwt-cookie");
 * app.use(
 *    // read https://www.npmjs.com/package/jsonwebtoken
 *    // for correct format for parameters
 *   jwtCookie.Middleware(process.env.SECRET, {
 *     algorithms: ["RS256"]
 *   })
 * );
 * // routes here require valid jwt cookie
 *
 * // send http error responses on authentication failures
 * app.use(jwtCookie.ErrorHandler())
 *
 * This function returns cookie based jwt authentication
 * middleware for express
 * @param {...*} config - jsonwebtoken librarys verify function parameters
 * @returns {function} express middleware.
 */
module.exports = (...config) => {
  if (config.length === 0)
    throw new Error(
      "jsonwebtoken library verification function parameters not passed to middleware"
    );

  return async (req, res, next) => {
    try {
      // check that the required token is present
      if (!req.cookies || !req.cookies.token) {
        return next(
          new JWTCookieError("Missing authentication token cookie.", 401)
        );
      }

      // verify the token
      try {
        const payload = jwt.verify(req.cookies.token, ...config);
        req.user = payload;
        return next();
      } catch (err) {
        return next(new JWTCookieError("Authentication token is invalid", 401));
      }
    } catch (err) {
      // handle unexpected errors gracefully
      return next(err);
    }
  };
};
