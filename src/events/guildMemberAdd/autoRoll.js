const { Client, GuildMember } = require('discord.js');
const Guild = require('../../Models/Guild');

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
    console.log(1)
    await member.roles.add(guildObject.autoRoleId);
    console.log(2)
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};