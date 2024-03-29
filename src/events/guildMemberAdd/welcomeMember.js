const Guild = require('../../Models/Guild');

module.exports = async (client, member) => {
    
    try {
        const guildObject = await Guild.findOne({ guildId: member.guild.id });
        const guild = client.guilds.cache.get(member.guild.id);

        if (!guildObject || !guildObject.welcomeChannelId) return;

        const channel = member.guild.channels.cache.get(guildObject.welcomeChannelId);
        if (!channel) return;

        const message = `Hey ${member}!  \nWelcome to the **${guild}**`;
        channel.send(message);

    } catch (error) {
        console.log('Error to welcome user', error)
        
    }
}
