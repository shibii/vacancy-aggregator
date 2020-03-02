const sql = require("./sql");

module.exports = (db, pgp) => {
  let users = {};

  users.getByEmail = async email => {
    return db.oneOrNone(sql.users.getByEmail, { email });
  };

  users.add = async (email, pwhash) => {
    return db.oneOrNone(sql.users.add, { email, pwhash });
  };

  users.hideVacancy = async (userId, vacancyId) => {
    return db.none(sql.users.hideVacancy, { userId, vacancyId });
  };

  users.unhideVacancy = async (userId, vacancyId) => {
    return db.none(sql.users.unhideVacancy, { userId, vacancyId });
  };

  users.pinVacancy = async (userId, vacancyId) => {
    return db.none(sql.users.pinVacancy, { userId, vacancyId });
  };

  users.unpinVacancy = async (userId, vacancyId) => {
    return db.none(sql.users.unpinVacancy, { userId, vacancyId });
  };

  return users;
};
