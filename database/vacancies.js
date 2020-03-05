const sql = require("./sql");

module.exports = (db, pgp) => {
  let vacancies = {};

  vacancies.getFts = async parameters => {
    const { terms, userId, offsetId, limit } = parameters;
    // search terms and userId are not optional
    if (!terms | !userId) throw new Error("missing fields");

    const offsetClause = offsetId
      ? pgp.as.format("id < $<offsetId> AND", { offsetId })
      : "";

    const limitClause = limit ? pgp.as.format("LIMIT $<limit>", { limit }) : "";

    return db.any(sql.vacancies.getFts, {
      terms,
      userId,
      offsetClause,
      limitClause
    });
  };

  vacancies.getHidden = async parameters => {
    const { userId, offsetId, limit } = parameters;
    // search terms and userId are not optional
    if (!userId) throw new Error("missing fields");

    const offsetClause = offsetId
      ? pgp.as.format("vacancy_id < $<offsetId> AND", { offsetId })
      : "";

    const limitClause = limit ? pgp.as.format("LIMIT $<limit>", { limit }) : "";

    return db.any(sql.vacancies.getHidden, {
      userId,
      offsetClause,
      limitClause
    });
  };

  vacancies.getPinned = async parameters => {
    const { userId, offsetId, limit } = parameters;
    // search terms and userId are not optional
    if (!userId) throw new Error("missing fields");

    const offsetClause = offsetId
      ? pgp.as.format("vacancy_id < $<offsetId> AND", { offsetId })
      : "";

    const limitClause = limit ? pgp.as.format("LIMIT $<limit>", { limit }) : "";

    return db.any(sql.vacancies.getPinned, {
      userId,
      offsetClause,
      limitClause
    });
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
