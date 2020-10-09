"strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const pgPromise = require("pg-promise");
const vacancies = require("./vacancies");
const users = require("./users");

const pgp = pgPromise({
  extend(obj, dc) {
    obj.vacancies = vacancies(obj, pgp);
    obj.users = users(obj, pgp);
  },
});

// return timestamp as a string instead of a date object
let types = pgp.pg.types;
types.setTypeParser(1114, (str) =>
  //remove postfix
  str.replace(/\.[^.]*$/, "")
);

const database = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = { database, pgp };
