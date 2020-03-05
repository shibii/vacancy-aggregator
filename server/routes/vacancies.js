const express = require("express");
let router = express.Router();
const { database } = require("../../database");

router.post("/vacancies/:id/pin", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = req.params.id;
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.pinVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/vacancies/:id/unpin", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = req.params.id;
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.unpinVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/vacancies/:id/hide", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = req.params.id;
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.hideVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/vacancies/:id/unhide", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = req.params.id;
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.unhideVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies/hidden", async (req, res, next) => {
  try {
    const { offsetId, limit } = req.query;
    const userId = req.user.id;
    // userId is not optional
    if (!userId) return res.sendStatus(400);

    let parameters = { limit, userId, offsetId };
    const results = await database.vacancies.getHidden(parameters);
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies/pinned", async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(400);

    const results = await database.vacancies.getPinned(userId);
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies", async (req, res, next) => {
  try {
    const { terms, offsetId, limit } = req.query;
    const userId = req.user.id;
    // search terms and userId are not optional
    if (!terms || !userId) return res.sendStatus(400);

    let parameters = { terms, limit, userId, offsetId };
    const results = await database.vacancies.getFts(parameters);
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

module.exports = router;
