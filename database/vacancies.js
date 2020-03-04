const sql = require("./sql");

module.exports = (db, pgp) => {
  let vacancies = {};

  vacancies.getFtsNoOffset = async (terms, userId, limit) => {
    return db.any(sql.vacancies.getFtsNoOffset, {
      terms,
      userId,
      limit
    });
  };

  vacancies.getFts = async (terms, userId, offsetId, limit) => {
    return db.any(sql.vacancies.getFts, { terms, userId, offsetId, limit });
  };

  vacancies.getHidden = async userId => {
    return db.any(sql.vacancies.getHidden, { userId });
  };

  vacancies.getPinned = async userId => {
    return db.any(sql.vacancies.getPinned, { userId });
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
