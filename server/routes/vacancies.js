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
    const userId = req.user.id;
    if (!userId) return res.sendStatus(400);

    const results = await database.vacancies.getHidden(userId);
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
    const terms = req.query.terms;
    const userId = req.user.id;
    if (!terms || !userId) return res.sendStatus(400);

    const results = await database.vacancies.query(terms, userId);
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

module.exports = router;
