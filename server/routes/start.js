const express = require("express");
const router = express.Router();

const { StartBot } = require("../../omega/bot.js");

router.get("/", async (req, res, next) => {
  await StartBot();
  return res.status(200).json({
    title: "Statring Omega Bot",
    message: "Bot is now running!",
  });
});

module.exports = router;
