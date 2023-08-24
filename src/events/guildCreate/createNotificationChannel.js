const guildModel = require("../../Models/Guild");
const { Client, Guild, ChannelType } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
    
  try {
    const guildObject = await guildModel.findOne({ guildId: guild.id });
    if (guildObject) {
        guild.channels.create({
            name: 'omega-mailbox',  
            type: ChannelType.GuildText, 
            topic: 'This is the channel where you will receive all notifications from Omega.'
        })
        .then( async (channel) => {
            guildObject.notificationChannelId =  channel.id;
             
            await guildObject.save();
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    console.log("Error creating Notification Channel: ", error);

  }
};
