import {} from "dotenv/config"; // Load .env file
import express from "express";
import { StartBot, StopBot } from "./omega/bot.js";

// Run the bot directly if the DEBUG mode is enabled
if (process.env.AUTO_RUN_BOT === "1") {
  StartBot();
} else {
  const app = express();
  const port = 3000;

  // Home route
  app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
  });

  // Start the bot
  app.post("/start", (req, res) => {
    StartBot();
    res.json({ message: "Bot started" });
  });

  // Stop the bot
  app.post("/stop", (req, res) => {
    StopBot();
    res.json({ message: "Bot stopped" });
  });

  // Restart the bot
  app.post("/restart", (req, res) => {
    StopBot();
    StartBot();
    res.json({ message: "Bot stopped" });
  });

  // Run the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
