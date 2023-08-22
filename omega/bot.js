// import { Client } from 'discord.js' ;
// import { intents  } from './config.js' ;

const {Client, IntentsBitField} = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: intents = [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
]});

// Event ready. When the bot is ready, this event is called.
client.on('ready', (c) => {
    console.log(`${client.user.tag} is now Online...🚀`)
});


// Event message. When a message is sent, this event is called.
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // If the message is sent by a bot, ignore it.

    if (message.content === 'ping') {
        const response =  fetch("http://example.com/movies.json");
        message.channel.send('pong pong pong!')
    }
});

// Event message. When a message is sent, this event is called.
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // If the message is sent by a bot, ignore it.

    if (message.content === '?') {
        message.channel.send('I\'m Omega to help!')
    }
});


// Start and Stop the bot. Handle the login and logout of the bot from the server.
const StartBot = async () => {
    await client.login(process.env.TOKEN);
    console.log(`\nLogin Successfull! ✅  `)
}

// const StopBot = async () => {
//     await client.destroy();
//     console.log(`\nBot is Offline! ❌`)
// }

module.exports = {StartBot};
