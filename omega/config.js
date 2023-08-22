// import { IntentsBitField  } from 'discord.js' ;
const {IntentsBitField} = require('discord.js');
module.exports = intents = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
];

