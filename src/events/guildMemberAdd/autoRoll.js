const { Client, GuildMember } = require('discord.js');
const Guild = require('../../Models/Guild');
const  sendNotification  = require('../../utils/sendNotification');
/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const guildObject = await Guild.findOne({ guildId: guild.id });
    if (!guildObject || !guildObject.autoRoleId) return;
    
    
    await member.roles.add(guildObject.autoRoleId).catch((err) => {
      sendNotification(`Error giving role automatically: ${err}\nMay be the bot role is lower than the target role trying to asign`, member);
    });
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};