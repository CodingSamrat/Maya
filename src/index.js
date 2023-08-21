require('dotenv').config(); // Load the .env file.
const { Client, IntentsBitField  } = require('discord.js') ;


const client = new Client(
    {
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ]
    }
);


// Event ready. When the bot is ready, this event is called.
client.on('ready', (c) => {
    console.log(`\n✅  ${client.user.tag} is ready !`)
});


// Event message. When a message is sent, this event is called.
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // If the message is sent by a bot, ignore it.

    if (message.content === 'ping') {
        message.channel.send('pong')
    }
});


// Login the bot with the token.
client.login(process.env.TOKEN)