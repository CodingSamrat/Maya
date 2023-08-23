const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

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
  eventHandler(client);

  await client.login(process.env.TOKEN);
  console.log(`\nLogin Successfull! ✅  `);
};


module.exports = { StartBot };