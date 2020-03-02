const sql = require("./sql");

module.exports = (db, pgp) => {
  let vacancies = {};

  vacancies.query = async (str, userId) => {
    return db.any(sql.vacancies.query, { terms: str, userId });
  };

  vacancies.insertcs = new pgp.helpers.ColumnSet(
    ["url", "header", "contents", "source"],
    {
      table: "vacancies"
    }
  );
  vacancies.insert = async values => {
    const query =
      pgp.helpers.insert(values, vacancies.insertcs) +
      " ON CONFLICT DO NOTHING";
    return db.none(query);
  };

  vacancies.getUnparsedUrls = async urls => {
    const qvalues = pgp.helpers.values(urls, ["url"]);
    return db.any(sql.vacancies.getUnparsedUrls, qvalues);
  };

  return vacancies;
};
