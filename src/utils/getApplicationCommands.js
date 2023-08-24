const {Client} = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {*} guildId 
 * @returns 
 */
module.exports = async (client, guildId) => {
    let applicationCommands;

    if(guildId && process.env.DEBUG==="1"){
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
        console.log("[DEVELOPMENT]: " + guild.name + " guild")

    } else {
        applicationCommands = await client.application.commands;
        console.log("[PRODUCTION]")
    }

    await applicationCommands.fetch();
    return applicationCommands;
};