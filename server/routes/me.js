const express = require("express");
let router = express.Router();

router.get("/me", async (req, res, next) => {
  try {
    if (!req.user) return res.status(401);
    return res.status(200).json(req.user);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

module.exports = router;
