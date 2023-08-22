const express = require("express");
const router = express.Router();

const { StartBot } = require("../../omega/bot.js");

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Wellcome to Omega Bot",
    message: "The Server & Bot is working properly!",
  });
});

module.exports = router;
