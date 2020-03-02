const pgp = require("pg-promise");
const path = require("path");

module.exports = pgp.utils.enumSql(
  path.join(__dirname, "sql"),
  { recursive: true },
  file => {
    return new pgp.QueryFile(file, { minify: true });
  }
);
