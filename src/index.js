const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require('mongoose');

// Create a new client instance
const client = new Client({
  intents: (intents = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]),
});



const StartBot = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  eventHandler(client);

  await client.login(process.env.TOKEN);
  console.log(`\nLogin Successfull! ✅  `);
};


module.exports = { StartBot };