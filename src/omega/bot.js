import { Client } from 'discord.js' ;
import { intents  } from './config.js' ;

// Create a new client instance
const client = new Client({intents: intents});

// Event ready. When the bot is ready, this event is called.
client.on('ready', (c) => {
    console.log(`${client.user.tag} is now Online...🚀`)
});


// Event message. When a message is sent, this event is called.
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // If the message is sent by a bot, ignore it.

    if (message.content === 'ping') {
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
export const StartBot = async () => {
    await client.login(process.env.TOKEN);
    console.log(`\nLogin Successfull! ✅  `)
}

export const StopBot = async () => {
    await client.destroy();
    console.log(`\nBot is Offline! ❌`)
}

